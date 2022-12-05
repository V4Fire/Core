/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfPredicate } from 'core/perf/config';
import type { PerfGroup } from 'core/perf/interface';

import type { PerfTimerEngine } from 'core/perf/timer/engines';

import type {

	PerfTimerMeasurement,
	PerfTimerId,
	PerfTimer,
	PerfTimersRunnerOptions

} from 'core/perf/timer/impl/interface';

export { PerfTimerId } from 'core/perf/timer/impl/interface';

/**
 * Represents abstraction that can measure the difference between time moments and create new performance timers
 */
export default class PerfTimersRunner {
	/**
	 * Combines the passed namespaces together
	 *
	 * @param namespaces - namespaces to combine
	 */
	static combineNamespaces(...namespaces: Array<CanUndef<string>>): string {
		return namespaces.filter((x) => x).join('.');
	}

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
	protected nsToCounter: Dictionary<number> = Object.createDict();

	/**
	 * Internal storage for the current `start`/`finish` metrics
	 */
	protected idToMeasurement: Dictionary<PerfTimerMeasurement> = Object.createDict();

	/**
	 * Salt for each runner instance.
	 * It is used to generate a time, so the times from the different runners cannot be used interchangeably.
	 * It prevents sending `start`/`finish` metrics by mistake.
	 */
	protected salt: number = Math.floor(Math.random() * 1234567890);

	/**
	 * @param engine - engine instance that sends metrics to the target destination
	 * @param [opts] - runner's options
	 */
	constructor(engine: PerfTimerEngine, opts?: PerfTimersRunnerOptions) {
		this.engine = engine;
		this.filter = opts?.filter;
		this.timeOrigin = opts?.withCurrentTimeOrigin === true ? engine.getTimestampFromTimeOrigin() : 0;
	}

	/**
	 * Returns a new instance of the performance timer
	 *
	 * @param group - timer group
	 */
	createTimer(group: PerfGroup): PerfTimer {
		const makeTimer = (namespace?: string): PerfTimer => ({
			/** @see [[PerfTimer.start]] */
			start: (name: string): PerfTimerId => {
				if (!Object.isTruly(name)) {
					throw new Error('The metrics name should be defined');
				}

				return this.start(PerfTimersRunner.combineNamespaces(namespace, name));
			},

			/** @see [[PerfTimer.finish]] */
			finish: (perfTimerId: PerfTimerId, additional?: Dictionary) =>
				this.finish(perfTimerId, additional),

			/** @see [[PerfTimer.markTimestamp]] */
			markTimestamp: (name: string, additional?: Dictionary) => {
				if (!Object.isTruly(name)) {
					throw new Error('The metrics name should be defined');
				}

				return this.markTimestamp(PerfTimersRunner.combineNamespaces(namespace, name), additional);
			},

			/** @see [[PerfTimer.namespace]] */
			namespace(ns: string): PerfTimer {
				if (!Object.isTruly(ns)) {
					throw new Error('The namespace should be defined');
				}

				return makeTimer(PerfTimersRunner.combineNamespaces(namespace, ns));
			}
		});

		return makeTimer(group);
	}

	/** @see [[PerfTimer.start]] */
	protected start(name: string): PerfTimerId {
		const
			timestamp = this.getTimestamp();

		if (this.filter != null && !this.filter(name)) {
			return undefined;
		}

		this.nsToCounter[name] = (this.nsToCounter[name] ?? 0) + 1;

		const
			timerId = `${this.salt}-${name}-${this.nsToCounter[name]}`;

		this.idToMeasurement[timerId] = {
			startTimestamp: timestamp,
			name
		};

		return timerId;
	}

	/** @see [[PerfTimer.finish]] */
	protected finish(perfTimerId: PerfTimerId, additional?: Dictionary): void {
		const
			timestamp = this.getTimestamp();

		if (perfTimerId == null) {
			return;
		}

		const
			measurement = this.idToMeasurement[perfTimerId];

		if (measurement == null) {
			// eslint-disable-next-line no-console
			console.warn(`A timer with the id "${perfTimerId}" doesn't exist`);
			return;
		}

		this.idToMeasurement[perfTimerId] = undefined;

		const
			duration = timestamp - measurement.startTimestamp;

		this.engine.sendDelta(measurement.name, duration, additional);
	}

	/** @see [[PerfTimer.markTimestamp]] */
	protected markTimestamp(name: string, additional?: Dictionary): void {
		const
			timestamp = this.getTimestamp();

		if (this.filter != null && !this.filter(name)) {
			return undefined;
		}

		this.engine.sendDelta(name, timestamp, additional);
	}

	/**
	 * Returns a timestamp taking into account the runner's timer origin
	 */
	protected getTimestamp(): number {
		return this.engine.getTimestampFromTimeOrigin() - this.timeOrigin;
	}
}
