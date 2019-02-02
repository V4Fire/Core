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
	concatUrls = require('urlconcat').concat,
	o = require('uniconf/options').option;

const
	fs = require('fs-extra-promise'),
	path = require('path'),
	url = require('url'),
	isPathEqual = require('path-equal').pathEqual;

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
	 * Creates config object with the specified options
	 *
	 * @template T
	 * @param {!Array<string>} dirs - list of init directories ([0] - dirname, [1+] - src fields)
	 * @param {Object=} [envs] - map of path environments
	 * @param {T} opts
	 * @returns {C<T>}
	 */
	createConfig({dirs, envs}, opts) {
		if (envs) {
			this.extend(env, envs, $C.clone(env));
		}

		const
			proto = Object.getPrototypeOf(opts);

		function setProto(obj, link = []) {
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

				setProto(el, key);
			});
		}

		setProto(opts);

		const
			config = this.extend(Object.create(proto), opts),
			p = this.getSrcMap(dirs[0]);

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

			config.src[nm] = (this.src[nm] || []).concat(src);
		});

		function bindObjCtx(obj) {
			$C(obj).object(true).forEach((el, key) => {
				if (Object.isFunction(el)) {
					if (isPathEqual(path.join(process.cwd(), 'config'), dirs[0])) {
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

		if (isPathEqual(path.join(process.cwd(), 'config'), dirs[0])) {
			bindObjCtx(config);
		}

		if (envs) {
			$C(Object.keys(envs)).forEach((nm) => {
				config.envs[nm] = env[nm];
			});
		}

		config.extend = this.extend;
		return config;
	}

	/**
	 * Returns src map by the specified init directory
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
		dirs: [__dirname, 'client', 'server'],
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

		lang: o('lang', {
			env: true,
			default: 'en',
			coerce(value) {
				global['LANG'] = value;
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
			return this.api.proxy ? concatUrls(this.api.pathname(), 'api') : this.api.url;
		},

		api: {
			proxy: true,

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
					lang: this.lang,
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
			return {
				transpileOnly: true
			};
		},

		src: {
			cwd() {
				return this.roots[this.roots.length - 1] || resolve.cwd;
			},

			include() {
				return require('../build/include')(this.roots);
			},

			rel(field, ...args) {
				const path = require('upath');
				return path.join(path.relative(this.cwd(), this[field] ? this[field]() : field), ...args);
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
				return path.resolve(this.cwd(), 'dist', ...arguments);
			},

			clientOutput() {
				return path.resolve(this.output(), 'client', ...arguments);
			},

			serverOutput() {
				return path.resolve(this.output(), 'server', ...arguments);
			}
		}
	}
);

global.isProd = false;
global.include = require;

Object.defineProperties(global, {
	include: {
		get() {
			return require('config').src.include();
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
