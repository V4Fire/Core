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
			return;
		}

		return Number(value)[method](value, precision);
	};
}

/**
 * Returns a descriptor for a getter that returns a string with attaching the specified type
 * @param type
 */
export function createStringTypeGetter(type: string): PropertyDescriptor {
	return {
		get(): string {
			return Number(this) + type;
		}
	};
}

/**
 * Factory for functions that converts milliseconds by the specified offset
 * @param offset
 */
export function createMsFunction(offset: number): Function {
	const fn = function (this: number): number {
		return Number(this) * offset;
	};

	fn.valueOf = fn;
	return fn;
}

/**
 * Factory for static functions that converts milliseconds by the specified offset
 * @param offset
 */
export function createStaticMsFunction(offset: number): Function {
	return (value) => {
		if (value == null) {
			return;
		}

		return Number(value) * offset;
	};
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
		// tslint:disable-next-line:no-bitwise
		if (num & 1) {
			res += str;
		}

		// tslint:disable-next-line:no-bitwise
		num >>= 1;

		if (num) {
			str += str;
		}
	}

	return res;
}
