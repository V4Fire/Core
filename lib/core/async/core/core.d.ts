/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { Namespaces, PrimitiveNamespaces, PromiseNamespaces } from '../../../core/async/const';
import type { FullAsyncParams, FullClearParams, ClearProxyOptions, Marker, GlobalCache } from '../../../core/async/interface';
export default class Async<CTX extends object = Async<any>> {
    /**
     * The enum containing all namespaces supported by Async
     */
    static readonly Namespaces: typeof Namespaces;
    /**
     * The lock status.
     * If set to true, all new tasks won't be registered.
     */
    locked: boolean;
    /**
     * The enum containing all namespaces supported by Async
     */
    readonly Namespaces: typeof Namespaces;
    /**
     * Cache for asynchronous operations
     */
    protected readonly cache: GlobalCache[];
    /**
     * Cache for initialized workers
     */
    protected readonly workerCache: WeakMap<object, boolean>;
    /**
     * Task identifiers
     */
    protected readonly ids: WeakMap<object, object>;
    /**
     * The context of applying for asynchronous handlers
     */
    protected readonly ctx: CTX;
    /**
     * Used asynchronous namespaces
     */
    protected readonly usedNamespaces: boolean[];
    /**
     * @param [ctx] - the context of applying for asynchronous handlers
     */
    constructor(ctx?: CTX);
    /**
     * Returns a cache object by the specified name
     *
     * @param task
     */
    protected getCache(task: Pick<FullAsyncParams<any> | FullClearParams, 'namespace' | 'promise' | 'label'> & {
        group?: string | RegExp;
    }): GlobalCache;
    /**
     * Registers an asynchronous task with the specified parameters
     * @param params
     */
    protected registerTask<R = unknown>(params: FullAsyncParams<any>): R | null;
    /**
     * Cancels an asynchronous task (or a group of tasks) from the specified namespace
     *
     * @param params - the operation parameters or a reference to the task to be canceled
     * @param [namespace] - the namespace from which the task or tasks should be canceled
     */
    protected cancelTask(params: CanUndef<FullClearParams | any>, namespace?: Namespaces | PrimitiveNamespaces | PromiseNamespaces): this;
    /**
     * Marks an asynchronous task (or a group of tasks) within the specified namespace using the given marker
     *
     * @param marker
     * @param params - the operation parameters or a reference to the task to be marked
     * @param [namespace] - the namespace from which the task or tasks should be marked
     */
    protected markTask(marker: Marker, params: CanUndef<ClearProxyOptions | any>, namespace?: Namespaces | PrimitiveNamespaces | PromiseNamespaces): this;
    /**
     * Marks all asynchronous tasks within the specified namespace using the given marker
     *
     * @param marker
     * @param opts - the operation options
     */
    protected markAllTasks(marker: Marker, opts: FullClearParams): this;
}
