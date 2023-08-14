/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/queue/worker/simple/README.md]]
 * @packageDocumentation
 */
import WorkerQueue from '../../../../core/queue/worker/interface';
import type { Task, Tasks } from '../../../../core/queue/worker/simple/interface';
export * from '../../../../core/queue/worker/merge/interface';
/**
 * Implementation of a worker queue data structure
 *
 * @typeparam T - the task element
 * @typeparam V - the worker value
 */
export default class SimpleWorkerQueue<T, V = unknown> extends WorkerQueue<T, V> {
    readonly Tasks: Tasks<Task<T>>;
    get head(): CanUndef<T>;
    push(task: T): Promise<V>;
    /** @inheritDoc */
    clone(): SimpleWorkerQueue<T, V>;
    protected perform(): void;
}
