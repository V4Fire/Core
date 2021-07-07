/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfEngineName } from 'core/perf/engines';
import type { PerfGroup } from 'core/perf/interface';
import type { PerfPredicate } from 'core/perf';

export interface PerfConfig {
	engine: PerfEngineName;
	filters?: PerfConfigGroupFilters;
}

export type PerfConfigGroupFilters = {
	[K in PerfGroup]?: string[] | boolean;
};

export type PerfFiltersOptions = {
	[K in PerfGroup]: RegExp[] | boolean;
};

export type PerfPredicates = {
	[K in PerfGroup]: PerfPredicate;
};
