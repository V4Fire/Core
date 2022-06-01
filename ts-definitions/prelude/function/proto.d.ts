/* eslint-disable @typescript-eslint/unified-signatures */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface Function {
	/**
	 * Returns a new function that allows to invoke the target function only once
	 */
	once<T>(this: T): T;

	/**
	 * Returns a new function that allows to invoke the target function only with the specified delay.
	 * The next invocation of the function will cancel the previous.
	 *
	 * @param [delay]
	 */
	debounce<T extends AnyFunction>(this: T, delay?: number): AnyFunction<Parameters<T>, void>;

	/**
	 * Returns a new function that allows to invoke the target function not more often than the specified delay.
	 * The first invoking of a function will run immediately, but all rest invokes will be merged to one and
	 * executes after the specified delay.
	 *
	 * @param [delay]
	 */
	throttle<T extends AnyFunction>(this: T, delay?: number): AnyFunction<Parameters<T>, void>;

	/**
	 * Returns a new function that allows to invoke the target function not more often than the specified delay.
	 * The first invoking of a function will run immediately, but all rest invokes will be merged to one and
	 * executes after the specified delay.
	 *
	 * @param opts - options for the operation
	 */
	throttle<T extends AnyFunction>(this: T, opts: ThrottleOptions): AnyFunction<Parameters<T>, void>;

	addToPrototype<T extends AnyFunction>(this: T, args: Array<Dictionary<Function> | Function>): T;

	/**
	 * Returns a new function based on the target that wraps the returning value into the Either structure.
	 * If the first argument of the created function is taken null or undefined, the function returns the rejected value.
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * toLowerCase.option()(null).catch((err) => err === null);
	 * toLowerCase.option()(1).catch((err) => err.message === 'str.toLowerCase is not a function');
	 *
	 * toLowerCase.option()('FOO').then((value) => value === 'foo');
	 * toLowerCase.option()(toLowerCase.option()('FOO')).then((value) => value === 'foo');
	 * ```
	 */
	option<R>(this: () => R): AnyFunction<any[], Maybe<R>>;

	/**
	 * Returns a new function based on the target that wraps the returning value into the Either structure.
	 * If the first argument of the created function is taken null or undefined, the function returns the rejected value.
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * toLowerCase.option()(null).catch((err) => err === null);
	 * toLowerCase.option()(1).catch((err) => err.message === 'str.toLowerCase is not a function');
	 *
	 * toLowerCase.option()('FOO').then((value) => value === 'foo');
	 * toLowerCase.option()(toLowerCase.option()('FOO')).then((value) => value === 'foo');
	 * ```
	 */
	option<A1, A extends any[], R>(this: (a1: A1, ...rest: A) => R):
		(a1: Maybe<Nullable<A1>> | Either<A1> | Nullable<A1>, ...rest: A) => Maybe<R>;

	/**
	 * Returns a new function based on the target that wraps the returning value into the Either structure
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * toLowerCase.result()(1).catch((err) => err.message === 'str.toLowerCase is not a function');
	 * toLowerCase.result()('FOO').then((value) => value === 'foo');
	 * toLowerCase.result()(toLowerCase.result()('FOO')).then((value) => value === 'foo');
	 * ```
	 */
	result<R>(this: () => R): AnyFunction<any[], Either<R>>;

	/**
	 * Returns a new function based on the target that wraps the returning value into the Either structure
	 *
	 * @example
	 * ```typescript
	 * function toLowerCase(str: string): string {
	 *   return str.toLowerCase();
	 * }
	 *
	 * toLowerCase.result()(1).catch((err) => err.message === 'str.toLowerCase is not a function');
	 * toLowerCase.result()('FOO').then((value) => value === 'foo');
	 * toLowerCase.result()(toLowerCase.result()('FOO')).then((value) => value === 'foo');
	 * ```
	 */
	result<A1, A extends any[], R>(this: (a1: A1, ...rest: A) => R):
		(a1: Maybe<A1> | Either<A1>, ...rest: A) => Either<R>;

	/**
	 * Returns a curried equivalent of the function.
	 *
	 * The curried function has two unusual capabilities.
	 * First, its arguments needn't be provided one at a time.
	 * If f is a ternary function and g is f.curry(), the following are equivalent:
	 *
	 * ```js
	 * g(1)(2)(3)
	 * g(1)(2, 3)
	 * g(1, 2)(3)
	 * g(1, 2, 3)
	 * ```
	 *
	 * Secondly, the special placeholder value Function.__ may be used to specify "gaps", allowing partial application
	 * of any combination of arguments, regardless of their positions. If g is as above and _ is Function.__,
	 * the following are equivalent:
	 *
	 * ```js
	 * g(1, 2, 3)
	 * g(_, 2, 3)(1)
	 * g(_, _, 3)(1)(2)
	 * g(_, _, 3)(1, 2)
	 * g(_, 2)(1)(3)
	 * g(_, 2)(1, 3)
	 * g(_, 2)(_, 3)(1)
	 * ```
	 */
	curry<T extends AnyFunction>(this: T): TB.Curry<T>;

	/**
	 * Performs left-to-right function composition.
	 * The first argument may have any arity; the remaining arguments must be unary.
	 *
	 * If any function from parameters returns a Promise, the next function from the parameters
	 * will take the resolved value of that promise,
	 * the final result of calling the composition function is also a promise.
	 */
	compose<T>(this: T): T;

	compose<A extends any[], T1, T2>(
		this: AnyFunction<A, T1>,
		fn1: AnyOneArgFunction<T1, T2>
	): AnyFunction<A, T1 extends Promise<any> ? Promise<T2> : T2>;

	compose<A extends any[], T1, T2, T3>(
		this: AnyFunction<A, T1>,
		fn1: AnyOneArgFunction<T1, T2>,
		fn2: AnyOneArgFunction<T2, T3>
	): AnyFunction<A, T2 extends Promise<any> ? Promise<T3> : T1 extends Promise<any> ? Promise<T3> : T3>;

	compose<A extends any[], T1, T2, T3, T4>(
		this: AnyFunction<A, T1>,
		fn1: AnyOneArgFunction<T1, T2>,
		fn2: AnyOneArgFunction<T2, T3>,
		fn3: AnyOneArgFunction<T3, T4>
	): AnyFunction<
		A,
		T3 extends Promise<any> ?
			Promise<T4> : T2 extends Promise<any> ?
				Promise<T4> : T1 extends Promise<any> ?
					Promise<T4> : T4
		>;

	compose<A extends any[], T1, T2, T3, T4, T5>(
		this: AnyFunction<A, T1>,
		fn1: AnyOneArgFunction<T1, T2>,
		fn2: AnyOneArgFunction<T2, T3>,
		fn3: AnyOneArgFunction<T3, T4>,
		fn4: AnyOneArgFunction<T4, T5>
	): AnyFunction<
		A,
		T4 extends Promise<any> ?
			Promise<T5> : T3 extends Promise<any> ?
				Promise<T5> : T2 extends Promise<any> ?
					Promise<T5> : T1 extends Promise<any> ?
						Promise<T5> : T5
		>;

	compose<A extends any[], T1, T2, T3, T4, T5, T6>(
		this: AnyFunction<A, T1>,
		fn1: AnyOneArgFunction<T1, T2>,
		fn2: AnyOneArgFunction<T2, T3>,
		fn3: AnyOneArgFunction<T3, T4>,
		fn4: AnyOneArgFunction<T4, T5>,
		fn5: AnyOneArgFunction<T5, T6>
	): AnyFunction<
		A,
		T5 extends Promise<any> ?
			Promise<T6> : T4 extends Promise<any> ?
				Promise<T6> : T3 extends Promise<any> ?
					Promise<T6> : T2 extends Promise<any> ?
						Promise<T6> : T1 extends Promise<any> ?
							Promise<T6> : T6
		>;
}
