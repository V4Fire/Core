/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as env from 'core/env';
import logDriver from 'core/log/engines';

let
	config,
	stack: [string, any][] = [];

const setConfig = (val) => {
	config = val || {};
};

env.get('log').then(setConfig, setConfig);
env.event.on('set.log', setConfig);
env.event.on('remove.log', setConfig);

export default function log(key: string, details: any): void {
	if (!config) {
		stack.push([key, details]);
		return;
	}

	if (stack.length) {
		for (let i = 0; i < stack.length; i++) {
			const [key, details] = stack[i];
			logDriver(key, details);
		}

		stack = [];
	}

	logDriver(key, details);
}
