/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type Operation =
	'>' |
	'>=' |
	'<' |
	'<=' |
	'==' |
	'^=';

export type Strategy =
	'eq' | // ==
	'ord' | // > < >= <=
	'caret'; // ^=

export interface ComparisonOptions {
	x: string
}
