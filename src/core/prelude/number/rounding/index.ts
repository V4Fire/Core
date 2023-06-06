/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { createRoundingFunction, createStaticRoundingFunction } from 'core/prelude/number/helpers';

/** {@link Number.floor} */
extend(Number.prototype, 'floor', createRoundingFunction(Math.floor));

/** {@link NumberConstructor.floor} */
extend(Number, 'floor', createStaticRoundingFunction('floor'));

/** {@link Number.round} */
extend(Number.prototype, 'round', createRoundingFunction(Math.round));

/** {@link NumberConstructor.round} */
extend(Number, 'round', createStaticRoundingFunction('round'));

/** {@link Number.ceil} */
extend(Number.prototype, 'ceil', createRoundingFunction(Math.ceil));

/** {@link NumberConstructor.round} */
extend(Number, 'ceil', createStaticRoundingFunction('ceil'));
