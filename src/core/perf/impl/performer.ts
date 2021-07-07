/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfGroup } from 'core/perf/interface';
import type { PerfMeasurement, PerfId, PerfPredicate } from 'core/perf/impl/interface';
import type { PerfEngine } from 'core/perf/engines';

export { PerfId } from 'core/perf/impl/interface';

export default class Performer {
	protected engine: PerfEngine;
	protected group: PerfGroup;
	protected filter?: PerfPredicate;
	protected nsToCounter: Dictionary<number> = {};
	protected idToMeasurement: Dictionary<PerfMeasurement> = {};

	constructor(engine: PerfEngine, group: PerfGroup, filter?: PerfPredicate) {
		this.engine = engine;
		this.group = group;
		this.filter = filter;
	}

	start(ns: string): PerfId {
		if (!this.filter?.(ns)) {
			return undefined;
		}

		const
			fullNamespace = `${this.group}.${ns}`,
			prevCounter = this.nsToCounter[fullNamespace],
			nextCounter = prevCounter == null ? 1 : prevCounter + 1,
			perfId = `${fullNamespace}-${nextCounter}`;

		this.nsToCounter[fullNamespace] = nextCounter;

		this.idToMeasurement[perfId] = {
			startTimestamp: this.getTimestamp(),
			fullNamespace
		};

		return perfId;
	}

	finish(perfId: PerfId, additional?: Dictionary): void {
		if (perfId == null) {
			return;
		}

		const
			measurement = this.idToMeasurement[perfId];

		if (measurement == null) {
			console.warn(`Timer with id '${measurement}' doesn't exist`);
			return;
		}

		const
			duration = this.getTimestamp() - measurement.startTimestamp;

		this.engine(perfId, measurement.fullNamespace, duration, additional);
	}

	protected getTimestamp(): number {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		return globalThis.performance?.now?.() ?? Date.now();
	}
}
