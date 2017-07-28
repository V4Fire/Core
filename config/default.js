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
	{env} = process;

Object.assign(env, {
	NODE_ENV: env.NODE_ENV || 'standalone',
	APP_NAME: env.APP_NAME || 'V4Fire'
});

const config = module.exports = {
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
