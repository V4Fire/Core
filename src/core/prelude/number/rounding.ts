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
extend(Number.prototype, 'floor', createRoundingFunction(Math.floor));

/** @see [[NumberConstructor.floor]] */
extend(Number, 'floor', createStaticRoundingFunction('floor'));

/** @see [[Number.round]] */
extend(Number.prototype, 'round', createRoundingFunction(Math.round));

/** @see [[NumberConstructor.round]] */
extend(Number, 'round', createStaticRoundingFunction('round'));

/** @see [[Number.ceil]] */
extend(Number.prototype, 'ceil', createRoundingFunction(Math.ceil));

/** @see [[NumberConstructor.round]] */
extend(Number, 'ceil', createStaticRoundingFunction('ceil'));
