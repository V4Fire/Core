/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { deprecate } from 'core/functools';
import type { AsyncOptions } from 'core/async/modules/events';

/**
 * Returns true if the specified value is looks like an instance of AsyncOptions
 * @param value
 */
export function isAsyncOptions<T extends object = AsyncOptions>(value: unknown): value is T {
	return Object.isPlainObject(value);
}

/**
 * @deprecated
 * @see isAsyncOptions
 */
export const isParams = deprecate(
	{
		renamedTo: 'isAsyncOptions'
	},

	function isParams<T = AsyncOptions>(value: unknown): value is T {
		return isAsyncOptions(value);
	}
);
