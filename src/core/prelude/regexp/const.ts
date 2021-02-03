/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const
	isGlobal = /g/,
	escapeRgxp = /([\\/'*+?|()[\]{}.^$-])/g;

export const
	testCache = Object.createDict<RegExp>();
