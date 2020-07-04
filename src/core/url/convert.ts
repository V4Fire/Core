/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { convertIfDate } from 'core/json';
import { ToQueryStringOptions, FromQueryStringOptions } from 'core/url/interface';

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
	let
		opts;

	if (Object.isPlainObject(optsOrEncode)) {
		opts = optsOrEncode;

	} else {
		opts = {encode: optsOrEncode};
	}

	return chunkToQueryString(data, opts);
}

const
	arraySyntax = /\[([^\]]*)]/g,
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
export function fromQueryString(query: string, decode?: boolean): Dictionary<string | null>;

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
export function fromQueryString(query: string, opts: FromQueryStringOptions): Dictionary<string | null>;
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

			key = key.replace(arraySyntax, (str, prop, lastIndex) => {
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

		if (objOpts.separator != null) {
			Object.set(queryObj, key, normalizedVal, objOpts);

		} else {
			queryObj[key] = normalizedVal;
		}
	}

	return queryObj;
}

function chunkToQueryString(data: unknown, opts: ToQueryStringOptions, prfx: string = ''): string {
	if (data == null || data === '') {
		return '';
	}

	const
		separator = opts.separator ?? '_',
		dataIsArray = Object.isArray(data);

	const reduce = (arr) => {
		arr.sort();

		let
			res = '';

		for (let i = 0; i < arr.length; i++) {
			const
				pt = dataIsArray ? i : arr[i],
				val = (<Dictionary>data)[pt],
				valIsArr = Object.isArray(val);

			let
				key = String(pt);

			if (val == null || val === '' || valIsArr && (<unknown[]>val).length === 0) {
				continue;
			}

			if (opts.arraySyntax) {
				if (dataIsArray) {
					key = `${prfx}[]`;

				} else if (prfx !== '') {
					key = `${prfx}[${key}]`;
				}

			} else if (dataIsArray) {
				key = prfx;

			} else {
				key = prfx !== '' ? prfx + separator + key : key;
			}

			const str = valIsArr || Object.isDictionary(val) ?
				chunkToQueryString(val, opts, key) :
				`${key}=${chunkToQueryString(val, opts)}`;

			if (res !== '') {
				res += `&${str}`;
				continue;
			}

			res = str;
		}

		return res;
	};

	if (dataIsArray) {
		return reduce(data);
	}

	if (Object.isDictionary(data)) {
		return reduce(Object.keys(data));
	}

	return opts.encode !== false ? encodeURIComponent(String(data)) : String(data);
}
