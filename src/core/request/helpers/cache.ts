/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { caches } from 'core/request/const';
import { normalizeHeaders } from 'core/request/headers';
import type { NormalizedCreateRequestOptions } from 'core/request/interface';

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
