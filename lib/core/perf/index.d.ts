/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { PerfConfig } from '../../core/perf/config';
import type { Perf } from '../../core/perf/interface';
export * from '../../core/perf/interface';
export * from '../../core/perf/timer/impl/interface';
/**
 * Returns a configured instance of the `Perf` class
 * @param [perfConfig] - config that overrides the default performance config fields {@see config.perf}
 */
export declare function perf(perfConfig?: Partial<PerfConfig>): Perf;
declare const defaultPerf: Perf;
export default defaultPerf;
