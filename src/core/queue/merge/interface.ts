/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { QueueOptions as BaseQueueOptions } from 'core/queue/interface';
export * from 'core/queue/interface';

export interface HashFn<T> {
	(task: T): string;
}

export interface QueueOptions<T> extends BaseQueueOptions {
	/**
	 * Hash function for a task
	 */
	hashFn?: HashFn<T>;
}

export interface Task<T = unknown, V = unknown> {
	task: T;
	promise: Promise<V>;
	resolve(res: CanPromise<V>): void;
}
