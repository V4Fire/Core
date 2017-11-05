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
	{env} = process;

Object.assign(env, {
	NODE_ENV: env.NODE_ENV || 'standalone',
	APP_NAME: env.APP_NAME || 'V4Fire'
});

global.isProd = env.NODE_ENV === 'production';

const config = module.exports = {
	extend: {
		deep: true,
		withProto: true,
		concatArray: true,
		concatFn: Sugar.Array.union
	},

	src: {
		init(dir) {
			const
				root = path.join(dir, '../'),
				pzlr = fs.readJSONSync(path.join(root, '.pzlrrc'));

			return {
				root,
				src: path.join(root, pzlr.sourceDir)
			};
		}
	}
};

const
	p = config.src.init(__dirname);

$C.extend(config.extend, config, {
	src: {
		get cwd() {
			return this.roots[this.roots.length - 1] || process.cwd();
		},

		roots: [p.root],
		core: p.src,
		client: [],
		server: [p.src],

		include() {
			return require('../build/include')(this.roots);
		},

		assets() {
			return path.resolve(this.cwd, 'assets');
		},

		output() {
			return path.resolve(this.cwd, 'dist');
		},

		clientOutput() {
			return path.resolve(this.output(), 'client');
		},

		serverOutput() {
			return path.resolve(this.output(), 'server');
		}
	},

	envs: {
		env: env.NODE_ENV,
		service: env.SERVICE_NAME,
		appName: env.APP_NAME
	},

	snakeskin: {
		pack: false,
		filters: {global: ['undef']},
		get vars() {
			return config.envs;
		}
	},

	babel: {
		plugins: [],
		compact: false
	}
});
