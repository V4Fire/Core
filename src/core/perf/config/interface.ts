/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfTimerEngineName } from '@src/core/perf/timer/engines';
import type { PerfGroup } from '@src/core/perf/interface';

/**
 * General config for performance metrics
 */
export interface PerfConfig {
	/**
	 * Performance timers config
	 */
	timer: PerfTimerConfig;
}

/**
 * Performance timers config
 */
export interface PerfTimerConfig {
	/**
	 * Engine name
	 */
	engine: PerfTimerEngineName;

	/**
	 * Filtering settings for each group
	 */
	filters?: PerfGroupFilters;
}

/**
 * Filtering settings by group
 */
export type PerfGroupFilters = {
	[K in PerfGroup]?: string[] | boolean;
};

/**
 * Simple filtering predicates for each group.
 * Produced from filtering settings.
 * @see PerfGroupFilters
 */
export type PerfPredicates = {
	[K in PerfGroup]: PerfPredicate;
};

/**
 * Filtering predicate
 */
export type PerfPredicate = (ns: string) => boolean;
