/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { WorkerQueueOptions as SuperWorkerQueueOptions } from 'core/queue/worker/interface';
import type { HashFn } from 'core/queue/merge/interface';

export * from 'core/queue/worker/interface';
export * from 'core/queue/merge/interface';

export interface WorkerQueueOptions<T> extends SuperWorkerQueueOptions {
	/**
	 * Hash function for a task
	 */
	hashFn?: HashFn<T>;
}
