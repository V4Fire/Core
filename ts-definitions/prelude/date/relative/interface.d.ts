/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

type DateRelativeType =
	'milliseconds' |
	'seconds' |
	'minutes' |
	'hours' |
	'days' |
	'weeks' |
	'months' |
	'years';

interface DateRelative {
	type: DateRelativeType;
	value: number;
	diff: number;
}
