/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfGroup } from 'core/perf';
import type { PerfTimer } from 'core/perf/timer/impl';

export interface PerfTimerFactory {
	/**
	 * Returns instance of a timer for a specific group
	 * @param group - the group name, that timer should belong to. Appears in the beginning of all timemarks' namespaces
	 */
	getTimer(group: PerfGroup): PerfTimer;

	/**
	 * Returns instance of a scoped timer for specific group.
	 * Scoped timer is a timer, that measures timestamps from the moment of its creation.
	 *
	 * @param group - the group name, that timer should belong to. Appears in the beginning of all timemarks' namespaces
	 * @param scope - the scope name, that defines the scope. Doesn't appear in any timemark namespace
	 */
	getScopedTimer(group: PerfGroup, scope: string): PerfTimer;
}
