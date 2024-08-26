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
	id: object;

	/** @inheritDoc */
	get obj(): unknown {
		return this.task.obj;
	}

	/** @inheritDoc */
	get objName(): CanUndef<string> {
		return this.task.obj.name;
	}

	/** @inheritDoc */
	get group(): CanUndef<string> {
		return this.task.group;
	}

	/** @inheritDoc */
	get label(): CanUndef<Label> {
		return this.task.label;
	}

	/** @inheritDoc */
	paused: boolean = false;

	/** @inheritDoc */
	muted: boolean = false;

	/** @inheritDoc */
	queue: Function[] = [];

	/** @inheritDoc */
	onComplete: Array<Array<BoundFn<CTX>>> = [];

	/** @inheritDoc */
	onClear: Array<AsyncCb<CTX>>;

	/** @inheritDoc */
	get clearFn(): CanNull<ClearFn> {
		return this.task.clearFn ?? null;
	}

	protected task: FullAsyncOptions<any>;

	protected cache: LocalCache;

	protected globalCache: GlobalCache;

	constructor(id: object, task: FullAsyncOptions<any>, cache: LocalCache, globalCache: GlobalCache) {
		this.id = id;
		this.task = task;
		this.onClear = Array.toArray(task.onClear);
		this.cache = cache;
		this.globalCache = globalCache;
	}

	unregister(): void {
		const {id, label, cache: {links, labels}} = this;

		links.delete(id);
		this.globalCache.root.links.delete(id);

		if (label != null && labels[label] != null) {
			labels[label] = undefined;
		}
	}
}
