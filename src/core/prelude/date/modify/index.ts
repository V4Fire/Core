/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from '~/core/prelude/extend';
import { createDateModifier, createStaticDateModifier } from '~/core/prelude/date/helpers';

/** @see [[Date.add]] */
extend(Date.prototype, 'add', createDateModifier((v, b) => b + v));

/** @see [[DateConstructor.add]] */
extend(Date, 'add', createStaticDateModifier('add'));

/** @see [[Date.set]] */
extend(Date.prototype, 'set', createDateModifier());

/** @see [[DateConstructor.set]] */
extend(Date, 'set', createStaticDateModifier('set'));

/** @see [[Date.rewind]] */
extend(Date.prototype, 'rewind', createDateModifier((v, b) => b - v));

/** @see [[DateConstructor.rewind]] */
extend(Date, 'rewind', createStaticDateModifier('rewind'));
