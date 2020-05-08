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
