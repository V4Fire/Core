/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { locale as defaultLocale } from 'core/prelude/i18n';
import { formatCache, formatAliases, boolAliases, defaultFormats } from 'core/prelude/date/const';
import { createStaticDateFormatter } from 'core/prelude/date/helpers';

import { isPlainObject, isFunction } from 'core/prelude/types';

/** @see [[Date.format]] */
export const format = extend<typeof Date.format>(Date.prototype, 'format', function format(
	this: Date,
	patternOrOpts: string | Intl.DateTimeFormatOptions,
	locale: CanUndef<CanArray<string>> = defaultLocale.value
): string {
	if (isPlainObject(patternOrOpts)) {
		return this.toLocaleString(locale, patternOrOpts);
	}

	const
		pattern = String(patternOrOpts);

	const
		canCache = !pattern.includes('?'),
		cacheKey = [locale, pattern].join();

	let
		formatter = canCache ? formatCache[cacheKey] : null;

	if (formatter == null) {
		const
			chunks = pattern.split(';'),
			opts = {};

		for (let i = 0; i < chunks.length; i++) {
			const
				formatChunk = chunks[i].trim();

			let [formatKey, formatParams = ''] = formatChunk.split(':');
			formatKey = formatKey.trim();

			if (formatParams !== '') {
				formatParams = formatParams.trim();
			}

			const
				formatKeyAlias = formatAliases[formatKey];

			if (formatKeyAlias != null) {
				formatKey = formatKeyAlias;

				if (isFunction(formatKey)) {
					formatKey = formatKey(this);

					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (formatKey == null) {
						continue;
					}
				}
			}

			if (formatParams === '') {
				formatParams = defaultFormats[formatKey];
			}

			opts[formatKey] = formatParams in boolAliases ? boolAliases[formatParams] : formatParams;
		}

		formatter = new Intl.DateTimeFormat(locale, opts);

		if (canCache) {
			formatCache[cacheKey] = formatter;
		}
	}

	return formatter.format(this);
});

/** @see [[Date.short]] */
export const short = extend(Date.prototype, 'short', function short(
	this: Date,
	locale: CanUndef<CanArray<string>> = defaultLocale.value
): string {
	return format(this, 'd:numeric;M:numeric;Y:numeric', locale);
});

/** @see [[Date.medium]] */
export const medium = extend(Date.prototype, 'medium', function medium(
	this: Date,
	locale: CanUndef<CanArray<string>> = defaultLocale.value
): string {
	return format(this, 'd:numeric;M:long;Y:numeric', locale);
});

/** @see [[Date.long]] */
export const long = extend(Date.prototype, 'long', function long(
	this: Date,
	locale: CanUndef<CanArray<string>> = defaultLocale.value
): string {
	return format(this, 'd:numeric;M:long;Y:numeric;h:2-digit;m:2-digit;s:2-digit', locale);
});

/** @see [[Date.toHTMLTimeString]] */
export const toHTMLTimeString = extend(Date.prototype, 'toHTMLTimeString', function toHTMLTimeString(
	this: Date,
	opts: DateHTMLTimeStringOptions = {}
): string {
	const
		s = (v) => String(v).padStart(2, '0'),
		needMinutes = opts.minutes !== false;

	const res = [
		s(this.getHours()),
		needMinutes ? s(this.getMinutes()) : '00'
	];

	if (needMinutes && opts.seconds !== false) {
		const
			sec = s(this.getSeconds());

		if (opts.milliseconds !== false) {
			res.push(`${sec}.${this.getMilliseconds()}`);

		} else {
			res.push(sec);
		}
	}

	return res.join(':');
});

/** @see [[Date.toHTMLString]] */
export const toHTMLString = extend(Date.prototype, 'toHTMLString', function toHTMLString(this: Date, opts: DateHTMLStringOptions): string {
	return `${this.toHTMLDateString(opts)}T${this.toHTMLTimeString(opts)}`;
});

/** @see [[Date.toHTMLDateString]] */
export const toHTMLDateString = extend(Date.prototype, 'toHTMLDateString', function toHTMLDateString(
	this: Date,
	opts: DateHTMLDateStringOptions = {}
): string {
	const
		s = (v) => String(v).padStart(2, '0'),
		needMonth = opts.month !== false;

	return [
		this.getFullYear(),
		needMonth ? s(this.getMonth() + 1) : '01',
		needMonth && opts.date !== false ? s(this.getDate()) : '01'
	].join('-');
});

//#if standalone_prelude
/** @see [[DateConstructor.format]] */
extend(Date, 'format', (
	date: Date | string | Intl.NumberFormatOptions,
	patternOrOpts?: string | Intl.NumberFormatOptions,
	locale?: CanArray<string>
) => {
	if (Object.isString(date) || Object.isPlainObject(date)) {
		locale = Object.cast(patternOrOpts);
		patternOrOpts = date;
		return (date) => format(date, Object.cast(patternOrOpts), locale);
	}

	return date.format(Object.cast(patternOrOpts), locale);
});

/** @see [[DateConstructor.toHTMLDateString]] */
extend(Date, 'toHTMLDateString', createStaticDateFormatter('toHTMLDateString'));

/** @see [[DateConstructor.long]] */
extend(Date, 'long', createStaticDateFormatter('long'));

/** @see [[DateConstructor.medium]] */
extend(Date, 'medium', createStaticDateFormatter('medium'));

/** @see [[DateConstructor.short]] */
extend(Date, 'short', createStaticDateFormatter('short'));

/** @see [[DateConstructor.toHTMLString]] */
extend(Date, 'toHTMLString', createStaticDateFormatter('toHTMLString'));

/** @see [[DateConstructor.toHTMLTimeString]] */
extend(Date, 'toHTMLTimeString', createStaticDateFormatter('toHTMLTimeString'));
//#endif
