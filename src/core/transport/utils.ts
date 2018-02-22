/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');

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
