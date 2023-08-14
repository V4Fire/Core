/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { LogLevel } from '../../../core/log/interface';
export declare const DEFAULT_LEVEL: LogLevel;
/**
 * Compares log levels:
 *
 * < 0 if left < right
 * > 0 if left > right
 * = 0 if left === right
 *
 * @param left
 * @param right
 */
export declare function cmpLevels(left: LogLevel, right: LogLevel): number;
