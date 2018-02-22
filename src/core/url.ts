/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');

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
export function toQueryString(data: any): string {
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
