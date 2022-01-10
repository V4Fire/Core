/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/utils/README.md]]
 * @packageDocumentation
 */

import { caches } from 'core/request/const';
import { tplRgxp } from 'core/request/utils/const';

import type { NormalizedCreateRequestOptions, ControllablePromise } from 'core/request/interface';

export * from 'core/request/utils/const';

/**
 * Merges the specified arguments and returns a new object
 * @param args
 */
export function merge<T>(...args: unknown[]): T {
	return Object.mixin({
		deep: true,
		concatArrays: (a: unknown[], b: unknown[]) => a.union(b),
		extendFilter: (el) => Array.isArray(el) || Object.isDictionary(el)
	}, undefined, ...args);
}

/**
 * Generates a string cache key for the specified parameters and returns it
 *
 * @param url - request url
 * @param [params] - request parameters
 */
export function getRequestKey<T>(url: string, params?: NormalizedCreateRequestOptions<T>): string {
	const
		plainHeaders = <string[][]>[];

	let
		bodyKey = '';

	if (params) {
		for (let o = normalizeHeaders(params.headers), keys = Object.keys(o), i = 0; i < keys.length; i++) {
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

			} else if (Object.isPlainObject(body)) {
				bodyKey = JSON.stringify(body);

			} else if (body instanceof FormData) {
				body.forEach((el, key) => {
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (el == null) {
						el = String(el);
					}

					if (!Object.isString(el)) {
						try {
							// @ts-ignore (nodejs)
							el = el.toString('base64');

						} catch {
							el = el.toString();
						}
					}

					bodyKey += `${key}=${el}`;
				});

			} else {
				try {
					// @ts-ignore (nodejs)
					bodyKey = body.toString('base64');

				} catch {
					bodyKey = body.toString();
				}
			}
		}
	}

	return JSON.stringify([
		url,
		params?.method,
		plainHeaders,
		bodyKey,
		params?.timeout
	]);
}

/**
 * Applies a query object for the specified string
 * (used keys are removed from the query)
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
		const
			val = query[param];

		if (val != null) {
			Object.defineProperty(query, param, {
				enumerable: false,
				configurable: true,
				writable: true,
				value: query[param]
			});

			return (str.startsWith('/') ? '/' : '') + String(val) + String(Object.isNumber(adv) ? '' : adv);
		}

		return '';
	});
}

/**
 * Normalizes the specified HTTP header name
 *
 * @param name
 * @param [query] - request query object (for interpolation of value)
 */
export function normalizeHeaderName(name: string, query?: Dictionary): string {
	return applyQueryForStr(String(name).trim(), query).toLowerCase();
}

/**
 * Normalizes the specified HTTP header value
 *
 * @param value
 * @param [query] - request query object (for interpolation of value)
 */
export function normalizeHeaderValue(value: unknown, query?: Dictionary): string {
	return applyQueryForStr(String(value != null ? value : '').trim(), query);
}

/**
 * Normalizes the specified HTTP header object
 *
 * @param headers
 * @param [query] - request query object (to interpolate keys/values)
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

					if (el !== '') {
						arr.push(el);
					}
				}

				val = arr;

			} else {
				val = normalizeHeaderValue(val, query);
			}

			if (val.length > 0) {
				name = normalizeHeaderName(name, query);

				if (name !== '') {
					res[name] = val;
				}
			}
		}
	}

	return res;
}

/**
 * Truncates all static cache storage-s
 */
export function dropCache(): void {
	Object.forEach(caches, (cache) => {
		cache.clear();
	});

	caches.clear();
}

/**
 * Return promise that can be resolved externally
 */
export function createControllablePromise<R = unknown>(): ControllablePromise<R> {
	let
		promiseResolve,
		promiseReject;

	const promise = <ControllablePromise<R>>new Promise(
		(resolve, reject) => {
			promiseResolve = resolve;
			promiseReject = reject;
		}
	);

	promise.resolveNow = promiseResolve;
	promise.rejectNow = promiseReject;
	return promise;
}

export function validateHeader(name: string, value?: string): TypeError | undefined {
	if (name === '') {
		return new TypeError(`Invalid header name: ${name}`);
	}

	if (value === '') {
		return new TypeError(`Invalid header value: ${value}`);
	}
}
