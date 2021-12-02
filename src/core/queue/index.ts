/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/queue/README.md]]
 * @packageDocumentation
 */

export * from '@src/core/queue/interface';
export * from '@src/core/queue/worker/interface';
export { QueueOptions as WorkerQueueOptions } from '@src/core/queue/worker/interface';

export { default as AbstractQueue } from '@src/core/queue/interface';
export { default as AbstractWorkerQueue } from '@src/core/queue/worker/interface';

export { default as Queue } from '@src/core/queue/simple';
export { default as MergeWorkerQueue } from '@src/core/queue/worker/merge';
export { default as OrderedQueue } from '@src/core/queue/order';
