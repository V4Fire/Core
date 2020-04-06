/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface ToQueryStringOptions {
	/**
	 * If false, then the result string won't be encoded by using encodeURIComponent
	 * @default `true`
	 */
	encode?: boolean;

	/**
	 * Separator for nested properties
	 *
	 * @default `'_'`
	 *
	 * @example
	 * ```js
	 * // foo.bar=1
	 * toQueryString({foo: {bar: 1}}, {separator: '.'});
	 * ```
	 */
	separator?: string;

	/**
	 * If true, then nested properties will be encoded by using [] syntax
	 *
	 * @default `false`
	 *
	 * @example
	 * ```js
	 * // foo[]=1&bar[bla]=2
	 * fromQueryString({foo: [1], bar: {bla: 2}}, {arraySyntax: true});
	 * ```
	 */
	arraySyntax?: boolean;
}

export interface FromQueryStringOptions {
	/**
	 * If false, then a passed value won't be decoded by using decodeURIComponent
	 * @default `true`
	 */
	decode?: boolean;

	/**
	 * If false, then all parsed values won't be parsed from a string
	 *
	 * @default `true`
	 *
	 * @example
	 * ```js
	 * // {foo: '1'}
	 * fromQueryString('foo=1', {convert: false});
	 * ```
	 */
	convert?: boolean;

	/**
	 * Separator for nested properties
	 *
	 * @example
	 * ```js
	 * // {foo: {bar: 1}}
	 * fromQueryString('foo_bar=1', {separator: '_'});
	 * ```
	 */
	separator?: string;

	/**
	 * If true, then nested properties will be decoded by using [] syntax
	 *
	 * @default `false`
	 *
	 * @example
	 * ```js
	 * // {foo: [1], bar: {bla: 2}}
	 * fromQueryString('foo[]=1&bar[bla]=2', {arraySyntax: true});
	 * ```
	 */
	arraySyntax?: boolean;
}
