'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

require('dotenv').config();
require('./global');

const
	path = require('path'),
	upath = require('upath'),
	url = require('url');

const
	config = require('./config'),
	o = require('uniconf/options').option;

const
	{config: pzlr, resolve} = require('@pzlr/build-core'),
	{env} = process;

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
		 * Default application locale to internalize
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
		 * Returns runtime parameters of the application
		 * @returns {!Object}
		 */
		runtime() {
			return {
				prod: IS_PROD,
				debug: !IS_PROD,
				env: process.env.NODE_ENV,

				'core/helpers': true,

				'core/analytics': true,
				'core/log': true,

				'core/kv-storage': true,
				'core/session': true,
				'core/net': true,

				'prelude/date/relative': true,
				'prelude/date/format': true,

				'prelude/number/rounding': true,
				'prelude/number/format': true
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
		},

		/**
		 * Resolved URL to the server API.
		 * Usually, it's used with a develop server.
		 *
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
		 * Returns the version of the used ECMAScript specification
		 * @returns {string}
		 */
		es() {
			return o('es', {
				env: true,
				default: 'ES6'
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
		 * Returns parameters for a TypeScript transpiler
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
		 * Returns parameters for Monic
		 * @returns {{typescript: !Object, javascript: !Object}}
		 */
		monic() {
			const
				runtime = this.runtime(),
				es = this.es();

			return {
				typescript: {
					flags: {
						runtime,
						es
					}
				},

				javascript: {
					flags: {
						runtime,
						es
					}
				}
			};
		}
	}
);
