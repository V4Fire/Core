/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

const
	capitalizeCache = Object.createDict<string>(),
	camelizeCache = Object.createDict<string>(),
	dasherizeCache = Object.createDict<string>(),
	underscoreCache = Object.createDict<string>();

//#if runtime has prelude/string/capitalize

/** @see String.prototype.capitalize */
extend(String.prototype, 'capitalize', function (
	this: string,
	{lower, all}: StringCapitalizeOptions = {}
): string {
	const
		str = this.toString(),
		key = `${Boolean(lower)}:${Boolean(all)}:${str}`,
		val = capitalizeCache[key];

	if (val !== undefined) {
		return val;
	}

	if (all) {
		const
			chunks = str.split(' '),
			res = <string[]>[];

		for (let i = 0; i < chunks.length; i++) {
			res.push(chunks[i].capitalize({lower}));
		}

		return capitalizeCache[str] = res.join(' ');
	}

	let res = lower ? str.toLowerCase() : str;
	res = res[0].toUpperCase() + res.slice(1);

	return capitalizeCache[key] = res;
});

//#endif

const
	normalizeRgxp = /(^[\s_-]+)|([\s_-]+$)|([\s_-]+)/g,
	camelizeRgxp = /(^[\s_-]+)|([\s_-]+$)|[\s_-]+([^\s-]|$)/g;

/** @see String.prototype.camelize */
extend(String.prototype, 'camelize', function (this: string, upper: boolean = true): string {
	const
		str = this.toString(),
		key = `${Boolean(upper)}:${str}`,
		val = camelizeCache[key];

	if (val !== undefined) {
		return val;
	}

	let
		res = str.trim().replace(camelizeRgxp, toCamelize);

	if (upper) {
		res = res[0].toUpperCase() + res.slice(1);
	}

	return camelizeCache[key] = res;
});

/** @see String.prototype.dasherize */
extend(String.prototype, 'dasherize', function (this: string, stable?: boolean): string {
	const
		str = this.toString(),
		key = `${Boolean(stable)}:${str}`,
		val = dasherizeCache[`${Boolean(stable)}:${str}`];

	if (val !== undefined) {
		return val;
	}

	return dasherizeCache[key] = convertToSeparatedStr(
		str.trim().replace(normalizeRgxp, toDasherize),
		'-',
		stable
	);
});

//#if runtime has prelude/string/underscore

/** @see String.prototype.underscore */
extend(String.prototype, 'underscore', function (this: string, stable?: boolean): string {
	const
		str = this.toString(),
		key = `${Boolean(stable)}:${str}`,
		val = underscoreCache[key];

	if (val !== undefined) {
		return val;
	}

	return underscoreCache[key] = convertToSeparatedStr(
		str.trim().replace(normalizeRgxp, toUnderscore),
		'_',
		stable
	);
});

function toUnderscore(str: string, start: CanUndef<string>, end: CanUndef<string>, middle: CanUndef<string>): string {
	if (middle) {
		return '_';
	}

	return new Array((start || end || '').length + 1).join('_');
}

//#endif

function toCamelize(str: string, start: CanUndef<string>, end: CanUndef<string>, middle: CanUndef<string>): string {
	if (middle) {
		return middle.toUpperCase();
	}

	return start || end || '';
}

function toDasherize(str: string, start: CanUndef<string>, end: CanUndef<string>, middle: CanUndef<string>): string {
	if (middle) {
		return '-';
	}

	return new Array((start || end || '').length + 1).join('-');
}

function isUpper(char: string): boolean {
	const up = char.toUpperCase();
	return char === up && char.toLowerCase() !== up;
}

const
	isDigital = /\d/;

function convertToSeparatedStr(str: string, separator: string, stable?: boolean): string {
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
