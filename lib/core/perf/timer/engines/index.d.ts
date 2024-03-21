/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export * from '../../../../core/perf/timer/engines/interface';
declare const engines: {
    console: import("./interface").PerfTimerEngine;
};
export default engines;
