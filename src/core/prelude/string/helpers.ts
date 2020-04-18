/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { isDigital } from 'core/prelude/string/const';

/**
 * Returns true, if the specified character is declared in upper case
 * @param char
 */
export function isUpper(char: string): boolean {
	const up = char.toUpperCase();
	return char === up && char.toLowerCase() !== up;
}

/**
 * Transforms a string to an underscore style
 *
 * @param str
 * @param start
 * @param end
 * @param middle
 */
export function toUnderscore(
	str: string,
	start: CanUndef<string>,
	end: CanUndef<string>,
	middle: CanUndef<string>
): string {
	if (middle) {
		return '_';
	}

	return new Array((start || end || '').length + 1).join('_');
}

/**
 * Transforms a string to a camelize style
 *
 * @param str
 * @param start
 * @param end
 * @param middle
 */
export function toCamelize(
	str: string,
	start: CanUndef<string>,
	end: CanUndef<string>,
	middle: CanUndef<string>
): string {
	if (middle) {
		return middle.toUpperCase();
	}

	return start || end || '';
}

/**
 * Transforms a string to a dasherize style
 *
 * @param str
 * @param start
 * @param end
 * @param middle
 */
export function toDasherize(
	str: string,
	start: CanUndef<string>,
	end: CanUndef<string>,
	middle: CanUndef<string>
): string {
	if (middle) {
		return '-';
	}

	return new Array((start || end || '').length + 1).join('-');
}

/**
 * Converts the specified string to a string that logically split by a separator
 *
 * @param str
 * @param separator
 * @param stable
 */
export function convertToSeparatedStr(str: string, separator: string, stable?: boolean): string {
	let
		res = '';

	for (let i = 0; i < str.length; i++) {
		const
			el = str[i];

		if (el === separator) {
			res += separator;
			continue;
		}

		if (res[res.length - 1] === separator) {
			res += el.toLowerCase();
			continue;
		}

		const
			nextChar = str[i + 1];

		if (isDigital.test(el) || isUpper(el)) {
			if (i && (stable || nextChar && !isDigital.test(nextChar) && !isUpper(nextChar))) {
				res += separator;
			}

			res += el.toLowerCase();

		} else {
			res += el;

			if (nextChar && (isDigital.test(nextChar) || isUpper(nextChar))) {
				res += separator;
			}
		}
	}

	return res;
}
