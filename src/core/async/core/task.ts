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
	FullAsyncOptions,

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
	readonly task: FullAsyncOptions<CTX>['task'];

	/** @inheritDoc */
	get name(): CanUndef<string> {
		return this.params.task.name;
	}

	/** @inheritDoc */
	readonly group: CanUndef<string>;

	/** @inheritDoc */
	readonly label: CanUndef<Label>;

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
	readonly clearFn: CanNull<ClearFn<CTX>>;

	/**
	 * Operation parameters
	 */
	protected params: FullAsyncOptions<CTX>;

	/**
	 * Local cache
	 */
	protected cache: LocalCache;

	/**
	 * Global cache
	 */
	protected globalCache: GlobalCache;

	constructor(id: object, params: FullAsyncOptions<CTX>, cache: LocalCache, globalCache: GlobalCache) {
		this.id = id;

		this.params = params;
		this.task = params.task;

		this.group = params.group;
		this.label = params.label;

		this.onClear = Array.toArray(params.onClear);
		this.clearFn = params.clearFn ?? null;

		this.cache = cache;
		this.globalCache = globalCache;
	}

	/**
	 * Unregisters the current task
	 */
	unregister(): void {
		const {id, label, cache: {links, labels}} = this;

		links.delete(id);
		this.globalCache.root.links.delete(id);

		if (label != null && labels?.[label] != null) {
			labels[label] = undefined;
		}
	}
}
