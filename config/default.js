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
	o = require('@v4fire/config/options').option;

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
		 *
		 * @cli app-name
		 * @env APP_NAME
		 *
		 * @type {string}
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
		 * Default application locale
		 *
		 * @cli locale
		 * @env LOCALE
		 *
		 * @type {string}
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
		 *
		 * @cli environment
		 * @cli e
		 * @env ENVIRONMENT
		 *
		 * @type {string}
		 */
		environment: o('e', {
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
		 * Map of application source directories and helpers
		 */
		src: {
			/**
			 * The initialized version of the include function
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
			 * Returns a relative path to the working directory
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
			 * Returns an absolute path to the application dist directory
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
			 *
			 * @cli client-output
			 * @env CLIENT_OUTPUT
			 *
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
			 *
			 * @cli server-output
			 * @env SERVER_OUTPUT
			 *
			 * @returns {string}
			 */
			serverOutput(...args) {
				const v = o('server-output', {
					env: true,
					default: 'server'
				});

				return this.output(v, ...args);
			},

			/**
			 * Returns a path to the application dist directory for standalone scripts
			 *
			 * @cli standalone-output
			 * @env STANDALONE_OUTPUT
			 *
			 * @returns {string}
			 */
			standaloneOutput(...args) {
				const v = o('standalone-output', {
					env: true,
					default: ''
				});

				return this.output(v, ...args);
			}
		},

		/**
		 * Returns the resolved URL to server API.
		 * Usually, it's used with a develop server.
		 *
		 * @returns {?string}
		 */
		apiURL() {
			const concatURLs = require('urlconcat').concat;
			return this.api.proxy ? concatURLs(this.api.pathname(), 'api') : this.api.url;
		},

		/**
		 * Options to manage server API.
		 * Usually, it's used with a develop server.
		 */
		api: {
			/**
			 * True, if the application should use proxy to connect to a server
			 *
			 * @cli api-proxy
			 * @env API_PROXY
			 *
			 * @type {boolean}
			 */
			proxy: o('api-proxy', {
				env: true,
				type: 'boolean',
				default: true
			}),

			/**
			 * Base server API URL
			 *
			 * @cli api-url
			 * @env API_URL
			 *
			 * @type {string}
			 */
			url: o('api-url', {
				env: true,
				default: ''
			}),

			/**
			 * Server port to launch
			 *
			 * @cli port
			 * @env PORT
			 *
			 * @type {number}
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
			 *
			 * @cli host-url
			 * @env HOST_URL
			 *
			 * @returns {string}
			 */
			host() {
				const url = o('host-url', {
					env: true,
					default: 'http://localhost'
				});

				return `${url}:${this.port}/`;
			},

			/**
			 * Returns a pathname of the launched server
			 *
			 * @cli base-path
			 * @env BASE_PATH
			 *
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
			 *
			 * @cli build-id
			 * @env BUILD_ID
			 *
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
			 * @type {string}
			 */
			hashAlg: 'md5',

			/**
			 * Length of a hashed string
			 * @type {number}
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
		 * Returns a version of the used ECMAScript specification
		 *
		 * @cli es
		 * @env ES
		 *
		 * @returns {string}
		 */
		es() {
			return o('es', {
				env: true,
				default: 'ES6',
				coerce(value) {
					return value.toUpperCase();
				}
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
