/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfTimerEngine } from 'core/perf/timer/engines/interface';
import { IS_NODE } from 'core/prelude/env';

export const consoleEngine: PerfTimerEngine = {
	sendDelta(ns: string, duration: number, additional?: Dictionary): void {
		const
			args: unknown[] = [`${ns} took ${duration} ms`];

		if (additional != null) {
			args.push(additional);
		}

		console.warn(...args);
	},

	getTimestampFromTimeOrigin(): number {
		let
			perf = globalThis.performance;

		if (IS_NODE) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-nodejs-modules
			perf = require('perf_hooks').performance;
		}

		return perf.now();
	}
};
