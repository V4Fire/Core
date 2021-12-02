/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from '~/core/prelude/extend';

import { deprecate } from '~/core/functools';
import { locale as defaultLocale } from '~/core/prelude/i18n';

import {

	globalFormatOpts,
	defaultFormats,

	formatCache,
	formatAliases,
	boolAliases,

	decPartRgxp

} from '~/core/prelude/number/const';

import { repeatString } from '~/core/prelude/number/helpers';

/** @see [[Number.pad]] */
extend(Number.prototype, 'pad', function pad(
	this: number,
	lengthOrOpts: number | NumberPadOptions = 0,
	opts?: NumberPadOptions
): string {
	opts = {...Object.isPlainObject(lengthOrOpts) ? lengthOrOpts : opts};

	if (opts.length == null) {
		opts.length = Object.isNumber(lengthOrOpts) ? lengthOrOpts : 0;
	}

	const
		val = Number(this);

	let str = Math.abs(val).toString(opts.base ?? 10);
	str = repeatString('0', opts.length - str.replace(decPartRgxp, '').length) + str;

	if (opts.sign || val < 0) {
		str = (val < 0 ? '-' : '+') + str;
	}

	return str;
});

/** @see [[NumberConstructor.pad]] */
extend(Number, 'pad', (value: number | NumberPadOptions, lengthOrOpts: number | NumberPadOptions) => {
	if (Object.isPlainObject(value)) {
		const opts = value;
		return (value) => Number.pad(value, opts);
	}

	return value.pad(Object.cast(lengthOrOpts));
});

/** @see [[Number.format]] */
extend(Number.prototype, 'format', function format(
	this: number,
	patternOrOpts?: number | string | Intl.NumberFormatOptions,
	locale: CanArray<string> = defaultLocale.value
): string {
	if (patternOrOpts === undefined && !globalFormatOpts.init) {
		return this.toLocaleString(locale);
	}

	if (Object.isPlainObject(patternOrOpts)) {
		return this.toLocaleString(locale, patternOrOpts);
	}

	if (Object.isString(patternOrOpts)) {
		const
			pattern = patternOrOpts,
			cacheKey = [locale, pattern].join();

		let
			formatter = formatCache[cacheKey];

		if (formatter == null) {
			const
				chunks = pattern.split(';'),
				opts = <Intl.NumberFormatOptions>{};

			for (let i = 0; i < chunks.length; i++) {
				const
					formatChunk = chunks[i].trim();

				let [formatKey, formatParams = null] = formatChunk.split(':');
				formatKey = formatKey.trim();

				if (formatParams != null) {
					formatParams = formatParams.trim();
				}

				const
					alias = formatAliases[formatKey];

				if (alias != null) {
					formatKey = alias;

					switch (alias) {
						case 'currency':
							opts.style = 'currency';
							opts.currency = formatParams ?? defaultFormats.currency;
							break;

						case 'currencyDisplay':
							opts.currencyDisplay = formatParams ?? defaultFormats.currencyDisplay;
							break;

						case 'percent':
							opts.style = 'percent';
							break;

						case 'decimal':
							opts.style = 'decimal';
							break;

						default:
							throw new TypeError(`Unknown alias "${alias}"`);
					}

				} else {
					if (formatParams == null || formatParams === '') {
						formatParams = defaultFormats[formatKey];
					}

					if (formatParams != null) {
						opts[formatKey] = formatParams in boolAliases ? boolAliases[formatParams] : formatParams;
					}
				}
			}

			formatter = new Intl.NumberFormat(locale, opts);
			formatCache[cacheKey] = formatter;
		}

		return formatter.format(this);
	}

	const
		decimalLength = Number(patternOrOpts);

	const
		val = Number(this),
		str = patternOrOpts != null ? val.toFixed(decimalLength) : val.toString();

	const
		[int, dec = ''] = str.split('.');

	let
		res = '';

	for (let i = int.length - 1, j = 0; i >= 0; i--) {
		if (j === 3) {
			j = 0;
			res = globalFormatOpts.thousands + res;
		}

		j++;
		res = int[i] + res;
	}

	if (dec.length > 0) {
		return res + globalFormatOpts.decimal + dec;
	}

	return res;
});

/** @see [[NumberConstructor.format]] */
extend(Number, 'format', (
	value: number | string | Intl.NumberFormatOptions,
	patternOrOpts?: string | Intl.NumberFormatOptions,
	locale?: CanArray<string>
) => {
	if (Object.isString(value) || Object.isPlainObject(value)) {
		locale = Object.cast(patternOrOpts);
		patternOrOpts = value;
		return (value) => Number.format(value, Object.cast(patternOrOpts), locale);
	}

	return value.format(Object.cast(patternOrOpts), locale);
});

/** @see [[NumberConstructor.getOption]] */
extend(Number, 'getOption', deprecate(function getOption(key: string): string {
	return globalFormatOpts[key];
}));

/** @see [[NumberConstructor.setOption]] */
extend(Number, 'setOption', deprecate(function setOption(key: string, value: string): void {
	globalFormatOpts.init = true;
	globalFormatOpts[key] = value;
}));
