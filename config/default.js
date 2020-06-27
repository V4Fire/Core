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
	 * Expands the specified config to a plain object.
	 * Usually, this method is used to hash the config object.
	 *
	 * @param {Object=} [config]
	 * @returns {!Object}
	 */
	expand(config = this) {
		const blacklist = Object.assign(Object.create(null), {
			extend: true,
			expand: true,
			createConfig: true,
			hash: true
		});

		const reduce = (from, to) => {
			$C(from).forEach((el, key) => {
				if (blacklist[key]) {
					return;
				}

				if (Object.isFunction(el)) {
					if (!el.length) {
						try {
							to[key] = el.call(from);

						} catch {}
					}

				} else if (Object.isObject(el)) {
					to[key] = {};
					to[key] = reduce(el, to[key]);

				} else if (Object.isArray(el)) {
					to[key] = [];
					to[key] = reduce(el, to[key]);

				} else {
					to[key] = el;
				}
			});

			return to;
		};

		return reduce(config, {});
	}

	/**
	 * Returns a hash string of the config
	 *
	 * @param {Object=} [data] - extra data to hash
	 * @param {string=} [alg] - hash algorithm
	 * @param {number} [length] - hash length
	 * @returns {string}
	 */
	hash({data, alg = 'md5', length} = {}) {
		const
			objectHash = require('node-object-hash'),
			val = objectHash().hash({config: this.expand(), ...data}, {alg});

		if (length) {
			return val.slice(0, length);
		}

		return val;
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
							o = el[origin] || el,
							ctx = Object.assign(Object.create({config}), obj);

						el[origin] = o;
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

		config.hash = this.hash;
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
			pzlr = fs.readJSONSync(path.join(root, '.pzlrrc'));

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

		/**
		 * Application name
		 */
		appName: o('app-name', {
			env: true,
			default: 'Default app',
			coerce(value) {
				globalThis['APP_NAME'] = value;
				return value;
			}
		}),

		/**
		 * Default application language
		 */
		locale: o('locale', {
			env: true,
			default: 'en-US',
			coerce(value) {
				globalThis['LOCALE'] = value;
				return value;
			}
		}),

		/**
		 * Application environment (prod, stage, etc.)
		 */
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

		/**
		 * Resolved URL for server API
		 * @returns {?string}
		 */
		apiURL() {
			const concatUrls = require('urlconcat').concat;
			return this.api.proxy ? concatUrls(this.api.pathname(), 'api') : this.api.url;
		},

		/**
		 * Options to manage server API.
		 * Usually, it's used with a develop server.
		 */
		api: {
			/**
			 * True, if the application should use proxy to connect to a server
			 */
			proxy: o('api-proxy', {
				env: true,
				type: 'boolean',
				default: true
			}),

			/**
			 * Base server API URL
			 */
			url: o('api-url', {
				env: true,
				default: ''
			}),

			/**
			 * Server port to launch
			 */
			port: o('port', {
				env: true,
				type: 'number',
				default: 3333,
				validate(value) {
					return Number.isFinite(value) && value > 0 && value < 65536;
				}
			}),

			/**
			 * Returns URL of the launched server
			 * @returns {string}
			 */
			host() {
				return o('host-url', {
					env: true,
					default: `http://localhost:${this.port}/`
				});
			},

			/**
			 * Returns a pathname of the launched server
			 * @returns {string}
			 */
			pathname() {
				return o('base-path', {
					env: true,
					default: url.parse(this.host()).pathname || '/'
				});
			},

			schema: {

			}
		},

		/**
		 * Options to build the application
		 */
		build: {
			/**
			 * Returns the build identifier
			 * @returns {?string}
			 */
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
			},

			/**
			 * Default hash algorithm to use
			 */
			hashAlg: 'md5',

			/**
			 * Length of a hashed string
			 */
			hashLength: 8,

			/**
			 * Returns a hash string of the build
			 *
			 * @param {Object=} [data] - extra data to hash
			 * @param {string=} [alg] - hash algorithm
			 * @param {number} [length] - hash length
			 * @returns {string}
			 */
			hash({data, alg = this.hashAlg, length = this.hashLength} = {}) {
				return this.config.hash({alg, length, data});
			}
		},

		/**
		 * Returns parameters for Snakeskin
		 * @returns {!Object}
		 */
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

		/**
		 * Returns a version of the used ECMAScript specification
		 * @returns {string}
		 */
		es() {
			return o('es', {
				env: true,
				default: 'ES5'
			});
		},

		/**
		 * Returns parameters for Babel
		 * @returns {!Object}
		 */
		babel() {
			return {
				plugins: [],
				compact: false
			};
		},

		/**
		 * Returns parameters for TypeScript
		 * @returns {!Object}
		 */
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

		/**
		 * Map with application URL-s
		 */
		src: {
			/**
			 * Initialized version of the include function
			 */
			include() {
				return require('../build/include')(this.roots);
			},

			/**
			 * Returns the application working directory
			 * @returns {string}
			 */
			cwd() {
				return this.roots[this.roots.length - 1] || resolve.cwd;
			},

			/**
			 * Returns the relative path to the working directory
			 *
			 * @param path - path or a property from "src"
			 * @param args - extra path-s to join
			 * @returns {string}
			 */
			rel(path, ...args) {
				return upath.join(upath.relative(this.cwd(), this[path] ? this[path]() : path), ...args);
			},

			/**
			 * Returns a path to the application node_modules directory
			 * @returns {string}
			 */
			lib(...args) {
				return path.resolve(resolve.lib, ...args);
			},

			/**
			 * Returns a path to the application source directory
			 * @returns {string}
			 */
			src(...args) {
				return path.resolve(resolve.sourceDir, ...args);
			},

			/**
			 * Returns a path to the application asset directory
			 * @returns {string}
			 */
			assets(...args) {
				return path.resolve(this.src(), pzlr.assets.dir, ...args);
			},

			/**
			 * Returns a path to the application dist directory
			 * @returns {string}
			 */
			output(...args) {
				const v = o('output', {
					env: true,
					default: 'dist'
				});

				return path.resolve(this.cwd(), v, ...args);
			},

			/**
			 * Returns a path to the application dist directory for client scripts
			 * @returns {string}
			 */
			clientOutput(...args) {
				const v = o('client-output', {
					env: true,
					default: 'client'
				});

				return this.output(v, ...args);
			},

			/**
			 * Returns a path to the application dist directory for server scripts
			 * @returns {string}
			 */
			serverOutput(...args) {
				const v = o('server-output', {
					env: true,
					default: 'server'
				});

				return this.output(v, ...args);
			}
		}
	}
);

// Some global helpers and flags

globalThis.isProd = false;
globalThis.include = require;

Object.defineProperties(globalThis, {
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
