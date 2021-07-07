/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfGroup } from 'core/perf/interface';
import { Performer } from 'core/perf/impl';
import { getEngine, createCache, createPredicates } from 'core/perf/config';
import config from 'config';

export * from 'core/perf/interface';
export * from 'core/perf/impl';

const
	groupToPerf = {},
	engine = getEngine(config.perf),
	filtersCache = createCache(config.perf),
	predicates = createPredicates(filtersCache);

/**
 * Creates performer for the passed group
 * @param group
 */
export function perf(group: PerfGroup): Performer {
	if (groupToPerf[group] == null) {
		groupToPerf[group] = new Performer(engine, group, predicates[group]);
	}

	return groupToPerf[group];
}
