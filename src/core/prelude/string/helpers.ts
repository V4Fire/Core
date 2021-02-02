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
export function isCharUpper(char: string): boolean {
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
	if (middle != null) {
		return '_';
	}

	return new Array((start ?? end ?? '').length + 1).join('_');
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
	if (middle != null) {
		return middle.toUpperCase();
	}

	return start ?? end ?? '';
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
	if (middle != null) {
		return '-';
	}

	return new Array((start ?? end ?? '').length + 1).join('-');
}

/**
 * Converts the specified string to a string that logically split by a separator
 *
 * @param str
 * @param separator
 * @param stable
 */
export function convertToSeparatedStr(str: string, separator: string, stable?: boolean): string {
	const
		symbols = [...str.letters()];

	let
		res = '';

	for (let i = 0; i < symbols.length; i++) {
		const
			el = symbols[i];

		if (el === separator) {
			res += separator;
			continue;
		}

		if (res.endsWith(separator)) {
			res += el.toLowerCase();
			continue;
		}

		const
			nextChar = symbols[i + 1];

		if (isDigital.test(el) || isCharUpper(el)) {
			const needSeparator = i > 0 && (
				stable ||
				Object.isTruly(nextChar) && !isDigital.test(nextChar) && !isCharUpper(nextChar)
			);

			if (needSeparator) {
				res += separator;
			}

			res += el.toLowerCase();

		} else {
			res += el;

			const
				needSeparator = Object.isTruly(nextChar) && (isDigital.test(nextChar) || isCharUpper(nextChar));

			if (needSeparator) {
				res += separator;
			}
		}
	}

	return res;
}

/**
 * Factory to create static string transform methods
 * @param method
 */
export function createStaticTransformFunction(method: string): AnyFunction {
	return (value: string | boolean | Dictionary, opts: boolean | Dictionary) => {
		if (Object.isBoolean(value) || Object.isDictionary(value)) {
			opts = value;
			return (value) => String[method](value, opts);
		}

		return value[method](opts);
	};
}
