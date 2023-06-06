/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/perf/README.md]]
 * @packageDocumentation
 */

import config from 'config';

import { getTimerFactory } from 'core/perf/timer';
import { mergeConfigs, PerfConfig } from 'core/perf/config';

import type { Perf } from 'core/perf/interface';

export * from 'core/perf/interface';
export * from 'core/perf/timer/impl/interface';

/**
 * Returns a configured instance of the `Perf` class
 * @param [perfConfig] - config that overrides the default performance config fields {@link config.perf}
 */
export function perf(perfConfig?: Partial<PerfConfig>): Perf {
	const
		workingConfig = perfConfig == null ? config.perf : mergeConfigs(config.perf, perfConfig),
		factory = getTimerFactory(workingConfig.timer);

	return {
		getTimer: factory.getTimer.bind(factory),
		getScopedTimer: factory.getScopedTimer.bind(factory)
	};
}

const defaultPerf = perf();

export default defaultPerf;
