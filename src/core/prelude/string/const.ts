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
	isConcatChar = /\u200D/,
	isFlagLetters = /\uD83C[\uDDE6-\uDDFF]/;

export const
	// eslint-disable-next-line no-misleading-character-class
	isCombinable = /[\u0300-\u036F\u1AB0-\u1AFF\u200D\u20D0-\u20FF\uFE0F]|\uD83C[\uDFFB-\uDFFF]/;

export const
	normalizeRgxp = /(^[\s_-]+)|([\s_-]+$)|([\s_-]+)/g,
	camelizeRgxp = /(^[\s_-]+)|([\s_-]+$)|[\s_-]+([^\s-]|$)/g;
