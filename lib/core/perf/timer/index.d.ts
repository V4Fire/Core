/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { PerfTimerConfig } from '../../../core/perf/config';
import type { PerfTimerFactory } from '../../../core/perf/timer/interface';
export * from '../../../core/perf/timer/interface';
/**
 * Returns a timers' factory for the passed config
 * @param config - config, that the new factory will use
 */
export declare function getTimerFactory(config: PerfTimerConfig): PerfTimerFactory;
