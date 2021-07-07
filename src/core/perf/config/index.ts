/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfConfig, PerfFiltersOptions, PerfPredicates } from 'core/perf/config/interface';
import { GROUPS } from 'core/perf/const';
import engines, { PerfEngine } from 'core/perf/engines';

export * from 'core/perf/config/interface';

export function getEngine(config: PerfConfig): PerfEngine {
	return engines[config.engine];
}

export function createPredicates(filtersCache: PerfFiltersOptions): PerfPredicates {
	return GROUPS.reduce((acc, groupName) => {
		acc[groupName] = (ns: string) => {
			const
				groupFilters = filtersCache[groupName];

			if (Object.isArray(groupFilters)) {
				return groupFilters.some((filter) => filter.test(ns));
			}

			return groupFilters;
		};

		return acc;
	}, <PerfPredicates>{});
}

export function createCache(config: PerfConfig): PerfFiltersOptions {
	const
		filters = config.filters ?? Object.createDict<string[] | boolean>();

	return GROUPS.reduce((acc, groupName) => {
		const
			groupFilters = filters[groupName];

		if (Object.isArray(groupFilters)) {
			acc[groupName] = groupFilters.map((filter) => new RegExp(filter));

		} else {
			acc[groupName] = groupFilters ?? true;
		}

		return acc;
	}, <PerfFiltersOptions>{});
}
