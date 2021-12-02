/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { WorkerQueueOptions as SuperWorkerQueueOptions } from '@src/core/queue/worker/interface';
import type { HashFn } from '@src/core/queue/merge/interface';

export * from '@src/core/queue/worker/interface';
export * from '@src/core/queue/merge/interface';

export interface WorkerQueueOptions<T> extends SuperWorkerQueueOptions {
	/**
	 * Hash function for a task
	 */
	hashFn?: HashFn<T>;
}
