/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { deprecate } from 'core/functools';
import { AsyncOptions, Event } from 'core/async/interface';

/**
 * Returns true if the specified value is looks like an instance of AsyncOptions
 * @param value
 */
export function isAsyncOptions<T extends object = AsyncOptions>(value: unknown): value is T {
	return Object.isPlainObject(value);
}

/**
 * Returns true if the specified value is looks like an event object
 * @param value
 */
export function isEvent(value: unknown): value is Event {
	return Object.isPlainObject(value) && Object.isString((<any>value).event);
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
