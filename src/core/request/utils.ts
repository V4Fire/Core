/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import { CreateRequestOptions } from 'core/request/interface';

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
export function getRequestKey(url: string, params?: CreateRequestOptions): string {
	const
		p = <NonNullable<typeof params>>(params || {}),
		plainHeaders = <string[][]>[];

	if (params) {
		$C(normalizeHeaders(p.headers))
			.to(plainHeaders)
			.reduce((res, value, name) => (res.push([name, String(value)]), res))
			.sort(([name1], [name2]) => {
				if (name1 < name2) {
					return -1;
				}

				if (name1 > name2) {
					return 1;
				}

				return 0;
			});
	}

	return JSON.stringify([url, p.method, plainHeaders, p.timeout]);
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
		if (query[param]) {
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
	return $C(headers).to({}).reduce((res, val, name) => {
		if (Object.isArray(val)) {
			val = $C(val).to([]).reduce((arr, val) => {
				val = normalizeHeaderValue(val, query);

				if (val) {
					arr.push(val);
				}

				return arr;
			});

		} else {
			val = normalizeHeaderValue(val, query);
		}

		if (val.length) {
			name = normalizeHeaderName(name, query);

			if (name) {
				res[name] = val;
			}
		}

		return res;
	});
}
