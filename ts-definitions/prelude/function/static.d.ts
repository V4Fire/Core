/* eslint-disable @typescript-eslint/unified-signatures */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface FunctionConstructor {
	/**
	 * Link to the special functional placeholder that can be used with curried functions
	 *
	 * @example
	 * ```js
	 * function sum(a, b) {
	 *   return a + b;
	 * }
	 *
	 * sum.curry()(Function.__, 2)(5)
	 * ```
	 */
	__: TB.__;

	/**
	 * Returns a new function that allows to invoke the specified function only once
	 * @param fn
	 */
	once<T extends AnyFunction>(fn: T): T;

	/**
	 * Cancels the memoization of the function result
	 */
	cancelOnce(this: Function): void;

	/**
	 * Returns a new function that allows to invoke a function, which it takes, only with the specified delay.
	 * The next invocation of the function will cancel the previous.
	 *
	 * @param delay
	 */
	debounce(delay: number): <A extends any[]>(fn: AnyFunction<A>) => AnyFunction<A, void>;

	/**
	 * Returns a new function that allows to invoke the function only with the specified delay.
	 * The next invocation of the function will cancel the previous.
	 *
	 * @param fn
	 * @param [delay]
	 */
	debounce<A extends any[]>(fn: AnyFunction<A>, delay?: number): AnyFunction<A, void>;

	/**
	 * Returns a new function that allows to invoke a function, which it takes, not more often than the specified delay.
	 * The first invoking of a function will run immediately, but all rest invokes will be merged to one and
	 * executes after the specified delay.
	 *
	 * @param delay
	 */
	throttle(delay: number): <A extends any[]>(fn: AnyFunction<A>) => AnyFunction<A, void>;

	/**
	 * Returns a new function that allows to invoke a function, which it takes, not more often than the specified delay.
	 * The first invoking of a function will run immediately, but all rest invokes will be merged to one and
	 * executes after the specified delay.
	 *
	 * @param opts - options for the operation
	 */
	throttle(opts: ThrottleOptions): <A extends any[]>(fn: AnyFunction<A>) => AnyFunction<A, void>;

	/**
	 * Returns a new function that allows to invoke the function not more often than the specified delay.
	 * The first invoking of a function will run immediately, but all rest invokes will be merged to one and
	 * executes after the specified delay.
	 *
	 * @param fn
	 * @param [delay]
	 */
	throttle<A extends any[]>(fn: AnyFunction<A>, delay?: number): AnyFunction<A, void>;

	/**
	 * Returns a new function that allows to invoke the function not more often than the specified delay.
	 * The first invoking of a function will run immediately, but all rest invokes will be merged to one and
	 * executes after the specified delay.
	 *
	 * @param fn
	 * @param opts - options for the operation
	 */
	throttle<A extends any[]>(fn: AnyFunction<A>, opts: ThrottleOptions): AnyFunction<A, void>;

	/**
	 * Returns a curried equivalent of the provided function.
	 *
	 * The curried function has two unusual capabilities.
	 * First, its arguments needn't be provided one at a time.
	 * If f is a ternary function and g is Function.curry(f), the following are equivalent:
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
	curry<T extends AnyFunction>(f: T): TB.Curry<T>;

	/**
	 * Performs right-to-left function composition.
	 * The last argument may have any arity; the remaining arguments must be unary.
	 *
	 * If any function from parameters returns a Promise, the next function from the parameters
	 * will take the resolved value of that promise,
	 * the final result of calling the composition function is also a promise.
	 *
	 * @param fn0
	 */
	compose<A extends any[], T1>(fn0: AnyFunction<A, T1>): AnyFunction<A, T1>;

	compose<A extends any[], T1, T2>(
		fn1: AnyOneArgFunction<PromiseType<T1>, T2>,
		fn0: AnyFunction<A, T1>
	): AnyFunction<A, T1 extends Promise<any> ? NewPromise<T1, T2> : T2>;

	compose<A extends any[], T1, T2, T3>(
		fn2: AnyOneArgFunction<PromiseType<T2>, T3>,
		fn1: AnyOneArgFunction<PromiseType<T1>, T2>,
		fn0: AnyFunction<A, T1>
	): AnyFunction<A, T2 extends Promise<any> ? Promise<T3> : T1 extends Promise<any> ? Promise<T3> : T3>;

	compose<A extends any[], T1, T2, T3, T4>(
		fn3: AnyOneArgFunction<PromiseType<T3>, T4>,
		fn2: AnyOneArgFunction<PromiseType<T2>, T3>,
		fn1: AnyOneArgFunction<PromiseType<T1>, T2>,
		fn0: AnyFunction<A, T1>
	): AnyFunction<
		A,
		T3 extends Promise<any> ?
			Promise<T4> : T2 extends Promise<any> ?
				Promise<T4> : T1 extends Promise<any> ?
					Promise<T4> : T4
		>;

	compose<A extends any[], T1, T2, T3, T4, T5>(
		fn4: AnyOneArgFunction<PromiseType<T4>, T5>,
		fn3: AnyOneArgFunction<PromiseType<T3>, T4>,
		fn2: AnyOneArgFunction<PromiseType<T2>, T3>,
		fn1: AnyOneArgFunction<PromiseType<T1>, T2>,
		fn0: AnyFunction<A, T1>
	): AnyFunction<
		A,
		T4 extends Promise<any> ?
			Promise<T5> : T3 extends Promise<any> ?
				Promise<T5> : T2 extends Promise<any> ?
					Promise<T5> : T1 extends Promise<any> ?
						Promise<T5> : T5
		>;

	compose<A extends any[], T1, T2, T3, T4, T5, T6>(
		fn5: AnyOneArgFunction<PromiseType<T5>, T6>,
		fn4: AnyOneArgFunction<PromiseType<T4>, T5>,
		fn3: AnyOneArgFunction<PromiseType<T3>, T4>,
		fn2: AnyOneArgFunction<PromiseType<T2>, T3>,
		fn1: AnyOneArgFunction<PromiseType<T1>, T2>,
		fn0: AnyFunction<A, T1>
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
