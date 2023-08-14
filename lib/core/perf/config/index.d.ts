/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { PerfTimerEngine } from '../../../core/perf/timer/engines';
import type { PerfConfig, PerfTimerConfig, PerfPredicates, PerfGroupFilters } from '../../../core/perf/config/interface';
export * from '../../../core/perf/config/interface';
/**
 * Returns an instance of the timer engine that defined in the performance config
 * @param config - performance config
 */
export declare function getTimerEngine(config: PerfTimerConfig): PerfTimerEngine;
/**
 * Creates filter predicates for every group
 * @param filters - filters from the performance config
 */
export declare function createPredicates(filters: PerfGroupFilters): PerfPredicates;
/**
 * Combines the passed configs together
 *
 * @param baseConfig - base config, that has all required fields
 * @param configs - additional configs, that override fields of the base one
 */
export declare function mergeConfigs(baseConfig: PerfConfig, ...configs: Array<Partial<PerfConfig>>): PerfConfig;
