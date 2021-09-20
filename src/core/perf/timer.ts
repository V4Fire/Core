/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfGroup } from 'core/perf/interface';

import { PerfTimersRunner, PerfTimer } from 'core/perf/timer/impl';
import { getTimerEngine, createPredicates } from 'core/perf/config';

import config from 'config';

type RunnersByGroup = {[K in PerfGroup]?: PerfTimersRunner};

const
	runners: RunnersByGroup = {},
	engine = getTimerEngine(config.perf),
	predicates = createPredicates(config.perf.timer.filters ?? {});

/**
 * Returns instance of a timer for a specific group
 * @param group - group name
 */
export function getTimer(group: PerfGroup): PerfTimer {
	if (runners[group] == null) {
		runners[group] = new PerfTimersRunner(engine, predicates[group]);
	}

	return runners[group]!.createTimer(group);
}
