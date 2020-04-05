/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import {

	capitalizeCache,
	camelizeCache,
	dasherizeCache,
	underscoreCache,

	isDigital,
	camelizeRgxp,
	normalizeRgxp

} from 'core/prelude/string/const';

//#if runtime has prelude/string/capitalize

/** @see String.prototype.capitalize */
extend(String.prototype, 'capitalize', function (
	this: string,
	{lower, all, cache}: StringCapitalizeOptions = {}
): string {
	const
		str = this.toString(),
		key = `${Boolean(lower)}:${Boolean(all)}:${str}`,
		val = cache !== false ? capitalizeCache[key] : undefined;

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

	if (cache !== false) {
		capitalizeCache[key] = res;
	}

	return res;
});

//#endif

/** @see String.prototype.camelize */
extend(String.prototype, 'camelize', function (
	this: string,
	upperOrOpts: boolean | StringCamelizeOptions
): string {
	const
		p = <StringCamelizeOptions>{};

	if (Object.isBoolean(upperOrOpts)) {
		p.upper = upperOrOpts;

	} else {
		Object.assign(p, upperOrOpts);
	}

	p.upper = p.upper !== false;

	const
		str = this.toString(),
		key = `${p.upper}:${str}`,
		val = p.cache !== false ? camelizeCache[key] : undefined;

	if (val !== undefined) {
		return val;
	}

	let
		res = str.trim().replace(camelizeRgxp, toCamelize);

	if (p.upper) {
		res = res[0].toUpperCase() + res.slice(1);
	}

	if (p.cache !== false) {
		camelizeCache[key] = res;
	}

	return res;
});

/** @see String.prototype.dasherize */
extend(String.prototype, 'dasherize', function (
	this: string,
	stableOrOpts?: boolean | StringDasherizeOptions
): string {
	const
		p = <StringDasherizeOptions>{};

	if (Object.isBoolean(stableOrOpts)) {
		p.stable = stableOrOpts;

	} else {
		Object.assign(p, stableOrOpts);
	}

	p.stable = p.stable === true;

	const
		str = this.toString(),
		key = `${p.stable}:${str}`,
		val = p.cache !== false ? dasherizeCache[key] : undefined;

	if (val !== undefined) {
		return val;
	}

	const res = convertToSeparatedStr(
		str.trim().replace(normalizeRgxp, toDasherize),
		'-',
		p.stable
	);

	if (p.cache !== false) {
		dasherizeCache[key] = res;
	}

	return res;
});

//#if runtime has prelude/string/underscore

/** @see String.prototype.underscore */
extend(String.prototype, 'underscore', function (
	this: string,
	stableOrOpts?: boolean | StringUnderscoreOptions
): string {
	const
		p = <StringUnderscoreOptions>{};

	if (Object.isBoolean(stableOrOpts)) {
		p.stable = stableOrOpts;

	} else {
		Object.assign(p, stableOrOpts);
	}

	p.stable = p.stable === true;

	const
		str = this.toString(),
		key = `${p.stable}:${str}`,
		val = p.cache !== false ? underscoreCache[key] : undefined;

	if (val !== undefined) {
		return val;
	}

	const res = convertToSeparatedStr(
		str.trim().replace(normalizeRgxp, toUnderscore),
		'_',
		p.stable
	);

	if (p.cache !== false) {
		underscoreCache[key] = res;
	}

	return res;
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
