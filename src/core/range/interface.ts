/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type RangeValue =
	string |
	number |
	Date;

export type RangeType =
	'number' |
	'string' |
	'date';

export type CompatibleTypes<Type extends RangeValue> =
	Type extends string ? string : Type extends number ? number : Date;
