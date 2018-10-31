/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import config from 'config';
import logDriver from 'core/log/engines';
import * as env from 'core/env';

let
	options,
	stack: [string, unknown[]][] = [];

const setConfig = (val) => {
	options = {patterns: [], ...val};
	$C(options.patterns).set((el) => Object.isRegExp(el) ? el : new RegExp(el));
};

env.get('log').then(setConfig, setConfig);
env.event.on('set.log', setConfig);
env.event.on('remove.log', setConfig);

export interface LogStyles extends Dictionary {
	default: Dictionary;
}

export interface LogPreferences extends Dictionary {
	styles?: LogStyles;
}

export interface LogMessageOptions {
	key: string;
	type: string | undefined;
}

/**
 * Puts the specified parameters to log
 *
 * @param key - log key or log type options
 * @param [details]
 */
export default function log(key: string | LogMessageOptions, ...details: unknown[]): void {
	let
		type;

	if (!Object.isString(key)) {
		type = key.type;
		key = key.key;
	}

	if (!options) {
		stack.push([key, details]);
		return;
	}

	const check = (key) => {
		if (options.patterns) {
			for (let o = options.patterns, i = 0; i < o.length; i++) {
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
				for (let i = 0; i < details.length; i++) {
					const el = details[i];
					details[i] = Object.isFunction(el) ? el() : el;
				}

				logDriver({key, type}, config.log, ...details);
			}
		}

		stack = [];
	}

	if (check(key)) {
		for (let i = 0; i < details.length; i++) {
			const el = details[i];
			details[i] = Object.isFunction(el) ? el() : el;
		}

		logDriver({key, type}, config.log, ...details);
	}
}
