/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as env from 'core/env';

interface LogOptions {
	patterns: RegExp[];
}

let
	logOps: CanUndef<LogOptions>;

const setConfig = (opts) => {
	logOps = {
		patterns: [':error\\b'],
		...opts
	};

	logOps!.patterns = (logOps?.patterns ?? []).map((el) => Object.isRegExp(el) ? el : new RegExp(el));
};

env.get('log').then(setConfig, setConfig);
env.emitter.on('set.log', setConfig);
env.emitter.on('remove.log', setConfig);

/**
 * Returns the current logging parameters or undefined, if they are not already set
 */
export function getLogOptions(): typeof logOps {
	return logOps;
}
