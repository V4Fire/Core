/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface ObjectConstructor {
	/**
	 * Returns a curried version of `Object.fastClone`
	 *
	 * @param obj
	 * @param opts - additional options
	 */
	fastClone(obj: undefined, opts: FastCloneOptions): <T>(obj: T) => T;

	/**
	 * Clones the specified object using the `structuredClone` method if possible and returns a new object.
	 * Otherwise, the method will use a naive but fast `JSON.stringify/parse` strategy.
	 *
	 * Be careful with cloning `undefined` and `NaN` values, as they can be converted to `null` due to
	 * the nature of `JSON.stringify/parse`.
	 *
	 * @param obj
	 * @param [opts] - additional options
	 */
	fastClone<T>(obj: T, opts?: FastCloneOptions): T;
}

interface FastCloneOptions {
	/**
	 * Replacer function for `JSON.stringify`
	 * {@link JSON.stringify}
	 */
	replacer?: JSONCb;

	/**
	 * Reviver function for `JSON.parse`
	 * {@link JSON.parse}
	 */
	reviver?: JSONCb;

	/**
	 * If false the object freeze/seal state won't be copy
	 * @default `true`
	 */
	freezable?: boolean;
}
