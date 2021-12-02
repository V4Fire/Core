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

import { getTimerFactory } from '@src/core/perf/timer';
import { mergeConfigs, PerfConfig } from '@src/core/perf/config';

import type { Perf } from '@src/core/perf/interface';

export * from '@src/core/perf/interface';
export * from '@src/core/perf/timer/impl/interface';

/**
 * Returns a configured instance of the `Perf` class
 * @param [perfConfig] - config that overrides the default performance config fields {@see config.perf}
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
