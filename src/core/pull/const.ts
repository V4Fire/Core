/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const
	hashProperty = Symbol('hash value of object'),
	viewerCount = Symbol('number of objects that use this resource'),

	/**
	 * Default value of hash, if hashFn isn't specified
	 */
	defaultValue = '';
