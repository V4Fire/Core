/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { locale as defaultLocale } from 'core/prelude/i18n';

const shortOpts = {
	month: 'numeric',
	day: 'numeric',
	year: 'numeric'
};

/** @see Date.prototype.short */
extend(Date.prototype, 'short', function (
	this: Date,
	locale: CanArray<string> = defaultLocale.value
): string {
	return this.toLocaleString(locale, shortOpts);
});

const mediumOpts = Object.createDict({
	month: 'long',
	day: 'numeric',
	year: 'numeric'
});

/** @see Date.prototype.medium */
extend(Date.prototype, 'medium', function (
	this: Date,
	locale: CanArray<string> = defaultLocale.value
): string {
	return this.toLocaleString(locale, mediumOpts);
});

/** @see Date.prototype.long */
extend(Date.prototype, 'long', function (
	this: Date,
	locale: CanArray<string> = defaultLocale.value
): string {
	return this.toLocaleString(locale);
});

const formatAliases = Object.createDict({
	e: 'era',
	Y: 'year',
	M: 'month',
	d: 'day',
	w: 'weekday',
	h: 'hour',
	m: 'minute',
	s: 'second',
	z: 'timeZoneName'
});

const defaultFormat = Object.createDict({
	era: 'short',
	year: 'numeric',
	month: 'short',
	day: '2-digit',
	weekday: 'short',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	timeZoneName: 'short'
});

const convert = Object.createDict({
	'+': true,
	'-': false
});

const
	formatCache = Object.createDict<Intl.DateTimeFormatOptions>();

/** @see Date.prototype.format */
extend(Date.prototype, 'format', function (
	this: Date,
	patternOrOpts: string | Intl.DateTimeFormatOptions,
	locale: CanArray<string> = defaultLocale.value
): string {
	if (Object.isObject(patternOrOpts)) {
		return this.toLocaleString(locale, patternOrOpts);
	}

	const
		pattern = String(patternOrOpts),
		cache = formatCache[pattern];

	if (cache) {
		return this.toLocaleString(locale, cache);
	}

	const
		chunks = pattern.split(';'),
		config = {};

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
			val = defaultFormat[key];
		}

		config[key] = val in convert ? convert[val] : val;
	}

	formatCache[pattern] = config;
	return this.toLocaleString(locale, config);
});

/** @see Date.prototype.toHTMLDateString */
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

/** @see Date.prototype.toHTMLTimeString */
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

/** @see Date.prototype.toHTMLString */
extend(Date.prototype, 'toHTMLString', function (this: Date, opts: DateHTMLStringOptions): string {
	return `${this.toHTMLDateString(opts)}T${this.toHTMLTimeString(opts)}`;
});
