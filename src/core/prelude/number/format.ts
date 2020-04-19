/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

import { deprecate } from 'core/functools';
import { locale as defaultLocale } from 'core/prelude/i18n';

import {

	globalOpts,

	formatCache,
	formatAliases,
	boolAliases,

	defaultFormats,
	decPartRgxp

} from 'core/prelude/number/const';

import { repeatString } from 'core/prelude/number/helpers';

/** @see NumberConstructor.pad */
extend(Number.prototype, 'pad', function (
	this: number,
	targetLength: number = 0,
	opts?: NumberPadOptions
): string {
	const
		val = Number(this);

	let str = Math.abs(val).toString(opts?.base || 10);
	str = repeatString('0', targetLength - str.replace(decPartRgxp, '').length) + str;

	if (opts?.sign || val < 0) {
		str = (val < 0 ? '-' : '+') + str;
	}

	return str;
});

/** @see Number.format */
extend(Number.prototype, 'format', function (
	this: number,
	patternOrOpts?: number | string | Intl.NumberFormatOptions,
	locale: CanArray<string> = defaultLocale.value
): string {
	if (patternOrOpts === undefined && !globalOpts.init) {
		return this.toLocaleString(locale);
	}

	if (Object.isPlainObject(patternOrOpts)) {
		return this.toLocaleString(locale, patternOrOpts);
	}

	if (Object.isString(patternOrOpts)) {
		const
			pattern = patternOrOpts,
			cacheKey = [locale, pattern].join(),
			cache = formatCache[cacheKey];

		if (cache) {
			return cache.format(this);
		}

		const
			chunks = pattern.split(';'),
			opts = <Intl.NumberFormatOptions>{};

		for (let i = 0; i < chunks.length; i++) {
			const
				el = chunks[i].trim();

			let [key, val] = el.split(':');
			key = key.trim();

			if (val) {
				val = val.trim();
			}

			const
				alias = formatAliases[key];

			let
				brk = false;

			if (alias) {
				key = alias;

				switch (alias) {
					case 'currency':
						opts.style = 'currency';
						opts.currency = val || defaultFormats.currency;
						brk = true;
						break;

					case 'percent':
						opts.style = 'percent';
						brk = true;
						break;

					case 'decimal':
						opts.style = 'decimal';
						brk = true;
				}
			}

			if (!brk) {
				if (!val) {
					val = defaultFormats[key];
				}

				opts[key] = val in boolAliases ? boolAliases[val] : val;
			}
		}

		console.log(opts);
		const formatter = formatCache[cacheKey] = new Intl.NumberFormat(locale, opts);
		return formatter.format(this);
	}

	const
		decimalLength = Number(patternOrOpts);

	const
		val = Number(this),
		str = decimalLength !== undefined ? val.toFixed(decimalLength) : val.toString(),
		[int, dec] = str.split('.');

	let
		res = '';

	for (let j = 0, i = int.length; i--;) {
		if (j === 3) {
			j = 0;
			res = globalOpts.thousands + res;
		}

		j++;
		res = int[i] + res;
	}

	if (dec?.length) {
		return res + globalOpts.decimal + dec;
	}

	return res;
});

/** @see NumberConstructor.getOption */
extend(Number, 'getOption', deprecate(function getOption(key: string): string {
	return globalOpts[key];
}));

/** @see NumberConstructor.setOption */
extend(Number, 'setOption', deprecate(function setOption(key: string, value: string): void {
	globalOpts.init = true;
	globalOpts[key] = value;
}));
