/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/perf/config/README.md]]
 * @packageDocumentation
 */

import type { PerfConfig, PerfPredicates, PerfGroupFilters } from 'core/perf/config/interface';
import { GROUPS } from 'core/perf/const';
import engines, { PerfTimerEngine } from 'core/perf/timer/engines';

export * from 'core/perf/config/interface';

/**
 * Returns instance of the timer engine, defined in the performance config
 * @param config - performance config
 */
export function getTimerEngine(config: PerfConfig): PerfTimerEngine {
	return engines[config.timer.engine];
}

/**
 * Creates filter's predicates for every group
 * @param filters - filters from performance config
 */
export function createPredicates(filters: PerfGroupFilters): PerfPredicates {
	return GROUPS.reduce((acc, groupName) => {
		const
			groupFilters = createFilters(filters[groupName]);

		acc[groupName] = (ns: string) => {

			if (Object.isArray(groupFilters)) {
				return groupFilters.some((filter) => filter.test(ns));
			}

			return groupFilters;
		};

		return acc;
	}, <PerfPredicates>{});
}

/**
 * Preprocesses raw performance config filters and returns collection of regexps or boolean
 * @param filters - raw performance config filters
 */
function createFilters(filters: CanUndef<string[] | boolean>): RegExp[] | boolean {
	if (Object.isArray(filters)) {
		return filters.map((filter) => new RegExp(filter));
	}

	return filters ?? false;
}
