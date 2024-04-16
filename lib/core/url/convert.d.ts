/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { ToQueryStringOptions, FromQueryStringOptions } from '../../core/url/interface';
export * from '../../core/url/interface';
/**
 * Creates a querystring from the specified data and returns it
 *
 * @param data
 * @param [encode] - if false, then the result string won't be encoded by using encodeURIComponent
 *
 * @example
 * ```js
 * // '?a=1'
 * toQueryString({a: 1});
 * ```
 */
export declare function toQueryString(data: unknown, encode?: boolean): string;
/**
 * Creates a querystring from the specified data and returns it
 *
 * @param data
 * @param opts - additional options
 *
 * @example
 * ```js
 * // '?a[]=1&a[]=2'
 * toQueryString({a: [1, 2]}, {arraySyntax: true});
 * ```
 */
export declare function toQueryString(data: unknown, opts: ToQueryStringOptions): string;
/**
 * Creates a dictionary from the specified querystring and returns it
 *
 * @param query
 * @param [decode] - if false, then the passed string won't be decoded by using decodeURIComponent
 *
 * @example
 * ```js
 * // {a: 1}
 * fromQueryString('?a=1');
 * ```
 */
export declare function fromQueryString(query: string, decode?: boolean): Dictionary;
/**
 * Creates a dictionary from the specified querystring and returns it
 *
 * @param query
 * @param opts - additional options
 *
 * @example
 * ```js
 * // {a: [1, 2]}
 * fromQueryString('?a[]=1&a[]=2', {arraySyntax: true});
 * ```
 */
export declare function fromQueryString(query: string, opts: FromQueryStringOptions): Dictionary;
/**
 * Creates a dictionary from the specified querystring and returns it.
 * This overload doesn't convert key values from a string.
 *
 * @param query
 * @param opts - additional options
 *
 * @example
 * ```js
 * // {a: '1'}
 * fromQueryString('?a=1', {convert: false});
 * ```
 */
export declare function fromQueryString(query: string, opts: {
    convert: false;
} & FromQueryStringOptions): Dictionary<string | null>;
