/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export * from 'core/queue/interface';

export interface TaskComparator<T> {
	(a: T, b: T): number;
}
