/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import Then from 'core/then';
import { lang } from 'core/i18n';

/**
 * Returns a value without translation instead the standard i18n behaviour
 * @param value
 */
export function noi18n(value: string): string {
	return value;
}

/**
 * Returns true if the specified value is empty
 * @param value
 */
export function isEmptyValue(value: any): boolean {
	return !value;
}

/**
 * Sets .toJSON function that converts dates to UTC for all dates from the specified object
 * (returns new object)
 *
 * @param obj
 * @param [sys]
 */
export function setJSONToUTC(obj: Dictionary, sys?: boolean): Dictionary {
	if (!sys) {
		obj = Object.fastClone(obj);
	}

	$C(obj).forEach((el) => {
		if (Object.isDate(el)) {
			el.toJSON = () => el.clone().set({
				minutes: el.getTimezoneOffset(),
				seconds: 0,
				milliseconds: 0
			}).valueOf().toString();

		} else if (Object.isObject(el) || Object.isArray(el)) {
			setJSONToUTC(el, true);
		}
	});

	return obj;
}

/**
 * Returns a date range by the specified parameters
 *
 * @param from
 * @param [to]
 */
export function getDateRange(from: string | number | Date, to: string | number | Date = from): Date[] {
	return [
		Date.create(from).beginningOfDay(),
		Date.create(to).endOfDay()
	];
}

type DateCreateOptions = sugarjs.Date.DateCreateOptions;

/**
 * Normalizes the specified value as date
 *
 * @param value
 * @param [params] - additional parameters for Date.create
 */
export function normalizeIfDate(value: any, params?: DateCreateOptions): Date | undefined;

/**
 * @param value - list of values
 * @param [params] - additional parameters for Date.create
 */
export function normalizeIfDate(value: any[], params?: DateCreateOptions): Date[];

// tslint:disable-next-line
export function normalizeIfDate(value, params) {
	if (Object.isArray(value)) {
		return $C(<any[]>value).map<Date>((date) => Date.create(date, params));
	}

	return value ? Date.create(value, params) : undefined;
}

/**
 * Returns date value from the specified string
 *
 * @param str
 * @param [separator] - separator pattern
 * @param [params] - additional parameters for Date.create
 */
export function getDateFromStr(str: string, separator: RegExp = /\/|-|\.|\s+/, params?: DateCreateOptions): Date {
	const p = str.split(separator);
	return Date.create(lang === 'ru' ? [p[1], p[0], p[2]].join('.') : str, params);
}

/**
 * Returns formatted time string from the specified time array
 * @param time
 */
export function getTimeFormattedStr(time: number[]): string {
	return $C(time).map((el) => el.pad(2)).join(':');
}

export const NBSP = String.fromCharCode(160);

/**
 * Returns the word in the right declination depending on the number
 *
 * @param num
 * @param one - 1 кот
 * @param two - 2 кота
 * @param five - 5 котов
 */
export function pluralize(num: number, one: string, two: string, five: string): string;
export function pluralize(num: number, variants: [string, string, string]): string;
export function pluralize(n: number, opts: string | string[], ...rest: string[]): string {
	let one, two, five;

	if (Array.isArray(opts)) {
		[one, two, five] = opts;

	} else {
		one = opts;
		[two, five] = rest;
	}

	const
		num = n.toString(10),
		l = num.length,
		last = /[05-9]$/;

	if (last.test(num) || (l > 1 && num[l - 2] === '1')) {
		return five;

	} else if (num[num.length - 1] === '1') {
		return one;
	}

	return two;
}

/**
 * Concatenates the specified parts of URLs, correctly arranging slashes
 * @param urls
 */
export function concatUrls(...urls: Array<string | null | undefined>): string {
	return $C(urls).filter((e) => e != null).to('').reduce((res, url) => {
		res = String(res);
		url = String(url);

		if (url[0] === '/') {
			url = url.slice(1);
		}

		return res[res.length - 1] === '/' ? res + url : `${res}/${url}`;
	});
}

/**
 * Stable stringify for querystring
 * @param data
 */
export function qsStableStringify(data: any): string {
	function enc(v: any): string {
		return encodeURIComponent(String(v));
	}

	if (!data || Array.isArray(data) && !data.length || JSON.stringify(data) === '{}') {
		return '';
	}

	if (typeof data !== 'object') {
		const res = Array.isArray(data) ? $C(data).map(enc).join() : enc(data);
		return `?${res}`;
	}

	const
		keys = Object.keys(data).sort();

	function reducer(res: string, key: string): string {
		const
			value = data[key];

		if (!value && value !== 0 && value !== '' || Array.isArray(value) && !value.length) {
			return res;
		}

		key = enc(key);

		if (Array.isArray(value)) {
			return $C(value.slice().sort()).reduce((r, item) => `${r}&${key}=${enc(item)}`, res);
		}

		return `${res}&${key}=${enc(value)}`;
	}

	return $C(keys).to('').reduce(reducer).replace('&', '?');
}

const
	protoChains = new WeakMap<Function, Object[]>();

/**
 * Returns a prototype chain from the specified constructor
 * @param constructor
 */
export function getPrototypeChain(constructor: Function): Object[] {
	if (protoChains.has(constructor)) {
		return (<Object[]>protoChains.get(constructor)).slice();
	}

	const
		chain: Object[] = [];

	let
		proto = constructor.prototype;

	while (proto && proto.constructor !== Object) {
		chain.push(proto);
		proto = Object.getPrototypeOf(proto);
	}

	protoChains.set(constructor, chain.reverse());
	return chain.slice();
}

/**
 * Set the descriptor parameters to configurable parameters
 * (and, if it is not a getter / setter, writable) to true
 *
 * @param descriptor
 */
export function configurableAndWritable(descriptor: PropertyDescriptor): PropertyDescriptor {
	descriptor.configurable = true;

	if (!descriptor.get && !descriptor.set) {
		descriptor.writable = true;
	}

	return descriptor;
}

/**
 * Wrapper for async functions:
 * caches running requests and, for several identical queries in a row,
 * returns the forks of the result (promise) of the first of them
 *
 * @param fn - asynchronous function, which we wrap
 * @param keyGen - key generator for the cache
 */
export function mergePendingWrapper<T extends Function>(
	fn: T,
	keyGen: (...args: any[]) => string = (...args) => JSON.stringify(args)
): T {
	const
		cache = Object.createDict();

	return <any>function (...args: any[]): any {
		const
			key = keyGen(...args);

		if (!cache[key]) {
			const
				val = <Then<any>>fn.apply(this, args);

			if (Then.isThenable(val)) {
				cache[key] = val.then(
					(v) => {
						delete cache[key];
						return v;
					},

					(r) => {
						delete cache[key];
						throw r;
					},

					() => {
						delete cache[key];
					}
				);

			} else {
				return val;
			}
		}

		return cache[key].then();
	};
}
