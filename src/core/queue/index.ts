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

export * from 'core/queue/interface';
export * from 'core/queue/worker/interface';
export { QueueOptions as WorkerQueueOptions } from 'core/queue/worker/interface';

export { default as AbstractQueue } from 'core/queue/interface';
export { default as AbstractWorkerQueue } from 'core/queue/worker/interface';

export { default as Queue } from 'core/queue/simple';
export { default as MergeWorkerQueue } from 'core/queue/worker/merge';
