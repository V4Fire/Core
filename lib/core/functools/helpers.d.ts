/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * Returns the specified value
 */
export declare function identity<T>(value: T): T;
/**
 * Returns a function that always returns the specified value
 * @param value
 */
export declare function constant<T>(value: T): AnyFunction<any[], T>;
