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
	scopedRunners: Dictionary<PerfTimersRunner> = {},
	engine = getTimerEngine(config.perf),
	predicates = createPredicates(config.perf.timer.filters ?? {});

/**
 * Returns instance of a timer for a specific group
 * @param group - the group name, that timer should belong to. Appears in the beginning of all timemarks' namespaces
 */
export function getTimer(group: PerfGroup): PerfTimer {
	if (runners[group] == null) {
		runners[group] = new PerfTimersRunner(engine, predicates[group]);
	}

	return runners[group]!.createTimer(group);
}

/**
 * Returns instance of a scoped timer for specific group.
 * Scoped timer is a timer, that measures timestamps from the moment of its creation.
 *
 * @param group - the group name, that timer should belong to. Appears in the beginning of all timemarks' namespaces
 * @param scope - the scope name, that defines the scope. Doesn't appear in any timemark namespace
 */
export function getScopedTimer(group: PerfGroup, scope: string): PerfTimer {
	const
		key = `${group}_${scope}`;

	if (scopedRunners[key] == null) {
		scopedRunners[key] = new PerfTimersRunner(engine, predicates[group], true);
	}

	return scopedRunners[group]!.createTimer(group);
}
