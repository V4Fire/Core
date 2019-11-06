/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { CreateRequestOpts } from 'core/request/interface';

/**
 * Returns a string key for saving data in a storage
 * @param key
 */
export function getStorageKey(key: string): string {
	return `data:${key}`;
}

/**
 * Generates a cache string by the specified parameters and returns it
 *
 * @param url
 * @param [params]
 */
export function getRequestKey<T>(url: string, params?: CreateRequestOpts<T>): string {
	const
		p = <NonNullable<typeof params>>(params || {}),
		plainHeaders = <string[][]>[];

	let
		bodyKey = '';

	if (params) {
		for (let o = normalizeHeaders(p.headers), keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const name = keys[i];
			plainHeaders.push([name, String(o[name])]);
		}

		plainHeaders.sort(([name1], [name2]) => {
			if (name1 < name2) {
				return -1;
			}

			if (name1 > name2) {
				return 1;
			}

			return 0;
		});

		const
			{body} = params;

		if (body != null) {
			if (Object.isString(body)) {
				bodyKey = body;

			} else if (Object.isObject(body)) {
				bodyKey = JSON.stringify(body);

			} else if (body instanceof FormData) {
				body.forEach((el, key) => {
					if (el == null) {
						el = String(el);
					}

					if (!Object.isString(el)) {
						try {
							// @ts-ignore
							el = el.toString('base64');

						} catch {
							el = el.toString();
						}
					}

					bodyKey += `${key}=${el}`;
				});

			} else {
				try {
					// @ts-ignore
					bodyKey = body.toString('base64');

				} catch {
					bodyKey = body.toString();
				}
			}
		}
	}

	return JSON.stringify([url, p.method, plainHeaders, bodyKey, p.timeout]);
}

const
	tplRgxp = /\${([^}]+)}/g;

/**
 * Applies a query object fot the specified string
 * (used keys will be removed from the query)
 *
 * @param str
 * @param [query]
 * @param [rgxp] - template regexp
 */
export function applyQueryForStr(str: string, query?: Dictionary, rgxp: RegExp = tplRgxp): string {
	if (!query) {
		return str;
	}

	return str.replace(rgxp, (str, param, adv = '') => {
		if (query[param] != null) {
			const val = [query[param], delete query[param]][0];
			return (str[0] === '/' ? '/' : '') + val + (Object.isNumber(adv) ? '' : adv);
		}

		return '';
	});
}

/**
 * Normalizes the specified HTTP header name
 *
 * @param name
 * @param [query] - request query object (for value interpolation)
 */
export function normalizeHeaderName(name: string, query?: Dictionary): string {
	return applyQueryForStr(String(name).trim(), query).toLowerCase();
}

/**
 * Normalizes the specified HTTP header value
 *
 * @param value
 * @param [query] - request query object (for value interpolation)
 */
export function normalizeHeaderValue(value: unknown, query?: Dictionary): string {
	return applyQueryForStr(String(value != null ? value : '').trim(), query);
}

/**
 * Normalizes the specified HTTP header object
 *
 * @param headers
 * @param [query] - request query object (for key/value interpolation)
 */
export function normalizeHeaders(headers?: Dictionary, query?: Dictionary): Dictionary<CanArray<string>> {
	const
		res = {};

	if (headers) {
		for (let keys = Object.keys(headers), i = 0; i < keys.length; i++) {
			let
				name = keys[i],
				val = <CanArray<string>>headers[name];

			if (Object.isArray(val)) {
				const
					arr = <string[]>[];

				for (let i = 0; i < val.length; i++) {
					const
						el = normalizeHeaderValue(val[i], query);

					if (el) {
						arr.push(el);
					}
				}

				val = arr;

			} else {
				val = normalizeHeaderValue(val, query);
			}

			if (val.length) {
				name = normalizeHeaderName(name, query);

				if (name) {
					res[name] = val;
				}
			}
		}
	}

	return res;
}
