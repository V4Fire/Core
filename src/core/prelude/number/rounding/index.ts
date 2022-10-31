/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { createRoundingFunction, createStaticRoundingFunction } from 'core/prelude/number/helpers';

/** @see [[Number.floor]] */
export const floor = extend(Number.prototype, 'floor', createRoundingFunction(Math.floor));

/** @see [[Number.round]] */
export const round = extend(Number.prototype, 'round', createRoundingFunction(Math.round));

/** @see [[Number.ceil]] */
export const ceil = extend(Number.prototype, 'ceil', createRoundingFunction(Math.ceil));

//#if standalone/prelude
/** @see [[NumberConstructor.round]] */
extend(Number, 'round', createStaticRoundingFunction('round'));

/** @see [[NumberConstructor.round]] */
extend(Number, 'ceil', createStaticRoundingFunction('ceil'));

/** @see [[NumberConstructor.floor]] */
extend(Number, 'floor', createStaticRoundingFunction('floor'));
//#endif
