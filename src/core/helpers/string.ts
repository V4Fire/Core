/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const NBSP = String.fromCharCode(160);

//#if runtime has helpers/string/pluralize

const
	lastNumRgxp = /[05-9]$/;

/**
 * Returns the word in the right declination depending on the number
 *
 * @param num
 * @param one - 1 кот
 * @param two - 2 кота
 * @param five - 5 котов
 */
export function pluralize(num: number, one: string, two: string, five: string): string;
export function pluralize(num: number, variants: [string, string, string]): string;
export function pluralize(n: number, opts: CanArray<string>, ...rest: string[]): string {
	let one, two, five;

	if (Object.isArray(opts)) {
		[one, two, five] = opts;

	} else {
		one = opts;
		[two, five] = rest;
	}

	const
		num = n.toString(10),
		l = num.length;

	if (lastNumRgxp.test(num) || (l > 1 && num[l - 2] === '1')) {
		return five;

	} else if (num[num.length - 1] === '1') {
		return one;
	}

	return two;
}

//#endif
