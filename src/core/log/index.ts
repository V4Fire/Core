/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import * as env from 'core/env';
import logDriver from 'core/log/engines';

let
	config,
	stack: [string, any][] = [];

const setConfig = (val) => {
	config = {patterns: [], ...val};
	$C(config.patterns).set((el) => Object.isRegExp(el) ? el : new RegExp(el));
};

env.get('log').then(setConfig, setConfig);
env.event.on('set.log', setConfig);
env.event.on('remove.log', setConfig);

/**
 * Puts the specified parameters to log
 *
 * @param key - log key
 * @param [details]
 */
export default function log(key: string, ...details: any[]): void {
	if (!config) {
		stack.push([key, details]);
		return;
	}

	const check = (key) => {
		if (config.patterns) {
			for (let o = config.patterns, i = 0; i < o.length; i++) {
				if (o[i].test(key)) {
					return true;
				}
			}

			return false;
		}

		return true;
	};

	if (stack.length) {
		for (let i = 0; i < stack.length; i++) {
			const
				[key, details] = stack[i];

			if (check(key)) {
				logDriver(key, ...details);
			}
		}

		stack = [];
	}

	if (check(key)) {
		logDriver(key, ...details);
	}
}
