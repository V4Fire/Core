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

/**
 * @type {{
 *   NODE_ENV: string,
 *   APP_NAME: string,
 *   SERVICE_NAME: (string|undefined)
 * }}
 */
const env = Object.assign(process.env, {
	NODE_ENV: 'standalone',
	APP_NAME: 'V4Fire'
}, $C.clone(process.env));

const config = module.exports = {
	appName() {
		return env.APP_NAME;
	},

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
				pzlr = /** @type {{sourceDir: string}} */ fs.readJSONSync(path.join(root, '.pzlrrc'));

			return {
				root,
				src: path.join(root, pzlr.sourceDir)
			};
		}
	},

	envs: {
		env: env.NODE_ENV,
		service: env.SERVICE_NAME,
		appName: env.APP_NAME
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
	}
};

const
	s = config.src,
	p = s.init(__dirname);

$C.extend(config.extend, config, {
	src: /** @lends {config.src} */ {
		cwd() {
			return this.roots[this.roots.length - 1] || process.cwd();
		},

		core: p.src,
		roots: [p.root],
		client: [],
		server: [p.src],

		include() {
			return require('../build/include')(this.roots);
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
});

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
