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
	Sugar = require('sugar'),
	fs = require('fs-extra-promise'),
	path = require('path');

const
	{resolve} = require('@pzlr/build-core'),
	{env} = process;

const origin = Symbol('Original function');
Sugar.extend();

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
			config = this.extend(Object.create(Object.getPrototypeOf(opts)), opts),
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

		$C(config).object(true).set((el) => {
			if (Sugar.Object.isFunction(el)) {
				el[origin] = el[origin] || el;
				return el[origin].bind(config);
			}
		});

		if (envs) {
			$C(Object.keys(envs)).forEach((nm) => {
				config.envs[nm] = env[nm];
			});
		}

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
			NODE_ENV: 'development',
			APP_NAME: 'V4Fire',
			SERVICE_NAME: undefined
		}
	},

	{
		__proto__: config,

		appName() {
			return env.APP_NAME;
		},

		snakeskin() {
			return {
				pack: false,
				filters: {global: ['undef']},
				vars: require('config').envs
			};
		},

		babel() {
			return {
				plugins: [],
				compact: false
			};
		},

		src: {
			cwd() {
				return this.roots[this.roots.length - 1] || resolve.cwd;
			},

			include() {
				return require('../build/include')(this.roots);
			},

			lib() {
				return resolve.lib;
			},

			assets() {
				return path.resolve(this.cwd(), 'assets');
			},

			output() {
				return path.resolve(this.cwd(), 'dist');
			},

			clientOutput() {
				return path.resolve(this.output(), 'client');
			},

			serverOutput() {
				return path.resolve(this.output(), 'server');
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

	isProd: {
		get() {
			return env.NODE_ENV === 'production';
		}
	}
});
