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
import type { PerfTimerMeasurement, PerfId, PerfTimer } from 'core/perf/timer/impl/interface';

export { PerfId } from 'core/perf/timer/impl/interface';

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
		const makeTimer = (namespace?: string) => ({
			start: (name: string): PerfId =>
				this.start(PerfTimersRunner.combineNamespaces(group, namespace, name)),

			finish: (name: string, additional?: Dictionary) =>
				this.finish(PerfTimersRunner.combineNamespaces(group, namespace, name), additional),

			namespace(ns: string): PerfTimer {
				return makeTimer(PerfTimersRunner.combineNamespaces(namespace, ns));
			}
		});

		return makeTimer(group);
	}

	protected start(name: string): PerfId {
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

	protected finish(perfId: PerfId, additional?: Dictionary): void {
		const
			timestamp = this.getTimestamp();

		if (perfId == null) {
			return;
		}

		const
			measurement = this.idToMeasurement[perfId];

		if (measurement == null) {
			console.warn(`Timer with id '${perfId}' doesn't exist`);
			return;
		}

		const
			duration = timestamp - measurement.startTimestamp;

		this.engine(measurement.name, duration, additional);
	}

	protected getTimestamp(): number {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		return globalThis.performance?.now?.() ?? Date.now();
	}
}
