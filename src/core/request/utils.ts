/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import { defaultRequestOpts } from 'core/request/const';
import { CreateRequestOptions } from 'core/request/interface';

/**
 * Returns a string key for saving data in a storage
 * @param key
 */
export function getStorageKey(key: string): string {
	return `data:${key}`;
}

/**
 * Generates a cache string by the specified params and returns it
 *
 * @param url
 * @param [params]
 */
export function getRequestKey(url: string, params?: CreateRequestOptions): string {
	const p = <typeof defaultRequestOpts & CreateRequestOptions>{
		...defaultRequestOpts,
		...params
	};

	const plainHeaders = $C(normalizeHeaders(p.headers))
		.to([] as string[][])
		.reduce((res, value, name) => (res.push([name, value]), res))
		.sort(([name1], [name2]) => {
			if (name1 < name2) {
				return -1;
			}

			if (name1 > name2) {
				return 1;
			}

			return 0;
		});

	return JSON.stringify([url, p.method, plainHeaders, p.timeout]);
}

/**
 * Normalizes the specified HTTP header name
 * @param name
 */
export function normalizeHeaderName(name: string): string {
	return String(name).trim().toLowerCase();
}

/**
 * Normalizes the specified HTTP header value
 * @param value
 */
export function normalizeHeaderValue(value: any): string {
	return String(value).trim();
}

/**
 * Normalizes the specified HTTP header object
 * @param headers
 */
export function normalizeHeaders(headers: Dictionary): Dictionary<string | string[]> {
	return $C(headers).to({}).reduce((res, val, name) => {
		res[normalizeHeaderName(name)] = Object.isArray(val) ? $C(val).map(normalizeHeaderValue) : normalizeHeaderValue(val);
		return res;
	});
}
