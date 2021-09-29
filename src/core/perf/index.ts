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

import type { Perf } from 'core/perf/interface';
import { getTimerFactory } from 'core/perf/timer';
import { mergeConfigs, PerfConfig } from 'core/perf/config';

export * from 'core/perf/interface';
export * from 'core/perf/timer/impl/interface';

/**
 * Return configured instance of `Perf` class
 * @param [perfConfig] - config that overrides default performance config fields {@see config.perf}
 */
export function configurePerf(perfConfig?: Partial<PerfConfig>): Perf {
	const
		workingConfig = perfConfig == null ? config.perf : mergeConfigs(config.perf, perfConfig),
		factory = getTimerFactory(workingConfig.timer);

	return {
		getTimer: factory.getTimer.bind(factory),
		getScopedTimer: factory.getScopedTimer.bind(factory)
	};
}

export const perf = configurePerf();
