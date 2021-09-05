/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface PerfTimerMeasurement {
	startTimestamp: number;
	name: string;
}

export interface PerfTimer {
	start(name: string): PerfId;
	finish(name: string, additional?: Dictionary): void;
	namespace(ns: string): PerfTimer;
}

export type PerfId = CanUndef<string>;
