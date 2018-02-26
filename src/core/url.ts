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
	return chunkToQueryString(data);
}

/**
 * Stable stringify for querystring chunk
 *
 * @param data
 * @param [prfx]
 */
export function chunkToQueryString(data: any, prfx: string = ''): string {
	if (data == null || data === '') {
		return '';
	}

	const
		isArr = Object.isArray(data);

	const reducer = (res, key) => {
		const
			val = data[key],
			valIsArr = Object.isArray(val);

		if (val == null || val === '' || valIsArr && !val.length) {
			return res;
		}

		// tslint:disable-next-line
		if (!isArr) {
			key = prfx ? `${prfx}_${key}` : key;

		} else {
			key = prfx;
		}

		let str;

		// tslint:disable-next-line
		if (valIsArr || Object.isObject(val)) {
			str = chunkToQueryString(val, key);

		} else {
			str = `${key}=${chunkToQueryString(val)}`;
		}

		if (res) {
			return `${res}&${str}`;
		}

		return str;
	};

	if (isArr || Object.isObject(data)) {
		return $C(Object.keys(data).sort()).to('').reduce(reducer);
	}

	return encodeURIComponent(String(data));
}
