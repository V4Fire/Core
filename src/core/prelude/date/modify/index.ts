/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { createDateModifier, createStaticDateModifier } from 'core/prelude/date/helpers';

/** @see [[Date.add]] */
export const add = extend(Date.prototype, 'add', createDateModifier((v, b) => b + v));

/** @see [[Date.set]] */
export const set = extend(Date.prototype, 'set', createDateModifier());

/** @see [[Date.rewind]] */
export const rewind = extend(Date.prototype, 'rewind', createDateModifier((v, b) => b - v));

//#if standalone_prelude
/** @see [[DateConstructor.rewind]] */
extend(Date, 'rewind', createStaticDateModifier('rewind'));

/** @see [[DateConstructor.set]] */
extend(Date, 'set', createStaticDateModifier('set'));

/** @see [[DateConstructor.add]] */
extend(Date, 'add', createStaticDateModifier('add'));
//#endif
