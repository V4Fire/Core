/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { convertIfDate } from 'core/json';
import type { ToQueryStringOptions, FromQueryStringOptions, StackItem } from 'core/url/interface';

export * from 'core/url/interface';

/**
 * Creates a querystring from the specified data and returns it
 *
 * @param data
 * @param [encode] - if false, then the result string won't be encoded by using encodeURIComponent
 *
 * @example
 * ```js
 * // '?a=1'
 * toQueryString({a: 1});
 * ```
 */
export function toQueryString(data: unknown, encode?: boolean): string;

/**
 * Creates a querystring from the specified data and returns it
 *
 * @param data
 * @param opts - additional options
 *
 * @example
 * ```js
 * // '?a[]=1&a[]=2'
 * toQueryString({a: [1, 2]}, {arraySyntax: true});
 * ```
 */
export function toQueryString(data: unknown, opts: ToQueryStringOptions): string;
export function toQueryString(data: unknown, optsOrEncode?: ToQueryStringOptions | boolean): string {
	if (!Object.isDictionary(data)) {
		return Object.isString(data) ? data : '';
	}

	let
		opts: ToQueryStringOptions;

	if (Object.isPlainObject(optsOrEncode)) {
		opts = optsOrEncode;

	} else {
		opts = {encode: optsOrEncode};
	}

	const
		separator = opts.separator ?? '_',
		filterFn = opts.paramsFilter ?? defaultParamsFilterFn,
		stack: StackItem[] = Object.keys(data).sort().reverse()
			.map((key) => ({
				key,
				data: data[key]
			}));

	const dictionaryKeyFn = opts.arraySyntax ?
		(baseKey, additionalKey) => `${baseKey}[${additionalKey}]` :
		(baseKey, additionalKey) => `${baseKey}${separator}${additionalKey}`;

	const arrayKeyFn = opts.arraySyntax ?
		(baseKey) => `${baseKey}[]` :
		(baseKey) => baseKey;

	const checkAndPush = (item, additionalKey, fn) => {
		const
			nextLvlKey = fn(item.key, additionalKey);

		if (filterFn(item.data[additionalKey], additionalKey, nextLvlKey)) {
			stack.push({
				key: nextLvlKey,
				data: item.data[additionalKey],
				checked: true
			});
		}
	};

	let
		res = '';

	while (stack.length > 0) {
		const item = <StackItem>stack.pop();

		if (Object.isDictionary(item.data)) {
			const keys = Object.keys(item.data).sort();

			if (keys.length > 0) {
				for (let i = keys.length - 1; i >= 0; i--) {
					checkAndPush(item, keys[i], dictionaryKeyFn);
				}

				continue;
			}
		}

		if (Object.isArray(item.data) && item.data.length > 0) {
			for (let key = item.data.length - 1; key >= 0; key--) {
				checkAndPush(item, key, arrayKeyFn);
			}

			continue;
		}

		if (item.checked || filterFn(item.data, item.key)) {
			let
				data;

			if (Object.isDictionary(item.data)) {
				data = '';

			} else {
				data = String(item.data ?? '');

				if (opts.encode !== false) {
					data = encodeURIComponent(data);
				}
			}

			res += `&${item.key}=${data}`;
		}
	}

	return res.substr(1);
}

const
	isInvalidKey = /\b__proto__\b/,
	arraySyntaxRgxp = /\[([^\]]*)]/g,
	normalizeURLRgxp = /[^?]*\?/;

/**
 * Creates a dictionary from the specified querystring and returns it
 *
 * @param query
 * @param [decode] - if false, then the passed string won't be decoded by using decodeURIComponent
 *
 * @example
 * ```js
 * // {a: 1}
 * toQueryString('?a=1');
 * ```
 */
export function fromQueryString(query: string, decode?: boolean): Dictionary;

/**
 * Creates a dictionary from the specified querystring and returns it
 *
 * @param query
 * @param opts - additional options
 *
 * @example
 * ```js
 * // {a: [1, 2]}
 * toQueryString('?a[]=1&a[]=2', {arraySyntax: true});
 * ```
 */
export function fromQueryString(query: string, opts: FromQueryStringOptions): Dictionary;

/**
 * Creates a dictionary from the specified querystring and returns it.
 * This overload doesn't convert key values from a string.
 *
 * @param query
 * @param opts - additional options
 *
 * @example
 * ```js
 * // {a: '1'}
 * toQueryString('?a=1', {convert: false});
 * ```
 */
export function fromQueryString(
	query: string,
	opts: {convert: false} & FromQueryStringOptions
): Dictionary<string | null>;

export function fromQueryString(
	query: string,
	optsOrDecode?: FromQueryStringOptions | boolean
): Dictionary<string | null> {
	query = query.replace(normalizeURLRgxp, '');

	const
		queryObj = {};

	if (query === '') {
		return queryObj;
	}

	let
		opts: FromQueryStringOptions;

	if (Object.isPlainObject(optsOrDecode)) {
		opts = optsOrDecode;

	} else {
		opts = {decode: optsOrDecode};
	}

	if (opts.decode !== false) {
		query = decodeURIComponent(query);
	}

	const
		indexes = Object.createDict<number>(),
		objOpts = {separator: opts.arraySyntax ? ']' : opts.separator},
		variables = query.split('&');

	for (let i = 0; i < variables.length; i++) {
		let
			[key, val = null] = variables[i].split('=');

		if (opts.arraySyntax) {
			let
				path = '',
				nestedArray = false;

			key = key.replace(arraySyntaxRgxp, (str, prop, lastIndex) => {
				if (path === '') {
					path += key.slice(0, lastIndex);
				}

				path += str;

				if (prop === '') {
					if (nestedArray) {
						prop = '0';

					} else {
						prop = indexes[path] ?? '0';
						indexes[path] = Number(prop) + 1;
					}

					nestedArray = true;
				}

				return `]${prop}`;
			});
		}

		const
			oldVal = objOpts.separator != null ? Object.get(queryObj, key, objOpts) : queryObj[key];

		let
			normalizedVal = opts.convert !== false ? Object.parse(val, convertIfDate) : val;

		if (oldVal !== undefined) {
			normalizedVal = Array.concat([], oldVal, Object.isArray(normalizedVal) ? [normalizedVal] : normalizedVal);
		}

		if (isInvalidKey.test(key)) {
			continue;
		}

		if (objOpts.separator != null) {
			Object.set(queryObj, key, normalizedVal, objOpts);

		} else {
			queryObj[key] = normalizedVal;
		}
	}

	return queryObj;
}

/**
 * Default filter function for query params
 * @param value
 */
export function defaultParamsFilterFn(value: unknown): boolean {
	return !(value == null || value === '' || (Object.isArray(value) && value.length === 0));
}
