/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { deprecate, deprecated } from 'core/meta/deprecation';
import { namespaces, NamespacesDictionary } from 'core/async/const';
import {

	AsyncOptions,
	FullAsyncOptions,
	ClearOptions,
	FullClearOptions,
	ClearProxyOptions,
	GlobalCache,
	AsyncCb

} from 'core/async/interface';

export * from 'core/async/interface';
export * from 'core/async/const';

export const
	isZombieGroup = /:zombie\b/;

export const
	isPromisifyNamespace = /Promise$/,

	/** @deprecated */
	isPromisifyLinkName = isPromisifyNamespace;

/**
 * Returns true if the specified value is looks like an instance of AsyncOptions
 * @param value
 */
export function isAsyncOptions<T = AsyncOptions>(value: unknown): value is T {
	return Object.isPlainObject(value);
}

/**
 * @deprecated
 * @see isAsyncOptions
 */
export const isParams = deprecate(
	{
		renamedTo: 'isAsyncOptions'
	},

	function isParams<T = AsyncOptions>(value: unknown): value is T {
		return isAsyncOptions(value);
	}
);

export default class Async<CTX extends object = Async<any>> {
	/**
	 * Map of namespaces for async operations
	 */
	static namespaces: NamespacesDictionary = namespaces;

	/**
	 * @deprecated
	 * @see Async.namespaces
	 */
	static get linkNames(): NamespacesDictionary {
		return this.namespaces;
	}

	/**
	 * Lock status.
	 * If true, then all new task won't be registered.
	 */
	locked: boolean = false;

	/**
	 * Cache for async operations
	 */
	protected readonly cache: Dictionary<GlobalCache> = Object.createDict();

	/**
	 * Cache for initialized workers
	 */
	protected readonly workerCache: WeakMap<object, boolean> = new WeakMap();

	/**
	 * Context of applying for all async handlers
	 */
	protected readonly ctx: CTX;

	/**
	 * @deprecated
	 * @see Async.ctx
	 */
	protected readonly context: CTX;

	/**
	 * Link to Async.namespaces
	 */
	protected get namespaces(): NamespacesDictionary {
		return (<typeof Async>this.constructor).namespaces;
	}

	/**
	 * @deprecated
	 * @see Async.prototype.namespaces
	 */
	protected get linkNames(): NamespacesDictionary {
		deprecate({name: 'linkNames', type: 'accessor', renamedTo: 'namespaces'});
		return this.namespaces;
	}

	/**
	 * @param [ctx] - context of applying for all async handlers
	 */
	constructor(ctx?: CTX) {
		this.ctx = this.context = ctx || <any>this;
	}

	/**
	 * Clears all async tasks
	 * @param [opts] - additional options for the operation
	 */
	clearAll(opts?: ClearOptions): this {
		for (let o = this.namespaces, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `clear-${o[keys[i]]}`.camelize(false);

			if (Object.isFunction(this[alias])) {
				this[alias](opts);

			} else if (!isPromisifyNamespace.test(alias)) {
				throw new ReferenceError(`The method "${alias}" is not defined`);
			}
		}

		return this;
	}

	/**
	 * Mutes all async tasks
	 * @param [opts] - additional options for the operation
	 */
	muteAll(opts?: ClearOptions): this {
		for (let o = this.namespaces, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `mute-${o[keys[i]]}`.camelize(false);

			if (!isPromisifyNamespace.test(alias) && Object.isFunction(this[alias])) {
				this[alias](opts);
			}
		}

		return this;
	}

	/**
	 * Unmutes all async tasks
	 * @param [opts] - additional options for the operation
	 */
	unmuteAll(opts?: ClearOptions): this {
		for (let o = this.namespaces, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `unmute-${o[keys[i]]}`.camelize(false);

			if (!isPromisifyNamespace.test(alias) && Object.isFunction(this[alias])) {
				this[alias](opts);
			}
		}

		return this;
	}

	/**
	 * Suspends all async tasks
	 * @param [opts] - additional options for the operation
	 */
	suspendAll(opts?: ClearOptions): this {
		for (let o = this.namespaces, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `suspend-${o[keys[i]]}`.camelize(false);

			if (!isPromisifyNamespace.test(alias) && Object.isFunction(this[alias])) {
				this[alias](opts);
			}
		}

		return this;
	}

	/**
	 * Unsuspends all async tasks
	 * @param [opts] - additional options for the operation
	 */
	unsuspendAll(opts?: ClearOptions): this {
		for (let o = this.namespaces, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `unsuspend-${o[keys[i]]}`.camelize(false);

			if (!isPromisifyNamespace.test(alias) && Object.isFunction(this[alias])) {
				this[alias](opts);
			}
		}

		return this;
	}

	/**
	 * Returns a cache object by the specified name
	 *
	 * @param name
	 * @param [promise] - if true, the the namespace will be marked as promisified
	 */
	protected getCache(name: string, promise?: boolean): GlobalCache {
		name = promise
			? `${name}Promise` : name;

		return this.cache[name] = this.cache[name] || {
			root: {
				labels: Object.createDict(),
				links: new Map()
			},

			groups: Object.createDict()
		};
	}

	/**
	 * @deprecated
	 * @see Async.prototype.getCache
	 */
	@deprecated({renamedTo: 'getCache'})
	protected initCache(name: string, promise?: boolean): GlobalCache {
		return this.getCache(name, promise);
	}

	/**
	 * Registers the specified async task
	 * @param task
	 */
	protected registerTask<R = unknown, C extends object = CTX>(task: FullAsyncOptions<C>): R | null {
		if (this.locked) {
			return null;
		}

		const
			baseCache = this.getCache(task.name, task.promise),
			{ctx} = this;

		let
			cache;

		if (task.group) {
			baseCache.groups[task.group] = baseCache.groups[task.group] || {
				labels: Object.createDict(),
				links: new Map()
			};

			cache = baseCache.groups[task.group];

		} else {
			cache = baseCache.root;
		}

		const
			{labels, links} = cache,
			labelCache = task.label != null && labels[task.label];

		if (labelCache && task.join === true) {
			const
				mergeHandlers = (<AsyncCb<C>[]>[]).concat(task.onMerge || []),
				link = links.get(labelCache);

			for (let i = 0; i < mergeHandlers.length; i++) {
				mergeHandlers[i].call(ctx, link);
			}

			return labelCache;
		}

		let
			id,
			finalObj,
			wrappedObj = id = finalObj = task.needCall && Object.isFunction(task.obj) ? task.obj.call(ctx) : task.obj;

		if (!task.periodic || Object.isFunction(wrappedObj)) {
			wrappedObj = function (this: unknown): unknown {
				const
					args = arguments,
					link = links.get(id),
					fnCtx = ctx || this;

				if (!link || link.muted) {
					return;
				}

				if (!task.periodic) {
					if (link.paused) {
						link.muted = true;

					} else {
						links.delete(id);

						if (task.label != null && labels[task.label]) {
							labels[task.label] = undefined;
						}
					}
				}

				const execTasks = (i = 0) => (...args) => {
					const
						fns = link.onComplete;

					if (fns) {
						for (let j = 0; j < fns.length; j++) {
							const fn = fns[j];
							(fn[i] || fn).apply(fnCtx, args);
						}
					}
				};

				const
					needDelete = !task.periodic && link.paused;

				const exec = () => {
					if (needDelete) {
						links.delete(id);

						if (task.label != null) {
							labels[task.label] = undefined;
						}
					}

					let
						res = finalObj;

					if (Object.isFunction(finalObj)) {
						res = finalObj.apply(fnCtx, args);
					}

					if (Object.isPromise(res)) {
						res.then(execTasks(), execTasks(1));

					} else {
						execTasks().apply(null, args);
					}

					return res;
				};

				if (link.paused) {
					link.queue.push(exec);
					return;
				}

				return exec();
			};
		}

		if (task.wrapper) {
			const
				link = task.wrapper.apply(null, [wrappedObj].concat(task.needCall ? id : [], task.args));

			if (task.linkByWrapper) {
				id = link;
			}
		}

		const link = {
			id,
			obj: task.obj,
			objName: task.obj.name,
			label: task.label,
			paused: false,
			muted: false,
			queue: [],
			clearFn: task.clearFn,
			onComplete: [],
			onClear: (<AsyncCb<C>[]>[]).concat(task.onClear || [])
		};

		if (labelCache) {
			this.cancelTask({...task, replacedBy: link, reason: 'collision'});
		}

		links.set(id, link);

		if (task.label) {
			labels[task.label] = id;
		}

		return id;
	}

	/**
	 * @deprecated
	 * @see Async.prototype.registerTask
	 */
	@deprecated({renamedTo: 'registerTask'})
	protected setAsync<R = unknown, C extends object = CTX>(task: FullAsyncOptions<C>): R | null {
		return this.registerTask(task);
	}

	/**
	 * Cancels a task (or a group of tasks) from the specified namespace
	 *
	 * @param task - operation options or a task link
	 * @param [name] - namespace of the operation
	 */
	protected cancelTask(task: CanUndef<FullClearOptions | any>, name?: string): this {
		let
			p: FullClearOptions;

		if (name) {
			if (task === undefined) {
				return this.cancelAllTasks({name, reason: 'all'});
			}

			p = Object.isPlainObject(task) ? {...task, name} : {name, id: task};

		} else {
			p = task || {};
		}

		const
			baseCache = this.getCache(p.name, p.promise);

		let
			cache;

		if (p.group) {
			if (Object.isRegExp(p.group)) {
				const
					obj = baseCache.groups,
					keys = Object.keys(obj);

				for (let i = 0; i < keys.length; i++) {
					const
						group = keys[i];

					if (p.group.test(group)) {
						this.cancelTask({...p, group, reason: 'rgxp'});
					}
				}

				return this;
			}

			if (!baseCache.groups[p.group]) {
				return this;
			}

			cache = baseCache.groups[p.group];

			if (!p.reason) {
				p.reason = 'group';
			}

		} else {
			cache = baseCache.root;
		}

		const
			{labels, links} = cache;

		if (p.label) {
			const
				tmp = labels[p.label];

			if (p.id != null && p.id !== tmp) {
				return this;
			}

			p.id = tmp;

			if (!p.reason) {
				p.reason = 'label';
			}
		}

		if (!p.reason) {
			p.reason = 'id';
		}

		if (p.id != null) {
			const
				link = links.get(p.id);

			if (link) {
				links.delete(link.id);

				if (link.label) {
					labels[link.label] = undefined;
				}

				const ctx = {
					...p,
					link,
					type: 'clearAsync'
				};

				const
					clearHandlers = link.onClear,
					clearFn = link.clearFn;

				for (let i = 0; i < clearHandlers.length; i++) {
					clearHandlers[i].call(this.ctx, ctx);
				}

				if (clearFn && !p.preventDefault) {
					clearFn.call(null, link.id, ctx);
				}
			}

		} else {
			for (let o = links.values(), el = o.next(); !el.done; el = o.next()) {
				this.cancelTask({...p, id: el.value.id});
			}
		}

		return this;
	}

	/**
	 * @deprecated
	 * @see Async.prototype.cancelTask
	 */
	@deprecated({renamedTo: 'cancelTask'})
	protected clearAsync(opts: CanUndef<FullClearOptions | any>, name?: string): this {
		return this.cancelTask(opts, name);
	}

	/**
	 * Cancels all async tasks from the specified namespace
	 * @param opts - operation options
	 */
	protected cancelAllTasks(opts: FullClearOptions): this {
		this.cancelTask(opts);

		const
			obj = this.getCache(opts.name, opts.promise).groups,
			keys = Object.keys(obj);

		for (let i = 0; i < keys.length; i++) {
			const
				group = keys[i];

			if (!isZombieGroup.test(group)) {
				this.cancelTask({...opts, group});
			}
		}

		return this;
	}

	/**
	 * @deprecated
	 * @see Async.prototype.cancelAllTasks
	 */
	@deprecated({renamedTo: 'cancelAllTasks'})
	protected clearAllAsync(opts: CanUndef<ClearProxyOptions | any>): this {
		return this.cancelAllTasks(opts);
	}

	/**
	 * Marks a task (or a group of tasks) from the namespace by the specified label
	 *
	 * @param label
	 * @param task - operation options or a link to the task
	 * @param [name] - namespace of the operation
	 */
	protected markTask(label: string, task: CanUndef<ClearProxyOptions | any>, name?: string): this {
		let
			p: FullClearOptions;

		if (name) {
			if (task === undefined) {
				return this.markAllTasks(label, {name});
			}

			p = Object.isPlainObject(task) ? {...task, name} : {name, id: task};

		} else {
			p = task || {};
		}

		const
			baseCache = this.getCache(p.name);

		let
			cache;

		if (p.group) {
			if (Object.isRegExp(p.group)) {
				const
					obj = baseCache.groups,
					keys = Object.keys(obj);

				for (let i = 0; i < keys.length; i++) {
					const
						group = keys[i];

					if (p.group.test(group)) {
						this.markTask(label, {...p, group});
					}
				}

				return this;
			}

			if (!baseCache.groups[p.group]) {
				return this;
			}

			cache = baseCache.groups[p.group];

		} else {
			cache = baseCache.root;
		}

		const
			{labels, links} = cache;

		if (p.label) {
			const
				tmp = labels[p.label];

			if (p.id != null && p.id !== tmp) {
				return this;
			}

			p.id = tmp;
		}

		if (p.id != null) {
			const
				link = links.get(p.id);

			if (link) {
				if (label === '!paused') {
					for (let o = link.queue, i = 0; i < o.length; i++) {
						o[i]();
					}

					link.muted = false;
					link.paused = false;
					link.queue = [];

				} else if (label[0] === '!') {
					link[label.slice(1)] = false;

				} else {
					link[label] = true;
				}
			}

		} else {
			const
				values = links.values();

			for (let el = values.next(); !el.done; el = values.next()) {
				this.markTask(label, {...p, id: el.value.id});
			}
		}

		return this;
	}

	/**
	 * @deprecated
	 * @see Async.prototype.markTask
	 */
	@deprecated({renamedTo: 'markTask'})
	protected markAsync(label: string, opts: CanUndef<ClearProxyOptions | any>, name?: string): this {
		return this.markTask(label, opts, name);
	}

	/**
	 * Marks all async tasks from the namespace by the specified label
	 *
	 * @param label
	 * @param opts - operation options
	 */
	protected markAllTasks(label: string, opts: FullClearOptions): this {
		this.markTask(label, opts);

		const
			obj = this.getCache(opts.name).groups,
			keys = Object.keys(obj);

		for (let i = 0; i < keys.length; i++) {
			const
				group = keys[i];

			if (!isZombieGroup.test(group)) {
				this.markTask(label, {...opts, group});
			}
		}

		return this;
	}

	/**
	 * @deprecated
	 * @see Async.prototype.markAllTasks
	 */
	@deprecated({renamedTo: 'markAllTasks'})
	protected markAllAsync(label: string, opts: FullClearOptions): this {
		return this.markAllTasks(label, opts);
	}
}
