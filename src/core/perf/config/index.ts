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

import type { PerfConfig, PerfTimerConfig, PerfPredicates, PerfGroupFilters } from '@src/core/perf/config/interface';
import { GROUPS } from '@src/core/perf/const';
import engines, { PerfTimerEngine } from '@src/core/perf/timer/engines';

export * from '@src/core/perf/config/interface';

/**
 * Returns instance of the timer engine, defined in the performance config
 * @param config - performance config
 */
export function getTimerEngine(config: PerfTimerConfig): PerfTimerEngine {
	return engines[config.engine];
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
 * Combines passed configs together
 *
 * @param baseConfig - base config, that has all required fields
 * @param configs - additional configs, that override fields of the base one
 */
export function mergeConfigs(baseConfig: PerfConfig, ...configs: Array<Partial<PerfConfig>>): PerfConfig {
	return Object.mixin({deep: true}, {}, baseConfig, ...configs);
}

/**
 * Preprocesses raw performance config filters and returns collection of regexps or boolean
 * @param filters - raw performance config filters
 */
function createFilters(filters: CanUndef<string[] | boolean>): RegExp[] | boolean {
	if (Object.isArray(filters)) {
		return filters.map((filter) => new RegExp(filter));
	}

	return filters ?? true;
}
