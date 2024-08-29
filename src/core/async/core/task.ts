/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Async from 'core/async';

import type {

	Label,
	FullAsyncParams,

	LocalCache,
	GlobalCache,

	AsyncCb,
	BoundFn,
	ClearFn,

	Task as AbstractTask

} from 'core/async/interface';

export default class Task<CTX extends object = Async> implements AbstractTask<CTX> {
	/** @inheritDoc */
	readonly id: object;

	/** @inheritDoc */
	readonly task: FullAsyncParams<CTX>['task'];

	/** @inheritDoc */
	get name(): CanUndef<string> {
		return this.params.task.name;
	}

	/** @inheritDoc */
	readonly group: CanUndef<string>;

	/** @inheritDoc */
	readonly label: CanUndef<Label>;

	/** @inheritDoc */
	unregistered: boolean = false;

	/** @inheritDoc */
	paused: boolean = false;

	/** @inheritDoc */
	muted: boolean = false;

	/** @inheritDoc */
	readonly queue: Function[] = [];

	/** @inheritDoc */
	readonly onComplete: Array<Array<BoundFn<CTX>>> = [];

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

	constructor(id: object, params: FullAsyncParams<CTX>, cache: LocalCache, globalCache: GlobalCache) {
		this.id = id;

		this.params = params;
		this.task = params.task;

		this.group = params.group;
		this.label = params.label;

		this.onClear = Array.toArray(params.onClear);
		this.clear = params.clear ?? null;

		this.cache = cache;
		this.globalCache = globalCache;
	}

	/**
	 * Unregisters the current task
	 */
	unregister(): void {
		const {id, label, cache} = this;

		cache.links.delete(id);
		this.globalCache.root.links.delete(id);

		if (label != null && cache.labels?.[label] != null) {
			cache.labels[label] = undefined;
		}

		this.unregistered = true;
	}
}
