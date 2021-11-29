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
export function identity<T>(value: T): T {
	return value;
}

/**
 * Returns a function that always returns the specified value
 * @param value
 */
export function constant<T>(value: T): AnyFunction<AnyArgs, T> {
	return () => value;
}
