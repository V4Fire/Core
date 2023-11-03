/* eslint-disable no-misleading-character-class */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { createDict } from 'core/prelude/object/create';

export const
	capitalizeCache = createDict<string>(),
	camelizeCache = createDict<string>(),
	dasherizeCache = createDict<string>(),
	underscoreCache = createDict<string>();

export const
	isDigital = /\d/,
	normalizeRgxp = /(^[\s_-]+)|([\s_-]+$)|([\s_-]+)/g,
	camelizeRgxp = /(^[\s_-]+)|([\s_-]+$)|[\s_-]+([^\s-]|$)/g;

export const unicode = {
	zeroWidthJoiner: /\u200D/,
	regionalIndicators: /\uD83C[\uDDE6-\uDDFF]/,
	emojiWithColorModifiers: /[\u261D-\u26F9\u270A-\u270D]|\uD83C[\uDF85-\uDFFF]|\uD83D[\uDC00-\uDD96\uDE45-\uDE4F\uDEA3-\uDECC]|\uD83E[\uDD0F-\uDDDD]/,
	textModifiers: /[\u0300-\u036F\u1AB0-\u1AFF\u20D0-\u20FF]/,
	colorModifiers: /\uD83C[\uDFFB-\uDFFF]/,
	modifiers: /[\u200D\uFE0F]/
};
