/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Factory to create rounding methods
 * @param method
 */
export function createRoundingFunction(method: AnyFunction): AnyFunction {
	return function wrapper(this: number, precision?: number): number {
		const
			val = Number(this);

		if (precision != null && precision > 0) {
			let
				multiplier = 10 ** Math.abs(precision);

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
export function createStaticRoundingFunction(method: string): AnyFunction {
	return function wrapper(value: number, precision: number): CanUndef<number> | AnyFunction {
		if (arguments.length < 2) {
			precision = value;
			return (value) => Number[Symbol.for('{@link V4_EXTEND_API}')][method](value, precision);
		}

		return value[method](precision);
	};
}

/**
 * Returns a descriptor for a getter that returns a string with attaching the specified type
 * @param type
 */
export function createStringTypeGetter(type: string): PropertyDescriptor {
	return {
		get(): string {
			return Number(this).toString() + type;
		}
	};
}

/**
 * Factory for functions that converts milliseconds by the specified offset
 * @param offset
 */
export function createMsFunction(offset: number): AnyFunction {
	fn.valueOf = fn;
	return fn;

	function fn(this: number): number {
		return Number(this) * offset;
	}
}

/**
 * Factory for static functions that converts milliseconds by the specified offset
 * @param offset
 */
export function createStaticMsFunction(offset: number): AnyFunction {
	return (value: number) => value * offset;
}

/**
 * Repeats a string with the specified number of repetitions and returns a new string
 *
 * @param str
 * @param num
 */
export function repeatString(str: string, num: number): string {
	str = String(str);

	let
		res = '';

	while (num > 0) {
		// eslint-disable-next-line no-bitwise
		if ((num & 1) > 0) {
			res += str;
		}

		// eslint-disable-next-line no-bitwise
		num >>= 1;

		if (num > 0) {
			str += str;
		}
	}

	return res;
}
