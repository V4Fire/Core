/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfGroup } from 'core/perf/interface';
import type { PerfPredicate } from 'core/perf/config';
import type { PerfTimerEngine } from 'core/perf/timer/engines';
import type { PerfTimerMeasurement, PerfTimerId, PerfTimer } from 'core/perf/timer/impl/interface';

export { PerfTimerId } from 'core/perf/timer/impl/interface';

/**
 * Represents abstraction that can measure difference between time moments and create new performance timers
 */
export default class PerfTimersRunner {
	/**
	 * Combines namespaces together
	 * @param namespaces - namespaces to combine
	 */
	static combineNamespaces(...namespaces: Array<CanUndef<string>>): string {
		return namespaces.filter((x) => x).join('.');
	}

	/**
	 * The engine's instance, that sends metrics to the target destination
	 */
	protected engine: PerfTimerEngine;

	/**
	 * The time offset from the application start. It may be considering as the time from which all metrics are measured
	 * for the current runner instance.
	 */
	protected timeOrigin: number;

	/**
	 * Predicate to filter metrics by their names. If returns `false`, the metrics will not send to the engine
	 */
	protected filter?: PerfPredicate;

	/**
	 * Internal storage for the next id of each namespace
	 */
	protected nsToCounter: Dictionary<number> = {};

	/**
	 * Internal storage for current `start`/`finish` metrics
	 */
	protected idToMeasurement: Dictionary<PerfTimerMeasurement> = {};

	/**
	 * The salt for each runner instance. It is used in generating of a timeId, so the timeIds from the different runners
	 * cannot be used interchangeably. It prevents from sending `start`/`finish` metrics by mistake.
	 */
	protected salt: number = Math.floor(Math.random() * 1234567890);

	/**
	 * @param engine - the instance of the engine, that sends metrics to the target destination
	 * @param filter - predicate for filtering metrics
	 * @param withCurrentTimeOrigin - if `true`, then moment of instantiating of the class is considering as its time
	 * origin
	 */
	constructor(engine: PerfTimerEngine, filter?: PerfPredicate, withCurrentTimeOrigin: boolean = false) {
		this.engine = engine;
		this.filter = filter;
		this.timeOrigin = withCurrentTimeOrigin ? engine.getTimestampFromTimeOrigin() : 0;
	}

	/**
	 * Returns the new instance of the performance timer
	 * @param group - the group of the timer
	 */
	createTimer(group: PerfGroup): PerfTimer {
		const makeTimer = (namespace?: string): PerfTimer => ({
			/** @see [[PerfTimer.start]] */
			start: (name: string): PerfTimerId => {
				if (!Object.isTruly(name)) {
					throw new Error('Metrics name should be defined');
				}

				return this.start(PerfTimersRunner.combineNamespaces(namespace, name));
			},

			/** @see [[PerfTimer.finish]] */
			finish: (perfTimerId: PerfTimerId, additional?: Dictionary) =>
				this.finish(perfTimerId, additional),

			/** @see [[PerfTimer.markTimestamp]] */
			markTimestamp: (name: string, additional?: Dictionary) => {
				if (!Object.isTruly(name)) {
					throw new Error('Metrics name should be defined');
				}

				return this.markTimestamp(PerfTimersRunner.combineNamespaces(namespace, name), additional);
			},

			/** @see [[PerfTimer.namespace]] */
			namespace(ns: string): PerfTimer {
				if (!Object.isTruly(ns)) {
					throw new Error('Namespace should be defined');
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
			perfId = `${this.salt}-${name}-${this.nsToCounter[name]}`;

		this.idToMeasurement[perfId] = {
			startTimestamp: timestamp,
			name
		};

		return perfId;
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
			console.warn(`Timer with id '${perfTimerId}' doesn't exist`);
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
