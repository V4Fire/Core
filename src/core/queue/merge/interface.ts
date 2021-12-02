/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export * from '@src/core/queue/interface';

export interface HashFn<T> {
	(task: T): string;
}
