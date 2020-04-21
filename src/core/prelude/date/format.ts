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

/** @see Date.short */
extend(Date.prototype, 'short', function (
	this: Date,
	locale: CanArray<string> = defaultLocale.value
): string {
	return this.format('d:numeric;M:numeric;Y:numeric', locale);
});

/** @see DateConstructor.short */
extend(Date, 'short', createStaticDateFormatter('short'));

/** @see Date.medium */
extend(Date.prototype, 'medium', function (
	this: Date,
	locale: CanArray<string> = defaultLocale.value
): string {
	return this.format('d:numeric;M:long;Y:numeric', locale);
});

/** @see DateConstructor.medium */
extend(Date, 'medium', createStaticDateFormatter('medium'));

/** @see Date.long */
extend(Date.prototype, 'long', function (
	this: Date,
	locale: CanArray<string> = defaultLocale.value
): string {
	return this.format('', locale);
});

/** @see DateConstructor.long */
extend(Date, 'long', createStaticDateFormatter('long'));

/** @see Date.format */
extend(Date.prototype, 'format', function (
	this: Date,
	patternOrOpts: string | Intl.DateTimeFormatOptions,
	locale: CanArray<string> = defaultLocale.value
): string {
	if (Object.isPlainObject(patternOrOpts)) {
		return this.toLocaleString(locale, patternOrOpts);
	}

	const
		pattern = String(patternOrOpts),
		cacheKey = [locale, pattern].join(),
		cache = formatCache[cacheKey];

	if (cache) {
		return cache.format(this);
	}

	const
		chunks = pattern.split(';'),
		opts = {};

	for (let i = 0; i < chunks.length; i++) {
		const
			el = chunks[i].trim();

		let
			[key, val] = el.split(':');

		key = key.trim();

		if (val) {
			val = val.trim();
		}

		const
			alias = formatAliases[key];

		if (alias) {
			key = alias;
		}

		if (!val) {
			val = defaultFormats[key];
		}

		opts[key] = val in boolAliases ? boolAliases[val] : val;
	}

	const formatter = formatCache[cacheKey] = new Intl.DateTimeFormat(locale, opts);
	return formatter.format(this);
});

/** @see DateConstructor.format */
extend(Date, 'format', (
	date: Date | string | Intl.NumberFormatOptions,
	patternOrOpts?: string | Intl.NumberFormatOptions,
	locale?: CanArray<string>
) => {
	if (Object.isString(date) || Object.isPlainObject(date)) {
		locale = <any>patternOrOpts;
		patternOrOpts = date;
		return (date) => Date.format(date, <any>patternOrOpts, locale);
	}

	return date.format(<any>patternOrOpts, locale);
});

/** @see Date.toHTMLDateString */
extend(Date.prototype, 'toHTMLDateString', function (
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

/** @see DateConstructor.toHTMLDateString */
extend(Date, 'toHTMLDateString', createStaticDateFormatter('toHTMLDateString'));

/** @see Date.toHTMLTimeString */
extend(Date.prototype, 'toHTMLTimeString', function (
	this: Date,
	opts: DateHTMLTimeStringOptions = {}
): string {
	const
		s = (v) => String(v).padStart(2, '0'),
		res = [s(this.getHours()), opts.minutes ? s(this.getMinutes()) : '00'];

	if (opts.seconds) {
		const
			sec = s(this.getSeconds());

		if (opts.milliseconds) {
			res.push(`${sec}.${this.getMilliseconds()}`);

		} else {
			res.push(sec);
		}
	}

	return res.join(':');
});

/** @see DateConstructor.toHTMLTimeString */
extend(Date, 'toHTMLTimeString', createStaticDateFormatter('toHTMLTimeString'));

/** @see Date.toHTMLString */
extend(Date.prototype, 'toHTMLString', function (this: Date, opts: DateHTMLStringOptions): string {
	return `${this.toHTMLDateString(opts)}T${this.toHTMLTimeString(opts)}`;
});

/** @see DateConstructor.toHTMLString */
extend(Date, 'toHTMLString', createStaticDateFormatter('toHTMLString'));
