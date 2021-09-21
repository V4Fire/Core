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

export default class PerfTimersRunner {
	static combineNamespaces(...arg: Array<CanUndef<string>>): string {
		return arg.filter((x) => x).join('.');
	}

	protected engine: PerfTimerEngine;
	protected filter?: PerfPredicate;
	protected nsToCounter: Dictionary<number> = {};
	protected idToMeasurement: Dictionary<PerfTimerMeasurement> = {};

	constructor(engine: PerfTimerEngine, filter?: PerfPredicate) {
		this.engine = engine;
		this.filter = filter;
	}

	createTimer(group: PerfGroup): PerfTimer {
		const makeTimer = (namespace?: string): PerfTimer => ({
			start: (name: string): PerfTimerId =>
				this.start(PerfTimersRunner.combineNamespaces(namespace, name)),

			finish: (perfTimerId: PerfTimerId, additional?: Dictionary) =>
				this.finish(perfTimerId, additional),

			markFromTimeOrigin: (name: string, additional?: Dictionary) =>
				this.markFromTimeOrigin(name, additional),

			namespace(ns: string): PerfTimer {
				return makeTimer(PerfTimersRunner.combineNamespaces(namespace, ns));
			}
		});

		return makeTimer(group);
	}

	protected start(name: string): PerfTimerId {
		const
			timestamp = this.getTimestamp();

		if (!this.filter?.(name)) {
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

		this.engine(measurement.name, duration, additional);
	}

	protected markFromTimeOrigin(name: string, additional?: Dictionary): void {
		const
			timestamp = globalThis.performance.now();

		this.engine(name, timestamp, additional);
	}

	protected getTimestamp(): number {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		return globalThis.performance?.now?.() ?? Date.now();
	}
}
