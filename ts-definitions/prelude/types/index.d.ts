/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/// <reference path="./interface/index.d.ts"/>

interface ObjectConstructor {
	/**
	 * Casts any value to the specified type
	 * @param value
	 */
	cast<T = unknown>(value: any): T;

	/**
	 * Throws an error.
	 * This method is useful because the `throw` operator can't be used within expressions.
	 *
	 * @param [err]
	 */
	throw(err?: string | Error): any;

	/**
	 * Returns true if the specified value can be interpreted as true
	 * @param value
	 */
	isTruly(value: any): boolean;

	/**
	 * Returns true if the specified value has a primitive type
	 * @param value
	 */
	isPrimitive(value: any): value is Primitive;

	/**
	 * Returns true if the specified value is undefined
	 * @param value
	 */
	isUndef(value: any): value is undefined;

	/**
	 * Returns true if the specified value is null
	 * @param value
	 */
	isNull(value: any): value is null;

	/**
	 * Returns true if the specified value is null or undefined
	 * @param value
	 */
	isNullable(value: any): value is null | undefined;

	/**
	 * Returns true if the specified value is a string
	 * @param value
	 */
	isString(value: any): value is string;

	/**
	 * Returns true if the specified value is a number
	 * @param value
	 */
	isNumber(value: any): value is number;

	/**
	 * Returns true if the specified value is a boolean
	 * @param value
	 */
	isBoolean(value: any): value is boolean;

	/**
	 * Returns true if the specified value is a symbol
	 * @param value
	 */
	isSymbol(value: any): value is symbol;

	/**
	 * Returns true if the specified value is a regular expression
	 * @param value
	 */
	isRegExp(value: any): value is RegExp;

	/**
	 * Returns true if the specified value is a date
	 * @param value
	 */
	isDate(value: any): value is Date;

	/**
	 * Returns true if the specified value is an array
	 * @param value
	 */
	isArray(value: any): value is unknown[];

	/**
	 * Returns true if the specified value is looks like an array
	 * @param value
	 */
	isArrayLike(value: any): value is ArrayLike<any>;

	/**
	 * Returns true if the specified value is a map
	 * @param value
	 */
	isMap(value: any): value is Map<unknown, unknown>;

	/**
	 * Returns true if the specified value is a weak map
	 * @param value
	 */
	isWeakMap(value: any): value is WeakMap<object, unknown>;

	/**
	 * Returns true if the specified value is a set
	 * @param value
	 */
	isSet(value: any): value is Set<unknown>;

	/**
	 * Returns true if the specified value is a weak set
	 * @param value
	 */
	isWeakSet(value: any): value is WeakSet<object>;

	/**
	 * Returns true if the specified value is a dictionary.
	 * This method is similar to "isPlainObject", but it has another output TS type:
	 * instead of inferring of an output type the method always cast the type to a dictionary.
	 *
	 * @param value
	 *
	 * @example
	 * ```typescript
	 * interface Foo {
	 *   bar(): number;
	 * }
	 *
	 * function foo(val: number | Foo) {
	 *   if (Object.isPlainObject(val)) {
	 *     val.bar(); // All fine
	 *   }
	 *
	 *   if (Object.isDictionary(val)) {
	 *     val.bar(); // Warning: object is of type unknown
	 *   }
	 * }
	 * ```
	 */
	isDictionary(value: any): value is Dictionary;

	/**
	 * Returns true if the specified value is a plain object,
	 * i.e. it has `null` prototype or was constructed via `Object`
	 *
	 * @param obj
	 */
	isPlainObject<T>(obj: T): obj is
		// @ts-ignore (unsafe type cast)
		T extends
			any[] |

			Int8Array |
			Int16Array |
			Int32Array |

			Uint8Array |
			Uint8ClampedArray |
			Uint16Array |
			Uint32Array |

			Float32Array |
			Float64Array |

			ArrayBuffer |
			SharedArrayBuffer |
			DataView |
			FormData |
			Blob |

			Date |
			RegExp |
			Map<any, any> |
			WeakMap<any, any> |
			Set<any> |
			WeakSet<any> |
			Promise<any> |

			Generator |
			AnyFunction |

			/* eslint-disable @typescript-eslint/ban-types */

			Number |
			String |
			Symbol |
			Boolean |

			/* eslint-enable @typescript-eslint/ban-types */

			Node |
			Document |
			Window |
			Navigator |
			Error |

			Intl.Collator |
			Intl.DateTimeFormat |
			Intl.NumberFormat

		? Dictionary : T extends object ? NonNullable<T> : Dictionary;

	/**
	 * Returns true if the specified value is a custom (not native) object or function
	 * @param value
	 */
	isCustomObject(value: any): boolean;

	/**
	 * Returns true if the specified value is a simple object (without a string type tag)
	 * @param value
	 */
	isSimpleObject<T extends object = object>(value: any): value is T;

	/**
	 * Returns true if the specified value is a function
	 * @param value
	 */
	isFunction(value: any): value is AnyFunction;

	/**
	 * Returns true if the specified value is a simple function.
	 * This method is similar to "isFunction", but it has another output TS type.
	 *
	 * @param value
	 */
	isSimpleFunction(value: any): value is Function;

	/**
	 * Returns true if the specified value is a sync generator function
	 * @param value
	 */
	isGenerator(value: any): value is GeneratorFunction;

	/**
	 * Returns true if the specified value is an asynchronous generator function
	 * @param value
	 */
	isAsyncGenerator(value: any): value is AsyncGeneratorFunction;

	/**
	 * Returns true if the specified value is a synchronous iterable structure
	 * @param value
	 */
	isIterable(value: any): value is Iterable<unknown>;

	/**
	 * Returns true if the specified value is an asynchronous iterable structure
	 * @param value
	 */
	isAsyncIterable(value: any): value is AsyncIterable<unknown>;

	/**
	 * Returns true if the specified value is any iterable structure
	 * @param value
	 */
	isAnyIterable(value: any): value is AnyIterable;

	/**
	 * Returns true if the specified value is a synchronous iterator
	 * @param value
	 */
	isIterator(value: any): value is Iterator<unknown>;

	/**
	 * Returns true if the specified value is an aasynchronoussync iterator
	 * @param value
	 */
	isAsyncIterator(value: any): value is AsyncIterator<unknown>;

	/**
	 * Returns true if the specified value is a sync/async iterator
	 * @param value
	 */
	isAnyIterator(value: any): value is AnyIterator;

	/**
	 * Returns true if the specified value is an iterable iterator
	 * @param value
	 */
	isIterableIterator(value: any): value is IterableIterator<unknown>;

	/**
	 * Returns true if the specified value is a promise
	 * @param value
	 */
	isPromise(value: any): value is Promise<unknown>;

	/**
	 * Returns true if the specified value is looks like a promise
	 * @param value
	 */
	isPromiseLike(value: any): value is PromiseLike<unknown>;

	/**
	 * Returns true if the specified value is looks like a proxy
	 * @param value
	 */
	isProxy<T>(value: T): T extends Primitive ? false : boolean;

	/**
	 * If the passed value is a proxy object, the method returns an original object.
	 * Otherwise, the passed object itself.
	 *
	 * @param value
	 */
	unwrapProxy<T>(value: T): T;

	/**
	 * @deprecated
	 * @see [[ObjectConstructor.isPlainObject]]
	 * @see [[ObjectConstructor.isDictionary]]
	 */
	isObject(value: any): value is Dictionary;
}
