/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type engines from 'core/perf/engines/index';

export type PerfEngineName = keyof typeof engines;

export interface PerfEngine {
	(id: string, ns: string, duration: number, additional?: Dictionary): void;
}
