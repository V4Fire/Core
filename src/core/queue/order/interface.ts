/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface Tasks<T> extends Array<T> {}

export interface TaskComparator<T> {
	(a: T, b: T): number;
}
