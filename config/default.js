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
	Sugar = require('sugar'),
	path = require('path');

const
	{env} = process;

Object.assign(env, {
	NODE_ENV: env.NODE_ENV || 'standalone',
	APP_NAME: env.APP_NAME || 'V4Fire'
});

const
	src = path.join(__dirname, '../src');

const config = module.exports = {
	extend: {
		deep: true,
		withProto: true,
		concatArray: true,
		concatFn: Sugar.Array.union
	},

	src: {
		cwd: process.cwd(),
		core: src,
		client: [],
		server: [src],
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
		adapterOptions: {transpiler: true},
		get vars() {
			return config.envs;
		}
	},

	babel: {
		plugins: [
			'syntax-flow',
			'transform-flow-strip-types',
			'transform-decorators-legacy',
			'transform-class-properties',
			'transform-es2015-object-super',
			'transform-function-bind',
			['transform-object-rest-spread', {useBuiltIns: true}],
			['transform-runtime', {
				helpers: true,
				polyfill: false,
				regenerator: false
			}]
		],

		compact: false
	}
};
