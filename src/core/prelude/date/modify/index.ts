/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { createDateModifier, createStaticDateModifier } from 'core/prelude/date/helpers';

/** {@link Date.add} */
extend(Date.prototype, 'add', createDateModifier((v, b) => b + v));

/** {@link DateConstructor.add} */
extend(Date, 'add', createStaticDateModifier('add'));

/** {@link Date.set} */
extend(Date.prototype, 'set', createDateModifier());

/** {@link DateConstructor.set} */
extend(Date, 'set', createStaticDateModifier('set'));

/** {@link Date.rewind} */
extend(Date.prototype, 'rewind', createDateModifier((v, b) => b - v));

/** {@link DateConstructor.rewind} */
extend(Date, 'rewind', createStaticDateModifier('rewind'));
