/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { QueueOptions as WorkerQueueOptions } from 'core/queue/worker/interface';
import { HashFn } from 'core/queue/merge/interface';

export * from 'core/queue/worker/interface';
export * from 'core/queue/merge/interface';

export interface QueueOptions<T> extends WorkerQueueOptions {
	/**
	 * Hash function for a task
	 */
	hashFn?: HashFn<T>;
}
