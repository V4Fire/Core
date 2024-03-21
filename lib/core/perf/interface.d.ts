/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { GROUPS } from '../../core/perf/const';
import type { PerfTimer } from '../../core/perf/timer/impl';
/**
 * Supported group types
 */
export declare type PerfGroup = typeof GROUPS[number];
export interface Perf {
    /**
     * Returns an instance of the performance timer for a specific group
     *
     * @param group - group name, that timer should belong to. It appears at the beginning of all time marks namespaces.
     * @see [[PerfTimerFactory.getTimer]]
     */
    getTimer(group: PerfGroup): PerfTimer;
    /**
     * Returns an instance of the scoped performance timer for a specific group
     *
     * @param group - group name, that timer should belong to. It appears at the beginning of all time marks namespaces.
     * @param scope - scope name, that defines the scope. It doesn't appear in any time mark namespaces.
     * @see [[PerfTimerFactory.getScopedTimer]]
     */
    getScopedTimer(group: PerfGroup, scope: string): PerfTimer;
}
