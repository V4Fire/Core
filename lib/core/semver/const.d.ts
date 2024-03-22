/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Operation } from '../../core/semver/interface';
export declare const operations: Record<Operation, (a: number, b: number) => boolean>;
export declare const compareRgxp: RegExp;
export declare const operandLengthErrorText = "Can't compare versions. The operand has an empty value.";
