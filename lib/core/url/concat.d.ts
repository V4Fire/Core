/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
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
export declare function concatURLs(...urls: Array<Nullable<string>>): string;
/**
 * @deprecated
 * @see [[concatURLs]]
 * @param urls
 */
export declare function concatUrls(...urls: Array<Nullable<string>>): string;
