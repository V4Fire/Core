/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface PerfMeasurement {
	startTimestamp: number;
	fullNamespace: string;
}

export type PerfPredicate = (ns: string) => boolean;

export type PerfId = CanUndef<string>;
