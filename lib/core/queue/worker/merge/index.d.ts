/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/queue/worker/merge/README.md]]
 * @packageDocumentation
 */
import WorkerQueue from '../../../../core/queue/worker/interface';
import type { Task, Tasks, HashFn, QueueWorker, WorkerQueueOptions } from '../../../../core/queue/worker/merge/interface';
export * from '../../../../core/queue/worker/merge/interface';
/**
 * Implementation of a worker queue data structure with support of task merging by a specified hash function
 *
 * @typeparam T - the task element
 * @typeparam V - the worker value
 */
export default class MergeWorkerQueue<T, V = unknown> extends WorkerQueue<T, V> {
    readonly Tasks: Tasks<string>;
    get head(): CanUndef<T>;
    /**
     * A map of registered tasks
     */
    protected tasksMap: Map<string, Task<T, V>>;
    /**
     * A function to calculate task hashes
     */
    protected readonly hashFn: HashFn<T>;
    /**
     * @override
     * @param worker
     * @param [opts] - additional options
     */
    constructor(worker: QueueWorker<T, V>, opts: WorkerQueueOptions<T>);
    push(task: T): Promise<V>;
    pop(): CanUndef<T>;
    clear(): void;
    clone(): MergeWorkerQueue<T, V>;
    protected perform(): void;
}
