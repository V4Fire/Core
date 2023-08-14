/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Operation, ComparisonOptions } from '../../core/semver/interface';
export * from '../../core/semver/const';
export * from '../../core/semver/interface';
/**
 * Compares two strings with number versions (a <op> b) by using the semver strategy
 *
 * @param a
 * @param b
 * @param op - operation type
 * @param [opts] - additional options for the specified operation
 */
export default function compare(a: string, b: string, op: Operation, opts?: ComparisonOptions): boolean;
