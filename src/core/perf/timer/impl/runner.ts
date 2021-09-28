/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/perf/timer/impl/README.md]]
 * @packageDocumentation
 */

import type { PerfGroup } from 'core/perf/interface';
import type { PerfPredicate } from 'core/perf/config';
import type { PerfTimerEngine } from 'core/perf/timer/engines';
import type { PerfTimerMeasurement, PerfTimerId, PerfTimer } from 'core/perf/timer/impl/interface';

export { PerfTimerId } from 'core/perf/timer/impl/interface';

export default class PerfTimersRunner {
	static combineNamespaces(...arg: Array<CanUndef<string>>): string {
		return arg.filter((x) => x).join('.');
	}

	protected engine: PerfTimerEngine;
	protected timeOffset: number;
	protected filter?: PerfPredicate;
	protected nsToCounter: Dictionary<number> = {};
	protected idToMeasurement: Dictionary<PerfTimerMeasurement> = {};

	constructor(engine: PerfTimerEngine, filter?: PerfPredicate, keepTImeOffset: boolean = false) {
		this.engine = engine;
		this.filter = filter;
		this.timeOffset = keepTImeOffset ? engine.getTimestampFromTimeOrigin() : 0;
	}

	createTimer(group: PerfGroup): PerfTimer {
		const makeTimer = (namespace?: string): PerfTimer => ({
			start: (name: string): PerfTimerId => {
				if (!Object.isTruly(name)) {
					throw new Error('Metrics name should be defined');
				}

				return this.start(PerfTimersRunner.combineNamespaces(namespace, name));
			},

			finish: (perfTimerId: PerfTimerId, additional?: Dictionary) =>
				this.finish(perfTimerId, additional),

			markTimestamp: (name: string, additional?: Dictionary) => {
				if (!Object.isTruly(name)) {
					throw new Error('Metrics name should be defined');
				}

				return this.markTimestamp(PerfTimersRunner.combineNamespaces(namespace, name), additional);
			},

			namespace(ns: string): PerfTimer {
				if (!Object.isTruly(ns)) {
					throw new Error('Namespace should be defined');
				}

				return makeTimer(PerfTimersRunner.combineNamespaces(namespace, ns));
			}
		});

		return makeTimer(group);
	}

	protected start(name: string): PerfTimerId {
		const
			timestamp = this.getTimestamp();

		if (this.filter != null && !this.filter(name)) {
			return undefined;
		}

		this.nsToCounter[name] = (this.nsToCounter[name] ?? 0) + 1;

		const
			perfId = `${name}-${this.nsToCounter[name]}`;

		this.idToMeasurement[perfId] = {
			startTimestamp: timestamp,
			name
		};

		return perfId;
	}

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

	protected markTimestamp(name: string, additional?: Dictionary): void {
		const
			timestamp = this.getTimestamp();

		if (this.filter != null && !this.filter(name)) {
			return undefined;
		}

		this.engine.sendDelta(name, timestamp, additional);
	}

	protected getTimestamp(): number {
		return this.engine.getTimestampFromTimeOrigin() - this.timeOffset;
	}
}
