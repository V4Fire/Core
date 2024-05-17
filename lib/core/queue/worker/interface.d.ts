/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import AbstractQueue, { InnerQueue, CreateInnerQueue } from '../../../core/queue/interface';
export * from '../../../core/queue/interface';
export interface Task<T = unknown, V = unknown> {
    task: T;
    promise: Promise<V>;
    resolve(res: CanPromise<V>): void;
}
export declare type Tasks<T = unknown> = InnerQueue<T>;
export declare type CreateTasks<T extends Tasks<any>> = CreateInnerQueue<T>;
export interface QueueWorker<T = unknown, V = unknown> {
    (task: T): CanPromise<V>;
}
export interface WorkerQueueOptions<T extends Tasks<any> = Tasks> {
    /**
     * A factory to create the internal queue to store elements
     */
    tasksFactory?: CreateInnerQueue<T>;
    /**
     * The maximum number of concurrent workers
     */
    concurrency?: number;
    /**
     * How often to update task statuses (in milliseconds)
     */
    refreshInterval?: number;
}
/**
 * An abstract class for a worker queue data structure
 *
 * @typeparam T - the task element
 * @typeparam V - the worker value
 */
export default abstract class WorkerQueue<T, V = unknown> extends AbstractQueue<T> {
    /**
     * Type: a queue of tasks
     */
    readonly Tasks: Tasks;
    abstract readonly head: CanUndef<T>;
    /** @inheritDoc */
    get length(): number;
    /**
     * The maximum number of concurrent workers
     */
    concurrency: number;
    /**
     * How often to update task statuses (in milliseconds)
     */
    refreshInterval: number;
    /**
     * Number of active workers
     */
    activeWorkers: number;
    /**
     * The worker constructor
     */
    protected worker: QueueWorker<T, V>;
    /**
     * A queue of tasks
     */
    protected tasks: this['Tasks'];
    /**
     * @param worker
     * @param [opts] - additional options
     */
    protected constructor(worker: QueueWorker<T, V>, opts?: WorkerQueueOptions);
    /** @inheritDoc */
    abstract push(task: T): unknown;
    /**
     * Returns an asynchronous iterator over the queue elements
     */
    [Symbol.asyncIterator](): AsyncIterableIterator<T>;
    /** @inheritDoc */
    pop(): CanUndef<T>;
    /** @inheritDoc */
    clear(): void;
    /**
     * Returns a new blank internal queue of tasks
     */
    protected createTasks: CreateInnerQueue<this['Tasks']>;
    /**
     * Executes a task chunk from the queue
     */
    protected abstract perform(): unknown;
    /**
     * Executes a task chunk from the queue (deferred version)
     */
    protected deferPerform(): Promise<unknown>;
    /**
     * Starts an execution of tasks from the queue
     */
    protected start(): void;
    /**
     * Provides a task result to the specified promise resolve function
     *
     * @param task
     * @param resolve
     */
    protected resolveTask(task: T, resolve: Function): void;
}
