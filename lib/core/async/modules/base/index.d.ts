/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { NamespacesDictionary } from '../../../../core/async/const';
import type { ClearOptions, ClearProxyOptions, GlobalCache, FullAsyncOptions, FullClearOptions } from '../../../../core/async/interface';
export * from '../../../../core/async/modules/base/const';
export * from '../../../../core/async/modules/base/helpers';
export * from '../../../../core/async/interface';
export default class Async<CTX extends object = Async<any>> {
    /**
     * Map of namespaces for asynchronous operations
     */
    static namespaces: NamespacesDictionary;
    /**
     * @deprecated
     * @see Async.namespaces
     */
    static linkNames: NamespacesDictionary;
    /**
     * The lock status.
     * If true, then all new tasks won't be registered.
     */
    locked: boolean;
    /**
     * Cache for asynchronous operations
     */
    protected readonly cache: Dictionary<GlobalCache>;
    /**
     * Cache for initialized workers
     */
    protected readonly workerCache: WeakMap<object, boolean>;
    /**
     * Map for task identifiers
     */
    protected readonly idsMap: WeakMap<object, object>;
    /**
     * Context of applying for asynchronous handlers
     */
    protected readonly ctx: CTX;
    /**
     * @deprecated
     * @see [[Async.ctx]]
     */
    protected readonly context: CTX;
    /**
     * Set of used asynchronous namespaces
     */
    protected readonly usedNamespaces: Set<string>;
    /**
     * Link to `Async.namespaces`
     */
    protected get namespaces(): NamespacesDictionary;
    /**
     * @deprecated
     * @see [[Async.namespaces]]
     */
    protected get linkNames(): NamespacesDictionary;
    /**
     * @param [ctx] - context of applying for async handlers
     */
    constructor(ctx?: CTX);
    /**
     * Clears all asynchronous tasks
     * @param [opts] - additional options for the operation
     */
    clearAll(opts?: ClearOptions): this;
    /**
     * Mutes all asynchronous tasks
     * @param [opts] - additional options for the operation
     */
    muteAll(opts?: ClearOptions): this;
    /**
     * Unmutes all asynchronous tasks
     * @param [opts] - additional options for the operation
     */
    unmuteAll(opts?: ClearOptions): this;
    /**
     * Suspends all asynchronous tasks
     * @param [opts] - additional options for the operation
     */
    suspendAll(opts?: ClearOptions): this;
    /**
     * Unsuspends all asynchronous tasks
     * @param [opts] - additional options for the operation
     */
    unsuspendAll(opts?: ClearOptions): this;
    /**
     * Returns a cache object by the specified name
     *
     * @param name
     * @param [promise] - if true, the namespace is marked as promisified
     */
    protected getCache(name: string, promise?: boolean): GlobalCache;
    /**
     * @deprecated
     * @see [[Async.getCache]]
     */
    protected initCache(name: string, promise?: boolean): GlobalCache;
    /**
     * Registers the specified asynchronous task
     * @param task
     */
    protected registerTask<R = unknown>(task: FullAsyncOptions<any>): R | null;
    /**
     * @deprecated
     * @see [[Async.registerTask]]
     */
    protected setAsync<R = unknown>(task: FullAsyncOptions): R | null;
    /**
     * Cancels a task (or a group of tasks) from the specified namespace
     *
     * @param task - operation options or task link
     * @param [name] - namespace of the operation
     */
    protected cancelTask(task: CanUndef<FullClearOptions | any>, name?: string): this;
    /**
     * @deprecated
     * @see [[Async.cancelTask]]
     */
    protected clearAsync(opts: CanUndef<FullClearOptions | any>, name?: string): this;
    /**
     * Marks a task (or a group of tasks) from the namespace by the specified label
     *
     * @param label
     * @param task - operation options or a link to the task
     * @param [name] - namespace of the operation
     */
    protected markTask(label: string, task: CanUndef<ClearProxyOptions | any>, name?: string): this;
    /**
     * @deprecated
     * @see [[Async.markTask]]
     */
    protected markAsync(label: string, opts: CanUndef<ClearProxyOptions | any>, name?: string): this;
    /**
     * Marks all asynchronous tasks from the namespace by the specified label
     *
     * @param label
     * @param opts - operation options
     */
    protected markAllTasks(label: string, opts: FullClearOptions): this;
}
