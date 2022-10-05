/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { createDateModifier, createStaticDateModifier } from 'core/prelude/date/helpers';

/** @see {@link Date.add} */
extend(Date.prototype, 'add', createDateModifier((v, b) => b + v));

/** @see {@link DateConstructor.add} */
extend(Date, 'add', createStaticDateModifier('add'));

/** @see {@link Date.set} */
extend(Date.prototype, 'set', createDateModifier());

/** @see {@link DateConstructor.set} */
extend(Date, 'set', createStaticDateModifier('set'));

/** @see {@link Date.rewind} */
extend(Date.prototype, 'rewind', createDateModifier((v, b) => b - v));

/** @see {@link DateConstructor.rewind} */
extend(Date, 'rewind', createStaticDateModifier('rewind'));
