/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

const
	escapeRgxp = /([\\\/'*+?|()\[\]{}.^$-])/g;

/**
 * Returns the specified value as a string with escaping of all RegExp specific characters
 * @param value
 */
extend(RegExp, 'escape', (value: unknown) => String(value).replace(escapeRgxp, '\\$1'));
