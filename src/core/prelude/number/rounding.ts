/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see Number.floor */
extend(Number.prototype, 'floor', createRoundingFunction(Math.floor));

/** @see NumberConstructor.floor */
extend(Number, 'floor', createStaticRoundingFunction('floor'));

/** @see Number.round */
extend(Number.prototype, 'round', createRoundingFunction(Math.round));

/** @see NumberConstructor.round */
extend(Number, 'round', createStaticRoundingFunction('round'));

/** @see Number.ceil */
extend(Number.prototype, 'ceil', createRoundingFunction(Math.ceil));

/** @see NumberConstructor.round */
extend(Number, 'ceil', createStaticRoundingFunction('ceil'));

/**
 * Factory to create rounding methods
 * @param method
 */
export function createRoundingFunction(method: Function): Function {
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

/**
 * Factory to create static rounding methods
 * @param method
 */
export function createStaticRoundingFunction(method: string): Function {
	// tslint:disable-next-line:only-arrow-functions
	return function (value: unknown, precision: number): CanUndef<number> | Function {
		if (arguments.length < 2) {
			precision = <number>value;
			return (value) => Number[method](value, precision);
		}

		if (value == null) {
			return undefined;
		}

		return Number(value)[method](value, precision);
	};
}
