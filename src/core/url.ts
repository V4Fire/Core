/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');

const
	isUrlWithSep = /^(\w+:)?\/?\//;

/**
 * Concatenates the specified parts of URLs, correctly arranging slashes
 * @param urls
 */
export function concatUrls(...urls: Nullable<string>[]): string {
	return $C(urls).filter((e) => e != null && e !== '').to('').reduce((res, url) => {
		res = String(res);
		url = String(url);

		if (url[0] === '/') {
			url = url.slice(1);
		}

		if (res) {
			if (res[res.length - 1] === '/') {
				return res + url;
			}

			return `${res}/${url}`;
		}

		return isUrlWithSep.test(url) ? url : `/${url}`;
	});
}

/**
 * Stable stringify for querystring
 * @param data
 */
export function toQueryString(data: unknown): string {
	return chunkToQueryString(data);
}

/**
 * Stable stringify for querystring chunk
 *
 * @param data
 * @param [prfx]
 */
export function chunkToQueryString(data: unknown, prfx: string = ''): string {
	if (data == null || data === '') {
		return '';
	}

	const
		isArr = Object.isArray(data);

	const reducer = (res, key) => {
		const
			val = (<Extract<typeof data, unknown[] | Dictionary>>data)[key],
			valIsArr = Object.isArray(val);

		if (val == null || val === '' || valIsArr && !(<unknown[]>val).length) {
			return res;
		}

		key = isArr ? prfx : prfx ? `${prfx}_${key}` : key;

		const
			str = valIsArr || Object.isObject(val) ? chunkToQueryString(val, key) : `${key}=${chunkToQueryString(val)}`;

		if (res) {
			return `${res}&${str}`;
		}

		return str;
	};

	const
		reduce = (data) => $C(data.sort()).to('').reduce(reducer);

	if (isArr) {
		return reduce(data);
	}

	if (Object.isObject(data)) {
		return reduce(Object.keys(data));
	}

	return encodeURIComponent(String(data));
}
