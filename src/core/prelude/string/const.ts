/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const
	capitalizeCache = Object.createDict<string>(),
	camelizeCache = Object.createDict<string>(),
	dasherizeCache = Object.createDict<string>(),
	underscoreCache = Object.createDict<string>();

export const
	isDigital = /\d/,
	normalizeRgxp = /(^[\s_-]+)|([\s_-]+$)|([\s_-]+)/g,
	camelizeRgxp = /(^[\s_-]+)|([\s_-]+$)|[\s_-]+([^\s-]|$)/g;
