/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { deprecate, deprecated } from 'core/functools';

import {

	namespaces,
	isZombieGroup,
	isPromisifyNamespace,
	NamespacesDictionary

} from 'core/async/const';

import {

	FullAsyncOptions,
	ClearOptions,
	FullClearOptions,
	ClearProxyOptions,
	GlobalCache,
	TaskCtx

} from 'core/async/interface';

export * from 'core/async/const';
export * from 'core/async/helpers';
export * from 'core/async/interface';

export default class Async<CTX extends object = Async<any>> {
	/**
	 * Map of namespaces for async operations
	 */
	static namespaces: NamespacesDictionary = namespaces;

	/**
	 * @deprecated
	 * @see Async.namespaces
	 */
	static linkNames: NamespacesDictionary = namespaces;

	/**
	 * The lock status.
	 * If true, then all new tasks won't be registered.
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
	 * Context of applying for async handlers
	 */
	protected readonly ctx: CTX;

	/**
	 * @deprecated
	 * @see [[Async.ctx]]
	 */
	protected readonly context: CTX;

	/**
	 * Link to Async.namespaces
	 */
	protected get namespaces(): NamespacesDictionary {
		const
			constr = <typeof Async>this.constructor;

		if (constr.namespaces !== constr.linkNames) {
			return constr.linkNames;
		}

		return constr.namespaces;
	}

	/**
	 * @deprecated
	 * @see [[Async.namespaces]]
	 */
	protected get linkNames(): NamespacesDictionary {
		deprecate({name: 'linkNames', type: 'accessor', renamedTo: 'namespaces'});
		return this.namespaces;
	}

	/**
	 * @param [ctx] - context of applying for async handlers
	 */
	constructor(ctx?: CTX) {
		this.ctx = ctx ?? <any>this;
		this.context = this.ctx;
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
	 * @param [promise] - if true, the namespace is marked as promisified
	 */
	protected getCache(name: string, promise?: boolean): GlobalCache {
		name = promise ? `${name}Promise` : name;

		return this.cache[name] = this.cache[name] ?? {
			root: {
				labels: Object.createDict(),
				links: new Map()
			},

			groups: Object.createDict()
		};
	}

	/**
	 * @deprecated
	 * @see [[Async.getCache]]
	 */
	@deprecated({renamedTo: 'getCache'})
	protected initCache(name: string, promise?: boolean): GlobalCache {
		return this.getCache(name, promise);
	}

	/**
	 * Registers the specified async task
	 * @param task
	 */
	protected registerTask<R = unknown>(task: FullAsyncOptions<any>): R | null {
		if (this.locked) {
			return null;
		}

		const
			baseCache = this.getCache(task.name, task.promise),
			callable = Boolean(task.callable === true || task.needCall);

		const
			{ctx} = this;

		let
			cache;

		if (task.group != null) {
			baseCache.groups[task.group] = baseCache.groups[task.group] ?? {
				labels: Object.createDict(),
				links: new Map()
			};

			cache = baseCache.groups[task.group];

		} else {
			cache = baseCache.root;
		}

		const
			{labels, links} = cache,
			{links: baseLinks} = baseCache.root;

		const
			labelCache = task.label != null && labels[task.label];

		if (labelCache != null && task.join === true) {
			const
				mergeHandlers = Array.concat([], task.onMerge),
				link = links.get(labelCache);

			for (let i = 0; i < mergeHandlers.length; i++) {
				mergeHandlers[i].call(ctx, link);
			}

			return labelCache;
		}

		const normalizedObj = callable && Object.isFunction(task.obj) ?
			task.obj.call(ctx) :
			task.obj;

		let
			wrappedObj = normalizedObj,
			taskId = normalizedObj;

		if (!task.periodic || Object.isFunction(wrappedObj)) {
			wrappedObj = (...args) => {
				const
					link = links.get(taskId);

				if (link?.muted == null) {
					return;
				}

				if (!task.periodic) {
					if (link.paused === true) {
						link.muted = true;

					} else {
						link.unregister();
					}
				}

				const invokeHandlers = (i = 0) => (...args) => {
					const
						fns = link.onComplete;

					if (fns != null) {
						for (let j = 0; j < fns.length; j++) {
							const fn = fns[j];
							(Object.isFunction(fn[i]) ? fn[i] : fn).apply(ctx, args);
						}
					}
				};

				const
					needDelete = Boolean(!task.periodic && link.paused);

				const exec = () => {
					if (needDelete) {
						link.unregister();
					}

					let
						res = normalizedObj;

					if (Object.isFunction(normalizedObj)) {
						res = normalizedObj.apply(ctx, args);
					}

					if (Object.isPromise(res)) {
						res.then(invokeHandlers(), invokeHandlers(1));

					} else {
						invokeHandlers(...args);
					}

					return res;
				};

				if (link.paused === true) {
					link.queue.push(exec);
					return;
				}

				return exec();
			};
		}

		if (task.wrapper) {
			const
				link = task.wrapper(wrappedObj, ...Array.concat([], callable ? taskId : null, task.args));

			if (task.linkByWrapper) {
				taskId = link;
			}
		}

		const link = {
			id: taskId,

			obj: task.obj,
			objName: task.obj.name,

			group: task.group,
			label: task.label,

			paused: false,
			muted: false,
			queue: [],

			clearFn: task.clearFn,
			onComplete: [],
			onClear: Array.concat([], task.onClear),

			unregister: () => {
				links.delete(taskId);
				baseCache.root.links.delete(taskId);

				if (task.label != null && labels[task.label] != null) {
					labels[task.label] = undefined;
				}
			}
		};

		if (labelCache != null) {
			this.cancelTask({...task, replacedBy: link, reason: 'collision'});
		}

		links.set(taskId, link);

		if (links !== baseLinks) {
			baseLinks.set(taskId, link);
		}

		if (task.label != null) {
			labels[task.label] = taskId;
		}

		return taskId;
	}

	/**
	 * @deprecated
	 * @see [[Async.registerTask]]
	 */
	@deprecated({renamedTo: 'registerTask'})
	protected setAsync<R = unknown, C extends object = CTX>(task: FullAsyncOptions<C>): R | null {
		return this.registerTask(task);
	}

	/**
	 * Cancels a task (or a group of tasks) from the specified namespace
	 *
	 * @param task - operation options or task link
	 * @param [name] - namespace of the operation
	 */
	protected cancelTask(task: CanUndef<FullClearOptions | any>, name?: string): this {
		let
			p: FullClearOptions;

		if (name != null) {
			if (task === undefined) {
				return this.cancelTask({name, reason: 'all'});
			}

			p = Object.isPlainObject(task) ? {...task, name} : {name, id: task};

		} else {
			p = task ?? {};
		}

		const
			baseCache = this.getCache(p.name, p.promise);

		let
			cache: typeof baseCache.root;

		if (p.group != null) {
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

			const
				groupCache = baseCache.groups[p.group];

			if (groupCache == null) {
				return this;
			}

			cache = groupCache;

			if (p.reason == null) {
				p.reason = 'group';
			}

		} else {
			cache = baseCache.root;
		}

		const
			{labels, links} = cache;

		if (p.label != null) {
			const
				// @ts-ignore (symbol index)
				tmp = labels[p.label];

			if (p.id != null && p.id !== tmp) {
				return this;
			}

			p.id = tmp;

			if (p.reason == null) {
				p.reason = 'label';
			}
		}

		if (p.reason == null) {
			p.reason = 'id';
		}

		if (p.id != null) {
			const
				link = links.get(p.id);

			if (link != null) {
				const skipZombie =
					link.group != null &&
					p.reason === 'all' &&
					isZombieGroup.test(link.group);

				if (skipZombie) {
					return this;
				}

				link.unregister();

				const ctx = <TaskCtx>{
					...p,
					link,
					type: 'clearAsync'
				};

				const
					clearHandlers = link.onClear,
					{clearFn} = link;

				for (let i = 0; i < clearHandlers.length; i++) {
					clearHandlers[i].call(this.ctx, ctx);
				}

				if (clearFn != null && !p.preventDefault) {
					clearFn(link.id, ctx);
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
	 * @see [[Async.cancelTask]]
	 */
	@deprecated({renamedTo: 'cancelTask'})
	protected clearAsync(opts: CanUndef<FullClearOptions | any>, name?: string): this {
		return this.cancelTask(opts, name);
	}

	/**
	 * Marks a task (or a group of tasks) from the namespace with the specified label
	 *
	 * @param label
	 * @param task - operation options or link to the task
	 * @param [name] - namespace of the operation
	 */
	protected markTask(label: string, task: CanUndef<ClearProxyOptions | any>, name?: string): this {
		let
			p: FullClearOptions;

		if (name != null) {
			if (task === undefined) {
				return this.markTask(label, {name, reason: 'all'});
			}

			p = Object.isPlainObject(task) ? {...task, name} : {name, id: task};

		} else {
			p = task ?? {};
		}

		const
			baseCache = this.getCache(p.name);

		let
			cache: typeof baseCache.root;

		if (p.group != null) {
			if (Object.isRegExp(p.group)) {
				const
					obj = baseCache.groups,
					keys = Object.keys(obj);

				for (let i = 0; i < keys.length; i++) {
					const
						group = keys[i];

					if (p.group.test(group)) {
						this.markTask(label, {...p, group, reason: 'rgxp'});
					}
				}

				return this;
			}

			const
				groupCache = baseCache.groups[p.group];

			if (groupCache == null) {
				return this;
			}

			cache = groupCache;

		} else {
			cache = baseCache.root;
		}

		const
			{labels, links} = cache;

		if (p.label != null) {
			const
				// @ts-ignore (symbol index)
				tmp = labels[p.label];

			if (p.id != null && p.id !== tmp) {
				return this;
			}

			p.id = tmp;

			if (p.reason == null) {
				p.reason = 'label';
			}
		}

		if (p.reason == null) {
			p.reason = 'id';
		}

		if (p.id != null) {
			const
				link = links.get(p.id);

			if (link) {
				const skipZombie =
					link.group != null &&
					p.reason === 'all' &&
					isZombieGroup.test(link.group);

				if (skipZombie) {
					return this;
				}

				if (label === '!paused') {
					for (let o = link.queue, i = 0; i < o.length; i++) {
						o[i]();
					}

					link.muted = false;
					link.paused = false;
					link.queue = [];

				} else if (label.startsWith('!')) {
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
	 * @see [[Async.markTask]]
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
		return this;
	}
}
