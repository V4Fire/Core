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

import type {

	PerfConfig,
	PerfTimerConfig,
	PerfPredicates,
	PerfGroupFilters,
	PerfIncludeFilter

} from 'core/perf/config/interface';
import { GROUPS } from 'core/perf/const';
import engines, { PerfTimerEngine } from 'core/perf/timer/engines';
import { EXCLUDE } from 'core/perf/config/const';

export * from 'core/perf/config/interface';

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
				if(groupFilters[EXCLUDE] === true) {
					return !groupFilters.some((filter) => filter.test(ns));
				}

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
function createFilters(filters: CanUndef<PerfIncludeFilter | string[] | boolean>): RegExp[] | boolean {
	if(filters == null || Object.isBoolean(filters)) {
		return filters ?? true;
	}

	if (Object.isArray(filters)) {
		return filters.map((filter) => new RegExp(filter));
	}

	if(Object.isArray(filters.include)) {
		return filters.include.map((filter) => new RegExp(filter));
	}

	if(filters.exclude == null) {
		return true;
	}

	const regexpFilter = filters.exclude.map((filter) => new RegExp(filter));
	regexpFilter[EXCLUDE] = true;
	return regexpFilter;
}
