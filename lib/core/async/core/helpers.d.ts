/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { AsyncOptions } from '../../../core/async/events';
/**
 * Returns true if the specified value appears to be an instance of AsyncOptions
 * @param value
 */
export declare function isAsyncOptions<T extends object = AsyncOptions>(value: unknown): value is T;
