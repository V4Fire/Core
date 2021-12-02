/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfGroup } from '@src/core/perf';
import type { PerfTimer } from '@src/core/perf/timer/impl';

/**
 * A factory to create performance timers
 */
export interface PerfTimerFactory {
	/**
	 * Returns an instance of the performance timer for a specific group
	 * @param group - group name, that timer should belong to. It appears at the beginning of all time marks namespaces.
	 */
	getTimer(group: PerfGroup): PerfTimer;

	/**
	 * Returns an instance of the scoped performance timer for a specific group.
	 * The scoped timer is a timer that measures timestamps from the moment of the first scope using.
	 * This moment is called the time origin.
	 *
	 * @param group - group name, that timer should belong to. It appears at the beginning of all time marks namespaces.
	 * @param scope - scope name, that defines the scope. It doesn't appear in any time mark namespaces.
	 *
	 * @example
	 * ```js
	 * // The 'handlers' scope is created at this moment
	 * const timer = factory.getScopedTimer('manual', 'handlers');
	 *
	 * // <some code>
	 *
	 * // Uses the previous timer origin
	 * const anotherTimer = factory.getScopedTimer('manual', 'handlers');
	 * ```
	 */
	getScopedTimer(group: PerfGroup, scope: string): PerfTimer;
}
