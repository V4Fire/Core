/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* eslint-disable @typescript-eslint/ban-types */

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

type WithPromise<Wrapped, Origin> = Wrapped & Promise<Origin>;

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
	: Value extends Array<infer Item>
	? WithPromise<Array<Promisify<Item>>, Item[]>
	: Value;

type PromisifySchema<Schema, Origin> = Schema extends AnyFunction
	? Overloads<Origin>

	: WithPromise<
		{
			[Key in keyof Schema]: Promisify<Schema[Key]>;
		},
		Origin
	>;

export type Promisify<Value> = PromisifySchema<GetSchema<Value>, Value>;
