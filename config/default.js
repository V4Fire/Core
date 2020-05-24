'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

require('dotenv').config();

const
	$C = require('collection.js'),
	Sugar = require('sugar').extend(),
	o = require('uniconf/options').option;

const
	path = require('path'),
	upath = require('upath'),
	isPathEqual = require('path-equal').pathEqual;

const
	fs = require('fs-extra-promise'),
	url = require('url');

const
	{config: pzlr, resolve} = require('@pzlr/build-core'),
	{env} = process;

const
	origin = Symbol('Original function');

/** @template C */
class Config {
	constructor() {
		this.src = {};
		this.envs = {};

		/** @type {Array<string>} */
		this.roots = [];

		/** @type {Array<string>} */
		this.client = [];

		/** @type {Array<string>} */
		this.server = [];
	}

	/**
	 * Wrapper for $C.extend
	 *
	 * @param {...?} args
	 * @returns {!Object}
	 */
	extend(...args) {
		return $C.extend({
			deep: true,
			withProto: true,
			concatArray: true,
			concatFn: Sugar.Array.union
		}, ...args);
	}

	/**
	 * Expands the specified config
	 *
	 * @param {!Object} config
	 * @param {!Object} obj
	 * @returns {!Object}
	 */
	expand(config, obj) {
		const expand = (config, obj) => {
			$C(obj).forEach((el, key) => {
				if (Object.isFunction(el)) {
					if (!el.length) {
						try {
							config[key] = el.call(obj);
		
						} catch {}
					}
		
				} else if (Object.isObject(el)) {
					config[key] = {};
					config[key] = expand(config[key], el);
		
				} else if (Object.isArray(el)) {
					config[key] = [];
					config[key] = expand(config[key], el);
		
				} else {
					config[key] = el;
				}
			});

			return config;
		}

		return expand(config, obj);
	}

	/**
	 * Creates a config object with the specified options and returns it
	 *
	 * @template T
	 * @param {!Array<string>} dirs - list of init directories ([0] - dirname, [1+] - src fields)
	 * @param {Object=} [envs] - map of environment variables
	 * @param {(string|Object)=} [mod] - url for a config modifier or an object modifier (env configs)
	 * @param {T} opts
	 * @returns {!Object}
	 */
	createConfig({dirs, envs, mod}, opts) {
		const
			activeDir = dirs[0],
			isActiveConfig = isPathEqual(path.join(process.cwd(), 'config'), activeDir);

		if (envs) {
			this.extend(env, envs, $C.clone(env));
		}

		function setProto(obj, proto, link = []) {
			$C(obj).forEach((el, key) => {
				if (!el || typeof el !== 'object') {
					return;
				}

				key = [...link, key];

				const
					parent = $C(proto).get(key);

				if (parent && el !== parent) {
					Object.setPrototypeOf(el, parent);
				}

				setProto(el, proto, key);
			});
		}

		const
			modObj = mod ? include(mod, activeDir) : undefined,
			proto = modObj || Object.getPrototypeOf(opts);

		setProto(opts, proto);
		Object.setPrototypeOf(opts, proto);

		const
			config = this.extend(Object.create(proto), opts),
			p = this.getSrcMap(activeDir);

		$C(['roots'].concat(dirs.slice(1))).forEach((nm, i) => {
			let src;

			if (i) {
				if ({client: true, server: true}[nm]) {
					const s = p.pzlr;
					src = path.join(p.src, (nm === 'client' ? s.blockDir : s.serverDir) || '');

				} else {
					src = p.src;
				}

			} else {
				src = p.root;
			}

			config.src[nm] = (this.src[nm] || []).union(src);
		});

		function bindObjCtx(obj) {
			$C(obj).object(true).forEach((el, key) => {
				if (Object.isFunction(el)) {
					if (isPathEqual(path.join(process.cwd(), 'config'), activeDir)) {
						const
							o = el[origin] = el[origin] || el,
							ctx = Object.assign(Object.create({config}), obj);

						obj[key] = Object.assign(o.bind(ctx), {[origin]: o});
					}

				} else {
					obj[key] = el;

					if (el && typeof el === 'object') {
						bindObjCtx(el);
					}
				}
			});
		}

		if (isActiveConfig) {
			bindObjCtx(config);
		}

		if (envs) {
			$C(Object.keys(envs)).forEach((nm) => {
				config.envs[nm] = env[nm];
			});
		}

		config.extend = this.extend;
		config.expand = this.expand;
		return config;
	}

	/**
	 * Returns a map with paths of the specified init directory
	 *
	 * @param {string} dir - init directory (usually __dirname)
	 * @returns {{root: string, src: string, pzlr: {blockDir: (string|undefined), serverDir: (string|undefined)}}}
	 */
	getSrcMap(dir) {
		const
			root = path.join(dir, '../'),
			pzlr = /** @type {{sourceDir: string}} */ fs.readJSONSync(path.join(root, '.pzlrrc'));

		return {
			pzlr,
			root,
			src: path.join(root, pzlr.sourceDir)
		};
	}
}

const config = new Config();
module.exports = config.createConfig(
	{
		dirs: [
			__dirname,
			'client',
			'server'
		],

		envs: {
			NODE_ENV: 'development'
		}
	},

	{
		__proto__: config,

		appName: o('app-name', {
			env: true,
			default: 'Default app',
			coerce(value) {
				global['APP_NAME'] = value;
				return value;
			}
		}),

		locale: o('locale', {
			env: true,
			default: 'en-US',
			coerce(value) {
				global['LOCALE'] = value;
				return value;
			}
		}),

		environment: o('environment', {
			env: true,
			short: 'e',
			default: env.NODE_ENV,
			coerce(value) {
				value = {prod: 'production', dev: 'development', stage: 'staging'}[value] || value;
				env.NODE_ENV = value;
				return value;
			}
		}),

		apiURL() {
			const concatUrls = require('urlconcat').concat;
			return this.api.proxy ? concatUrls(this.api.pathname(), 'api') : this.api.url;
		},

		api: {
			proxy: o('api-proxy', {
				env: true,
				type: 'boolean',
				default: true
			}),

			url: o('api-url', {
				env: true,
				default: ''
			}),

			port: o('port', {
				env: true,
				type: 'number',
				default: 3333,
				validate(value) {
					return Number.isFinite(value) && (value > 0) && (value < 65536);
				}
			}),

			host() {
				return o('host-url', {
					env: true,
					default: `http://localhost:${this.port}/`
				});
			},

			pathname() {
				return o('base-path', {
					env: true,
					default: url.parse(this.host()).pathname || '/'
				});
			},

			schema: {

			}
		},

		build: {
			id() {
				return o('build-id', {
					env: true,
					default: (() => {
						if (!isProd) {
							const username = env.USER || env.USERNAME || 'unknown';
							return `debug version${username ? `, author: ${username}` : ''}`;
						}

						return null;
					})()
				});
			}
		},

		snakeskin() {
			return {
				pack: false,

				filters: {
					global: ['undef']
				},

				vars: {
					...this.envs,
					appName: this.appName,
					locale: this.locale,
					version: include('package.json').version,
					buildVersion: this.build.id(),
					isProd
				}
			};
		},

		babel() {
			return {
				plugins: [],
				compact: false
			};
		},

		typescript() {
			const
				es = this.es(),
				importHelpers = Boolean({ES3: true, ES5: true, ES6: true}[es]);

			return {
				transpileOnly: true,
				compilerOptions: {
					target: es,
					importHelpers
				}
			};
		},

		es() {
			return o('es', {
				env: true,
				default: 'ES5'
			});
		},

		src: {
			cwd() {
				return this.roots[this.roots.length - 1] || resolve.cwd;
			},

			include() {
				return require('../build/include')(this.roots);
			},

			rel(field, ...args) {
				return upath.join(upath.relative(this.cwd(), this[field] ? this[field]() : field), ...args);
			},

			lib() {
				return path.resolve(resolve.lib, ...arguments);
			},

			src() {
				return path.resolve(resolve.sourceDir, ...arguments);
			},

			assets() {
				return path.resolve(this.src(), pzlr.assets.dir, ...arguments);
			},

			output() {
				const v = o('output', {
					env: true,
					default: 'dist'
				});

				return path.resolve(this.cwd(), v, ...arguments);
			},

			clientOutput() {
				const v = o('client-output', {
					env: true,
					default: 'client'
				});

				return this.output(v, ...arguments);
			},

			serverOutput() {
				const v = o('server-output', {
					env: true,
					default: 'server'
				});

				return this.output(v, ...arguments);
			}
		}
	}
);

global.isProd = false;
global.include = require;

Object.defineProperties(global, {
	include: {
		get() {
			return require(path.join(process.cwd(), 'config/default')).src.include();
		}
	},

	API_URL: {
		get() {
			return require('config').apiURL();
		}
	},

	isProd: {
		get() {
			return require('config').environment === 'production';
		}
	},

	IS_PROD: {
		get() {
			return isProd;
		}
	}
});
