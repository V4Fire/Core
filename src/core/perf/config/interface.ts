/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfTimerEngineName } from 'core/perf/timer/engines';
import type { PerfGroup } from 'core/perf/interface';

export interface PerfConfig {
	timer: PerfTimerConfig;
}

export interface PerfTimerConfig {
	engine: PerfTimerEngineName;
	filters?: PerfGroupFilters;
}

export type PerfGroupFilters = {
	[K in PerfGroup]?: string[] | boolean;
};

export type PerfPredicates = {
	[K in PerfGroup]: PerfPredicate;
};

export type PerfPredicate = (ns: string) => boolean;
