/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Promisify } from 'core/async/modules/flat/interface';
import { proxymify } from 'core/async/modules/flat/helpers';

export * from 'core/async/modules/flat/interface';

export function flatAsync<T extends AnyFunction>(fn: T): Promisify<T>;

export function flatAsync<T>(value: CanPromiseLike<T>): Promisify<T>;

/**
 * The function allows you to work flatly with promises using the `Proxy` object.
 *
 * The value you pass will be patched using the `Promisify` type in such a way that
 * each of its members will be wrapped in a promise. However, you can still work with this value
 * without worrying about the nested promises.
 *
 * @param value
 * Can be any value or a function that returns any value.
 * The final value will be wrapped in `Promise`.
 *
 * @example
 * ```typescript
 * function getData(): Promise<Promise<number>[]> {
 *  return Promise.resolve([Promise.resolve(21)]);
 * }
 *
 * // "21"
 * const str = await flatAsync(getData)()[0].toFixed(1);
 * ```
 */
export default function flatAsync<T>(
	value: CanPromiseLike<T> | AnyFunction
): Promisify<T> {
	if (Object.isFunction(value)) {
		return Object.cast((...args: unknown[]) => proxymify(
			() => Promise.resolve(value(...args))
		));
	}

	return Object.cast(proxymify(() => Promise.resolve(value)));
}
