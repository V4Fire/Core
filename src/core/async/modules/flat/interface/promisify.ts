/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* eslint-disable @typescript-eslint/ban-types */

/**
 * Promisifies each function overload return type
 */
type Overloads<T> = T extends () => infer R
	? T extends (...args: infer A) => any
		? (...args: A) => Promisify<R>
		: () => Promisify<R>

	: T extends {
		(...args: infer A0): infer R0;
		(...args: infer A1): infer R1;
		(...args: infer A2): infer R2;
		(...args: infer A3): infer R3;
		(...args: infer A4): infer R4;
		(...args: infer A5): infer R5;
		(...args: infer A6): infer R6;
		(...args: infer A7): infer R7;
		(...args: infer A8): infer R8;
		(...args: infer A9): infer R9;
	}
	? {
		(...args: A0): Promisify<R0>;
		(...args: A1): Promisify<R1>;
		(...args: A2): Promisify<R2>;
		(...args: A3): Promisify<R3>;
		(...args: A4): Promisify<R4>;
		(...args: A5): Promisify<R5>;
		(...args: A6): Promisify<R6>;
		(...args: A7): Promisify<R7>;
		(...args: A8): Promisify<R8>;
		(...args: A9): Promisify<R9>;
	}

	: T extends {
		(...args: infer A0): infer R0;
		(...args: infer A1): infer R1;
		(...args: infer A2): infer R2;
		(...args: infer A3): infer R3;
		(...args: infer A4): infer R4;
		(...args: infer A5): infer R5;
		(...args: infer A6): infer R6;
		(...args: infer A7): infer R7;
		(...args: infer A8): infer R8;
	}
	? {
		(...args: A0): Promisify<R0>;
		(...args: A1): Promisify<R1>;
		(...args: A2): Promisify<R2>;
		(...args: A3): Promisify<R3>;
		(...args: A4): Promisify<R4>;
		(...args: A5): Promisify<R5>;
		(...args: A6): Promisify<R6>;
		(...args: A7): Promisify<R7>;
		(...args: A8): Promisify<R8>;
	}

	: T extends {
		(...args: infer A0): infer R0;
		(...args: infer A1): infer R1;
		(...args: infer A2): infer R2;
		(...args: infer A3): infer R3;
		(...args: infer A4): infer R4;
		(...args: infer A5): infer R5;
		(...args: infer A6): infer R6;
		(...args: infer A7): infer R7;
	}
	? {
		(...args: A0): Promisify<R0>;
		(...args: A1): Promisify<R1>;
		(...args: A2): Promisify<R2>;
		(...args: A3): Promisify<R3>;
		(...args: A4): Promisify<R4>;
		(...args: A5): Promisify<R5>;
		(...args: A6): Promisify<R6>;
		(...args: A7): Promisify<R7>;
	}

	: T extends {
		(...args: infer A0): infer R0;
		(...args: infer A1): infer R1;
		(...args: infer A2): infer R2;
		(...args: infer A3): infer R3;
		(...args: infer A4): infer R4;
		(...args: infer A5): infer R5;
		(...args: infer A6): infer R6;
	}
	? {
		(...args: A0): Promisify<R0>;
		(...args: A1): Promisify<R1>;
		(...args: A2): Promisify<R2>;
		(...args: A3): Promisify<R3>;
		(...args: A4): Promisify<R4>;
		(...args: A5): Promisify<R5>;
		(...args: A6): Promisify<R6>;
	}

	: T extends {
		(...args: infer A0): infer R0;
		(...args: infer A1): infer R1;
		(...args: infer A2): infer R2;
		(...args: infer A3): infer R3;
		(...args: infer A4): infer R4;
		(...args: infer A5): infer R5;
	}
	? {
		(...args: A0): Promisify<R0>;
		(...args: A1): Promisify<R1>;
		(...args: A2): Promisify<R2>;
		(...args: A3): Promisify<R3>;
		(...args: A4): Promisify<R4>;
		(...args: A5): Promisify<R5>;
	}

	: T extends {
			(...args: infer A0): infer R0;
			(...args: infer A1): infer R1;
			(...args: infer A2): infer R2;
			(...args: infer A3): infer R3;
			(...args: infer A4): infer R4;
		}
	? {
		(...args: A0): Promisify<R0>;
		(...args: A1): Promisify<R1>;
		(...args: A2): Promisify<R2>;
		(...args: A3): Promisify<R3>;
		(...args: A4): Promisify<R4>;
	}

	: T extends {
			(...args: infer A0): infer R0;
			(...args: infer A1): infer R1;
			(...args: infer A2): infer R2;
			(...args: infer A3): infer R3;
		}
	? {
		(...args: A0): Promisify<R0>;
		(...args: A1): Promisify<R1>;
		(...args: A2): Promisify<R2>;
		(...args: A3): Promisify<R3>;
	}

	: T extends {
			(...args: infer A0): infer R0;
			(...args: infer A1): infer R1;
			(...args: infer A2): infer R2;
		}
	? {
		(...args: A0): Promisify<R0>;
		(...args: A1): Promisify<R1>;
		(...args: A2): Promisify<R2>;
	}

	: T extends {
			(...args: infer A0): infer R0;
			(...args: infer A1): infer R1;
		}
	? {
		(...args: A0): Promisify<R0>;
		(...args: A1): Promisify<R1>;
	}

	: T extends (...args: infer A) => infer R
	? (...args: A) => Promisify<R>

	: never;

/**
 * Adds `Promise` properties to the specified value
 */
type WithPromise<Wrapped, Origin> = Wrapped & Promise<Origin>;

/**
 * Maps primitive values to their object representation and "unwraps" `PromiseLike` objects
 */
type GetSchema<Value> = Value extends string
	? String
	: Value extends number
	? Number
	: Value extends boolean
	? Boolean
	: Value extends bigint
	? BigInt
	: Value extends symbol
	? Symbol
	: Value extends PromiseLike<infer Item>
	? GetSchema<Item>
	: Value;

/**
 * Promisifies members of the specified schema by creating an object with the promisified properties
 * or promisifying return type of each function overload
 */
type PromisifySchema<Schema, Origin> = Schema extends AnyFunction
	? Overloads<Origin>

	: WithPromise<
		{
			[Key in keyof Schema]: Promisify<Schema[Key]>;
		},
		Origin
	>;

/**
 * Patches all members of the specified value in such a way that
 * each of them will be wrapped in a promise but at the same time preserving its own properties
 */
export type Promisify<Value> = PromisifySchema<GetSchema<Value>, Value>;
