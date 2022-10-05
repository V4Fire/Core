/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { deprecate } from 'core/functools/deprecation';
import { isStrictAbsURL, startSlashesRgxp, endSlashesRgxp } from 'core/url/const';

/**
 * Concatenates the specified parts of URL-s with correctly arranging of slashes and returns a new string
 *
 * @param urls
 *
 * @example
 * ```js
 * // 'foo/baz/bar/bla'
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

		url = url.replace(endSlashesRgxp, '/');

		if (isStrictAbsURL.test(url)) {
			res = url;
			continue;
		}

		if (i === 0) {
			res = url.replace(startSlashesRgxp, (str) => str.slice(0, 2));
			continue;
		}

		url = url.replace(startSlashesRgxp, '/');

		if (res === '') {
			res += url;

		} else {
			url = url.replace(startSlashesRgxp, '');
			res += res.endsWith('/') ? url : `/${url}`;
		}
	}

	return res;
}

/**
 * Concatenates the specified parts of URL-s with correctly arranging of slashes and returns a new string
 *
 * @deprecated
 * @see {@link concatURLs}
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
