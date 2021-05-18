/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface SelectParams {
	/**
	 * Path to an object property
	 *
	 * @example
	 * ```js
	 * select({foo: {bar: {bla: {}}}}, {from: 'foo.bla'})
	 * ```
	 */
	from?: ObjectPropertyPath | number;

	/**
	 * Object to match or array of objects.
	 * The array is interpreted as "or".
	 *
	 * @example
	 * ```js
	 * select({test: 2}, {where: {test: 2}}) // {test: 2}
	 * select({test: 2}, {where: [{test: 1}, {test: 2}]}) // {test: 2}
	 * ```
	 */
	where?: CanArray<Dictionary>;
}
