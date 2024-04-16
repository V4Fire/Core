/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { PerfPredicate } from '../../../../core/perf/config';
import type { PerfGroup } from '../../../../core/perf/interface';
import type { PerfTimerEngine } from '../../../../core/perf/timer/engines';
import type { PerfTimerMeasurement, PerfTimerId, PerfTimer, PerfTimersRunnerOptions } from '../../../../core/perf/timer/impl/interface';
export { PerfTimerId } from '../../../../core/perf/timer/impl/interface';
/**
 * Represents abstraction that can measure the difference between time moments and create new performance timers
 */
export default class PerfTimersRunner {
    /**
     * Combines the passed namespaces together
     * @param namespaces - namespaces to combine
     */
    static combineNamespaces(...namespaces: Array<CanUndef<string>>): string;
    /**
     * An engine's instance that sends metrics to the target destination
     */
    protected engine: PerfTimerEngine;
    /**
     * Time offset from the application start.
     * It may be considered as the time from which all metrics are measured for the current runner instance.
     */
    protected timeOrigin: number;
    /**
     * Predicate to filter metrics by their names.
     * If it returns `false`, the metrics will not send to the engine.
     */
    protected filter?: PerfPredicate;
    /**
     * Internal storage for the following identifier of each namespace
     */
    protected nsToCounter: Dictionary<number>;
    /**
     * Internal storage for the current `start`/`finish` metrics
     */
    protected idToMeasurement: Dictionary<PerfTimerMeasurement>;
    /**
     * Salt for each runner instance.
     * It is used to generate a time, so the times from the different runners cannot be used interchangeably.
     * It prevents sending `start`/`finish` metrics by mistake.
     */
    protected salt: number;
    /**
     * @param engine - engine instance that sends metrics to the target destination
     * @param [opts] - runner's options
     */
    constructor(engine: PerfTimerEngine, opts?: PerfTimersRunnerOptions);
    /**
     * Returns a new instance of the performance timer
     * @param group - timer group
     */
    createTimer(group: PerfGroup): PerfTimer;
    /** @see [[PerfTimer.start]] */
    protected start(name: string): PerfTimerId;
    /** @see [[PerfTimer.finish]] */
    protected finish(perfTimerId: PerfTimerId, additional?: Dictionary): void;
    /** @see [[PerfTimer.markTimestamp]] */
    protected markTimestamp(name: string, additional?: Dictionary): void;
    /**
     * Returns a timestamp taking into account the runner's timer origin
     */
    protected getTimestamp(): number;
}
