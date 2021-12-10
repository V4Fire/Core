/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type Store = WeakMap<object, Map<unknown, unknown>>;

export interface ResolvedTarget<T> {
	value: T;
	needWrap: boolean;
}
