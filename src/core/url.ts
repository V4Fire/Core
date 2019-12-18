/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	isUrlWithSep = /^(\w+:)?\/?\//;

/**
 * Concatenates the specified parts of URLs with correctly arranging of slashes and returns a new string
 * @param urls
 */
export function concatUrls(...urls: Nullable<string>[]): string {
	let
		res = '';

	for (let i = 0; i < urls.length; i++) {
		let
			url = urls[i];

		if (url == null || url === '') {
			continue;
		}

		res = String(res);
		url = String(url);

		if (url[0] === '/') {
			url = url.slice(1);
		}

		if (res) {
			if (res[res.length - 1] === '/') {
				res += url;
				continue;
			}

			res += `/${url}`;
			continue;
		}

		res = isUrlWithSep.test(url) ? url : `/${url}`;
	}

	return res;
}

/**
 * Creates a querystring from the specified data object and returns it
 *
 * @param data
 * @param [encode] - if true, then all values from the data will be encoded with encodeURIComponent
 */
export function toQueryString(data: unknown, encode: boolean = true): string {
	return chunkToQueryString(data, encode);
}

/**
 * Creates a dictionary from the specified querystring and returns it
 *
 * @param query
 * @param [decode] - if true, then the querystring will be decoded with decodeURIComponent
 */
export function fromQueryString(query: string, decode: boolean = true): Dictionary<string | null> {
	const
		res = {};

	if (query[0] === '?') {
		query = query.slice(1);
	}

	if (!query) {
		return res;
	}

	if (decode) {
		query = decodeURIComponent(query);
	}

	const
		opts = {separator: '_'},
		chunks = query.split('&');

	for (let i = 0; i < chunks.length; i++) {
		const
			[key, val] = chunks[i].split('=');

		if (key) {
			Object.set(res, key, val == null ? null : val, opts);
		}
	}

	return res;
}

function chunkToQueryString(data: unknown, encode: boolean, prfx: string = ''): string {
	if (data == null || data === '') {
		return '';
	}

	const
		isArr = Object.isArray(data);

	const reduce = (arr) => {
		arr.sort();

		let
			res = '';

		for (let i = 0; i < arr.length; i++) {
			let
				key = arr[i];

			const
				val = (<Extract<typeof data, unknown[] | Dictionary>>data)[key],
				valIsArr = Object.isArray(val);

			if (val == null || val === '' || valIsArr && !(<unknown[]>val).length) {
				continue;
			}

			key = isArr ? prfx : prfx ? `${prfx}_${key}` : key;

			const str = valIsArr || Object.isObject(val) ?
				chunkToQueryString(val, encode, key) : `${key}=${chunkToQueryString(val, encode)}`;

			if (res) {
				res += `&${str}`;
				continue;
			}

			res = str;
		}

		return res;
	};

	if (isArr) {
		return reduce(data);
	}

	if (Object.isObject(data)) {
		return reduce(Object.keys(data));
	}

	return encode ? encodeURIComponent(String(data)) : String(data);
}
