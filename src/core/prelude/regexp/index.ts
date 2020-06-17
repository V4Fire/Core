/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { escapeRgxp } from 'core/prelude/regexp/const';

/** @see [[RegExpConstructor.escape]] */
extend(RegExp, 'escape', (value: unknown) => String(value).replace(escapeRgxp, '\\$1'));
