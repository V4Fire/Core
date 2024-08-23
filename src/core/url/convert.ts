/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { convertIfDate } from 'core/json';

import { defaultToQueryStringParamsFilter } from 'core/url/const';
import type { ToQueryStringOptions, FromQueryStringOptions } from 'core/url/interface';

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

		// eslint-disable-next-line @typescript-eslint/unbound-method
		paramsFilter = opts.paramsFilter ?? defaultToQueryStringParamsFilter;

	const stack = Object.keys(data)
		.sort()
		.reverse()
		.map((key) => ({
			key,
			el: data[key],
			checked: false
		}));

	const dictionaryKeyTransformer = opts.arraySyntax ?
		(baseKey, additionalKey) => `${baseKey}[${additionalKey}]` :
		(baseKey, additionalKey) => `${baseKey}${separator}${additionalKey}`;

	const arrayKeyTransformer = opts.arraySyntax ?
		(baseKey) => `${baseKey}[]` :
		(baseKey) => baseKey;

	let
		res = '';

	while (stack.length > 0) {
		const
			item = stack.pop();

		if (item == null) {
			continue;
		}

		const
			{el, key} = item;

		if (Object.isDictionary(el)) {
			const keys = Object.keys(el).sort();

			if (keys.length > 0) {
				for (let i = keys.length - 1; i >= 0; i--) {
					checkAndPush(item, keys[i], dictionaryKeyTransformer);
				}

				continue;
			}
		}

		if (Object.isArray(el) && el.length > 0) {
			for (let key = el.length - 1; key >= 0; key--) {
				checkAndPush(item, key, arrayKeyTransformer);
			}

			continue;
		}

		if (item.checked || Object.isTruly(paramsFilter(el, key))) {
			let
				data;

			if (Object.isDictionary(el)) {
				data = '';

			} else {
				data = String(el ?? '');

				if (opts.encode !== false) {
					data = encodeURIComponent(data);
				}
			}

			res += `&${key}=${data}`;
		}
	}

	return res.substr(1);

	function checkAndPush(item: typeof stack[0], key: unknown, keyTransformer: Function): void {
		const
			normalizedKey = String(key),
			nextLvlKey = keyTransformer(item.key, normalizedKey),
			el = Object.get(item.el, [key]);

		if (Object.isTruly(paramsFilter(el, normalizedKey, nextLvlKey))) {
			stack.push({
				key: nextLvlKey,
				el,
				checked: true
			});
		}
	}
}

const
	isInvalidKey = /\b__proto__\b/,
	arraySyntaxRgxp = /\[([^\]]*)]/g,
	normalizeURLRgxp = /^(?:[^?]*\?|(?:\w+:)?\/\/.*)/;

/**
 * Creates a dictionary from the specified querystring and returns it
 *
 * @param query
 * @param [decode] - if false, then the passed string won't be decoded by using decodeURIComponent
 *
 * @example
 * ```js
 * // {a: 1}
 * fromQueryString('?a=1');
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
 * fromQueryString('?a[]=1&a[]=2', {arraySyntax: true});
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
 * fromQueryString('?a=1', {convert: false});
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
	const
		queryObj = {};

	query = query.replace(normalizeURLRgxp, '');

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

	const objOpts = {
		separator: opts.arraySyntax ? ']' : opts.separator
	};

	const
		indices = Object.createDict<number>(),
		variables = query.split('&');

	for (let i = 0; i < variables.length; i++) {
		let
			[key, val = null] = variables[i].split('=');

		if (opts.decode !== false) {
			key = decodeURIComponent(key);

			if (val != null) {
				val = decodeURIComponent(val);
			}
		}

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
						prop = indices[path] ?? '0';
						indices[path] = Number(prop) + 1;
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
			normalizedVal = Array.toArray(oldVal, Object.isArray(normalizedVal) ? [normalizedVal] : normalizedVal);
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
