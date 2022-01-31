/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Operation } from 'core/semver/interface';

export const operations: Record<Operation, (a: number, b: number) => boolean> = {
	'>': (a, b) => a > b,
	'>=': (a, b) => a >= b,
	'<': (a, b) => a < b,
	'<=': (a, b) => a <= b,
	'==': (a, b) => a === b,
	'~=': (a, b) => a === b,
	'^=': (a, b) => a === b
};

export const
	compareRgxp = /^(\^|~|)=/;

export const
	operandLengthErrorText = 'Can\'t compare versions. The operand has an empty value.';
