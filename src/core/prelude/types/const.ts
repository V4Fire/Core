/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const
	isNative = /\[native code]/,
	nonPrimitiveTypes = {object: true, function: true};

export const
	{toString} = Object.prototype;
