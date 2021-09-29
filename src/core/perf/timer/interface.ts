/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfGroup } from 'core/perf';
import type { PerfTimer } from 'core/perf/timer/impl';

/**
 * The factory that creates performance timers
 */
export interface PerfTimerFactory {
	/**
	 * Returns an instance of the performance timer for a specific group
	 * @param group - the group name, that timer should belong to. Appears in the beginning of all timemarks' namespaces
	 */
	getTimer(group: PerfGroup): PerfTimer;

	/**
	 * Returns an instance of the scoped performance timer for specific group.
	 * The scoped timer is a timer, that measures timestamps from the moment of the first scope using. This moment is
	 * called the time origin.
	 *
	 * @example
	 * // The 'handlers' scope is crated at this moment
	 * const timer = factory.getScopedTimer('manual', 'handlers');
	 * // <some code>
	 * // Uses the previous timer origin
	 * const anotherTimer = factory.getScopedTimer('manual', 'handlers');
	 *
	 * @param group - the group name, that timer should belong to. Appears in the beginning of all timemarks' namespaces
	 * @param scope - the scope name, that defines the scope. Doesn't appear in any timemark namespace
	 */
	getScopedTimer(group: PerfGroup, scope: string): PerfTimer;
}
