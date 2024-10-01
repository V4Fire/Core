/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type Async from '../../../core/async';
import type { Label, FullAsyncParams, LocalCache, GlobalCache, AsyncCb, BoundFn, ClearFn, Task as AbstractTask } from '../../../core/async/interface';
export default class Task<CTX extends object = Async> implements AbstractTask<CTX> {
    /** @inheritDoc */
    readonly id: object;
    /** @inheritDoc */
    readonly task: FullAsyncParams<CTX>['task'];
    /** @inheritDoc */
    get name(): CanUndef<string>;
    /** @inheritDoc */
    readonly group: CanUndef<string>;
    /** @inheritDoc */
    readonly label: CanUndef<Label>;
    /** @inheritDoc */
    unregistered: boolean;
    /** @inheritDoc */
    paused: boolean;
    /** @inheritDoc */
    muted: boolean;
    /** @inheritDoc */
    readonly queue: Function[];
    /** @inheritDoc */
    readonly onComplete: Array<Array<BoundFn<CTX>>>;
    /** @inheritDoc */
    readonly onClear: Array<AsyncCb<CTX>>;
    /** @inheritDoc */
    readonly clear: CanNull<ClearFn<CTX>>;
    /**
     * Operation parameters
     */
    protected params: FullAsyncParams<CTX>;
    /**
     * Local cache
     */
    protected cache: LocalCache;
    /**
     * Global cache
     */
    protected globalCache: GlobalCache;
    constructor(id: object, params: FullAsyncParams<CTX>, cache: LocalCache, globalCache: GlobalCache);
    /**
     * Unregisters the current task
     */
    unregister(): void;
}
