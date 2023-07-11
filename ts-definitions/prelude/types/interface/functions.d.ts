/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Universal interface for any function
 */
interface AnyFunction<A extends any[] = any[], R = any> extends Function {
	(...args: A): R;
}

/**
 * Universal interface for any one-argument function
 */
interface AnyOneArgFunction<A = any, R = any> extends Function {
	(arg: A): R;
}

/**
 * Universal interface for any constructor function
 */
type ClassConstructor<A extends any[] = any[], R = any> = new (...args: A) => R;

/**
 * Wraps the specified function that it returns a promise
 *
 * @example
 * ```typescript
 * type A = typeof () => null;
 *
 * // () => Promise<null>
 * type B = ReturnPromise<A>;
 * ```
 */
type ReturnPromise<T extends AnyFunction<any[], unknown>> = (...args: Parameters<T>) => Promise<ReturnType<T>>;

/**
 * Returns a new function based on the specified with adding as the first parameter the passed object
 *
 * @example
 * ```typescript
 * // (self: bFoo, a: number) => string
 * AddSelf<(a: number) => string, bFoo>
 * ```
 */
type AddSelf<M extends Function, S extends object> = M extends (...args: infer A) => infer R ?
	(self: S, ...args: A) => R :
	never;
