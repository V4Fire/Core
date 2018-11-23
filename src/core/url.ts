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
 * Concatenates the specified parts of URLs, correctly arranging slashes and returns the full url
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
 * Creates a querystring from the specified data and returns it
 * @param data
 */
export function toQueryString(data: Nullable<string>): string {
	return chunkToQueryString(data);
}

/**
 * Creates an object from the specified querystring and returns it
 * @param str
 */
export function fromQueryString<T extends Dictionary>(str: string): T {
	const
		res = <T>{};

	if (str[0] === '?') {
		str = str.slice(1);
	}

	const
		opts = {separator: '_'},
		chunks = str.split('&');

	for (let i = 0; i < chunks.length; i++) {
		const [key, val] = chunks[i].split('=');
		Object.set(res, key, val == null ? null : val, opts);
	}

	return res;
}

function chunkToQueryString(data: Nullable<string>, prfx: string = ''): string {
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
