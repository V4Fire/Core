/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

const
	camelizeCache = Object.createDict<string>(),
	dasherizeCache = Object.createDict<string>(),
	underscoreCache = Object.createDict<string>();

const
	normalizeRgxp = /(?:^|([^\s_-]))[\s_-]+(?:$|([^\s_-]))/g;

/** @see Sugar.String.camelize */
extend(String.prototype, 'camelize', function (this: string, upper?: boolean): string {
	const
		str = this.toString(),
		val = camelizeCache[str];

	if (val !== undefined) {
		return val;
	}

	let
		res = str.toLowerCase().replace(normalizeRgxp, toCamelize);

	if (upper) {
		res = res[0].toUpperCase() + res.slice(1);
	}

	return camelizeCache[str] = res;
});

/** @see Sugar.String.dasherize */
extend(String.prototype, 'dasherize', function (this: string): string {
	const
		str = this.toString(),
		val = dasherizeCache[str];

	if (val !== undefined) {
		return val;
	}

	return dasherizeCache[str] = finalizeTpl(str.replace(normalizeRgxp, toDasherize), '-');
});

/** @see Sugar.String.underscore */
extend(String.prototype, 'underscore', function (this: string): string {
	const
		str = this.toString(),
		val = underscoreCache[str];

	if (val !== undefined) {
		return val;
	}

	return underscoreCache[str] = finalizeTpl(str.replace(normalizeRgxp, toUnderscore), '_');
});

function isUpper(char: string): boolean {
	const up = char.toUpperCase();
	return char === up && char.toLowerCase() !== up;
}

function toCamelize(str: string, $1?: string, $2?: string): string {
	if ($1 && $2) {
		return $1 + $2.toUpperCase();
	}

	return ($1 || '') + ($2 || '');
}

function toDasherize(str: string, $1?: string, $2?: string): string {
	if ($1 && $2) {
		return `${$1}-${$2}`;
	}

	return ($1 || '') + ($2 || '');
}

function toUnderscore(str: string, $1?: string, $2?: string): string {
	if ($1 && $2) {
		return `${$1}_${$2}`;
	}

	return ($1 || '') + ($2 || '');
}

function finalizeTpl(str: string, char: string): string {
	let
		res = '',
		begin = true;

	for (let i = 0; i < str.length; i++) {
		const
			el = str[i];

		if (el === char) {
			res += char;
			continue;
		}

		if (res[res.length - 1] === char) {
			res += el.toLowerCase();
			continue;
		}

		const
			nextChar = str[i + 1];

		if (isUpper(el)) {
			if (!begin && nextChar && !isUpper(nextChar)) {
				res += char;
			}

			res += el.toLowerCase();

		} else {
			res += el;
			begin = false;

			if (nextChar && isUpper(nextChar)) {
				res += char;
			}
		}
	}

	return res;
}
