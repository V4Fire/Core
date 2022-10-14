/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfTimerEngineName } from 'core/perf/timer/engines';
import type { PerfGroup } from 'core/perf/interface';

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
	 * Name of the used engine
	 */
	engine: PerfTimerEngineName;

	/**
	 * Settings to filter perf events by groups
	 */
	filters?: PerfGroupFilters;
}

/**
 * Settings to filter perf events by groups
 */
export type PerfGroupFilters = {
	[K in PerfGroup]?: PerfIncludeFilter | string[] | string | boolean;
};

/**
 * Include/exclude patterns for perf filters
 */
export interface PerfIncludeFilter {
	/**
	 * Include only specific events
	 */
	include?: string[];

	/**
	 * Exclude only specific events.
	 * If `include` and `exclude` are both presented, will be used only include.
	 */
	exclude?: string[];
}

/**
 * Filtering predicate
 */
export type PerfPredicate = (ns: string) => boolean;

/**
 * Simple filtering predicates for each group
 * @see PerfGroupFilters
 */
export type PerfPredicates = {
	[K in PerfGroup]: PerfPredicate;
};
