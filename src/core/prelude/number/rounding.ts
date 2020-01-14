/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see Number.prototype.floor */
extend(Number.prototype, 'floor', createRoundingFunction(Math.floor));

/** @see Number.prototype.round */
extend(Number.prototype, 'round', createRoundingFunction(Math.round));

/** @see Number.prototype.ceil */
extend(Number.prototype, 'ceil', createRoundingFunction(Math.ceil));

function createRoundingFunction(method: Function): Function {
	return function (this: number, precision?: number): number {
		const
			val = Number(this);

		if (precision) {
			let
				multiplier = Math.pow(10, Math.abs(precision));

			if (precision < 0) {
				multiplier = 1 / multiplier;
			}

			return method(val * multiplier) / multiplier;
		}

		return method(val);
	};
}
