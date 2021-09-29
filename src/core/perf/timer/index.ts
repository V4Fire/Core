/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/perf/timer/README.md]]
 * @packageDocumentation
 */

import type { PerfGroup } from 'core/perf/interface';

import { PerfTimersRunner, PerfTimer } from 'core/perf/timer/impl';
import { getTimerEngine, createPredicates, PerfTimerConfig } from 'core/perf/config';
import type { PerfTimerFactory } from 'core/perf/timer/interface';

export * from 'core/perf/timer/interface';

/**
 * Returns a timers factory for the passed config
 * @param config - config, that will be used by the new factory
 */
export function getTimerFactory(config: PerfTimerConfig): PerfTimerFactory {
	return (() => {
		const
			runners: Partial<Record<PerfGroup, PerfTimersRunner>> = {},
			scopedRunners: Dictionary<PerfTimersRunner> = {},
			engine = getTimerEngine(config),
			predicates = createPredicates(config.filters ?? {});

		return {
			getTimer(group: PerfGroup): PerfTimer {
				if (runners[group] == null) {
					runners[group] = new PerfTimersRunner(engine, predicates[group]);
				}

				return runners[group]!.createTimer(group);
			},

			getScopedTimer(group: PerfGroup, scope: string): PerfTimer {
				const
					key = `${group}_${scope}`;

				if (scopedRunners[key] == null) {
					scopedRunners[key] = new PerfTimersRunner(engine, predicates[group], true);
				}

				return scopedRunners[key]!.createTimer(group);
			}
		};
	})();
}
