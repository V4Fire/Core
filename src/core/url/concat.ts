/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	isAbsURL = /^\w+:?\/\//,
	isUrlWithSlash = /^(\w+:)?\/?\//;

/**
 * Concatenates the specified parts of URLs with correctly arranging of slashes and returns a new string
 * @param urls
 */
export function concatUrls(...urls: Array<Nullable<string>>): string {
	let
		res = '';

	for (let i = 0; i < urls.length; i++) {
		let
			url = urls[i];

		if (url == null || url === '') {
			continue;
		}

		if (isAbsURL.test(url)) {
			res = url;
			continue;
		}

		if (url.startsWith('/')) {
			url = url.slice(1);
		}

		if (res !== '') {
			res += res.endsWith('/') ? url : `/${url}`;
			continue;
		}

		res = isUrlWithSlash.test(url) ? url : `/${url}`;
	}

	return res;
}
