/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

const
	escapeRgxp = /([\\\/\'*+?|()\[\]{}.^$-])/g;

/** @see Sugar.RegExp.escape */
extend(RegExp, 'escape', (pattern: unknown) => String(pattern).replace(escapeRgxp, '\\$1'));
