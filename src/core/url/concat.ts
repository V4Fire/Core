/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { deprecate } from '~/core/functools/deprecation';
import { isAbsURL, isURLWithSlash } from '~/core/url/const';

/**
 * Concatenates the specified parts of URL-s with correctly arranging of slashes and returns a new string
 *
 * @param urls
 *
 * @example
 * ```js
 * // '/foo/baz/bar/bla'
 * concatURLs('foo/baz', '/bar', 'bla');
 *
 * // 'http://foo.bar/bla'
 * concatURLs('http://foo.bar', 'bla');
 * ```
 */
export function concatURLs(...urls: Array<Nullable<string>>): string {
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

		res = isURLWithSlash.test(url) ? url : `/${url}`;
	}

	return res;
}

/**
 * @deprecated
 * @see [[concatURLs]]
 * @param urls
 */
export function concatUrls(...urls: Array<Nullable<string>>): string {
	deprecate({
		name: 'concatUrls',
		type: 'function',
		renamedTo: 'concatURLs'
	});

	return concatURLs(...urls);
}
