/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { IS_NODE } from 'core/prelude/env';
import type { PerfTimerEngine } from 'core/perf/timer/engines/interface';

export const consoleEngine: PerfTimerEngine = {
	/**
	 * @inheritDoc
	 * @see {@link PerfTimerEngine.sendDelta}
	 */
	sendDelta(name: string, duration: number, additional?: Dictionary): void {
		const
			args: unknown[] = [`${name} took ${duration} ms`];

		if (additional != null) {
			args.push(additional);
		}

		// eslint-disable-next-line no-console
		console.warn(...args);
	},

	/**
	 * @inheritDoc
	 * @see {@link PerfTimerEngine.getTimestampFromTimeOrigin}
	 */
	getTimestampFromTimeOrigin(): number {
		let
			perf = globalThis.performance;

		if (IS_NODE) {
			//#if node_js
			// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-nodejs-modules
			perf = require('perf_hooks').performance;
			//#endif
		}

		return perf.now();
	}
};
