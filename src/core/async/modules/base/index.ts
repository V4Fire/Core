/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/async/modules/base/README.md]]
 * @packageDocumentation
 */

import { deprecate, deprecated } from 'core/functools';

import { namespaces, NamespacesDictionary } from 'core/async/const';
import { isZombieGroup, isPromisifyNamespace } from 'core/async/modules/base/const';

import type {

	ClearOptions,
	ClearProxyOptions,

	LocalCache,
	GlobalCache,

	TaskCtx,

	FullAsyncOptions,
	FullClearOptions

} from 'core/async/interface';

export * from 'core/async/modules/base/const';
export * from 'core/async/modules/base/helpers';

export * from 'core/async/interface';

export default class Async<CTX extends object = Async<any>> {
	/**
	 * Map of namespaces for asynchronous operations
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
	 * Cache for asynchronous operations
	 */
	protected readonly cache: Dictionary<GlobalCache> = Object.createDict();

	/**
	 * Cache for initialized workers
	 */
	protected readonly workerCache: WeakMap<object, boolean> = new WeakMap();

	/**
	 * Map for task identifiers
	 */
	protected readonly idsMap: WeakMap<object, object> = new WeakMap();

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
	protected readonly usedNamespaces: Set<string> = new Set();

	/**
	 * Link to `Async.namespaces`
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
		this.ctx = ctx ?? Object.cast(this);
		this.context = this.ctx;
	}

	/**
	 * Clears all asynchronous tasks
	 * @param [opts] - additional options for the operation
	 */
	clearAll(opts?: ClearOptions): this {
		this.usedNamespaces.forEach((key) => {
			const
				alias = `clear-${this.namespaces[key]}`.camelize(false);

			if (Object.isFunction(this[alias])) {
				this[alias](opts);

			} else if (!isPromisifyNamespace.test(key)) {
				throw new ReferenceError(`The method "${alias}" is not defined`);
			}
		});

		return this;
	}

	/**
	 * Mutes all asynchronous tasks
	 * @param [opts] - additional options for the operation
	 */
	muteAll(opts?: ClearOptions): this {
		this.usedNamespaces.forEach((key) => {
			const
				alias = `mute-${this.namespaces[key]}`.camelize(false);

			if (!isPromisifyNamespace.test(key) && Object.isFunction(this[alias])) {
				this[alias](opts);
			}
		});

		return this;
	}

	/**
	 * Unmutes all asynchronous tasks
	 * @param [opts] - additional options for the operation
	 */
	unmuteAll(opts?: ClearOptions): this {
		this.usedNamespaces.forEach((key) => {
			const
				alias = `unmute-${this.namespaces[key]}`.camelize(false);

			if (!isPromisifyNamespace.test(key) && Object.isFunction(this[alias])) {
				this[alias](opts);
			}
		});

		return this;
	}

	/**
	 * Suspends all asynchronous tasks
	 * @param [opts] - additional options for the operation
	 */
	suspendAll(opts?: ClearOptions): this {
		this.usedNamespaces.forEach((key) => {
			const
				alias = `suspend-${this.namespaces[key]}`.camelize(false);

			if (!isPromisifyNamespace.test(key) && Object.isFunction(this[alias])) {
				this[alias](opts);
			}
		});

		return this;
	}

	/**
	 * Unsuspends all asynchronous tasks
	 * @param [opts] - additional options for the operation
	 */
	unsuspendAll(opts?: ClearOptions): this {
		this.usedNamespaces.forEach((key) => {
			const
				alias = `unsuspend-${this.namespaces[key]}`.camelize(false);

			if (!isPromisifyNamespace.test(key) && Object.isFunction(this[alias])) {
				this[alias](opts);
			}
		});

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
	 * Registers the specified asynchronous task
	 * @param task
	 */
	protected registerTask<R = unknown>(task: FullAsyncOptions<any>): R | null {
		if (this.locked) {
			return null;
		}

		this.usedNamespaces.add(task.promise ? 'promise' : task.name);

		const {ctx} = this;

		const
			baseCache = this.getCache(task.name, task.promise),
			callable = task.callable ?? task.needCall;

		let cache: LocalCache;

		if (task.group != null) {
			cache = baseCache.groups[task.group] ?? {
				labels: Object.createDict(),
				links: new Map()
			};

			baseCache.groups[task.group] = cache;

		} else {
			cache = baseCache.root;
		}

		const
			{label} = task,
			{labels, links} = cache,
			{links: baseLinks} = baseCache.root;

		const labelCache = label != null ? labels[label] : null;

		if (labelCache != null && task.join === true) {
			const link = links.get(labelCache);

			Array.toArray(task.onMerge).forEach((handler) => {
				handler.call(ctx, link);
			});

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
				const link = links.get(taskId);

				if (link?.muted === true) {
					Array.toArray(task.onMutedCall).forEach((handler) => {
						handler.call(ctx, link);
					});
				}

				if (!link || link.muted) {
					return;
				}

				if (!task.periodic) {
					if (link.paused) {
						link.muted = true;

					} else {
						link.unregister();
					}
				}

				const invokeHandlers = (i = 0) => (...args) => {
					const
						fns = link.onComplete;

					if (Object.isArray(fns)) {
						fns.forEach((fn) => {
							if (Object.isFunction(fn)) {
								fn.apply(ctx, args);

							} else {
								fn[i].apply(ctx, args);
							}
						});
					}
				};

				const
					needDelete = !task.periodic && link.paused;

				const exec = () => {
					if (needDelete) {
						link.unregister();
					}

					let
						res = normalizedObj;

					if (Object.isFunction(normalizedObj)) {
						res = normalizedObj.apply(ctx, args);
					}

					if (Object.isPromiseLike(res)) {
						res.then(invokeHandlers(), invokeHandlers(1));

					} else {
						invokeHandlers()(...args);
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
			const link = task.wrapper.apply(null, Array.toArray(wrappedObj, callable ? taskId : null, task.args));

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
			onClear: Array.toArray(task.onClear),

			unregister: () => {
				links.delete(taskId);
				baseCache.root.links.delete(taskId);

				if (label != null && labels[label] != null) {
					labels[label] = undefined;
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

		if (label != null) {
			labels[label] = taskId;
		}

		return taskId;
	}

	/**
	 * @deprecated
	 * @see [[Async.registerTask]]
	 */
	@deprecated({renamedTo: 'registerTask'})
	protected setAsync<R = unknown>(task: FullAsyncOptions): R | null {
		return this.registerTask(task);
	}

	/**
	 * Cancels a task (or a group of tasks) from the specified namespace
	 *
	 * @param task - operation options or task link
	 * @param [name] - namespace of the operation
	 */
	protected cancelTask(task: CanUndef<FullClearOptions | any>, name?: string): this {
		task = task != null ? this.idsMap.get(task) ?? task : task;

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

		const baseCache = this.getCache(p.name, p.promise);

		let cache: LocalCache;

		if (p.group != null) {
			if (Object.isRegExp(p.group)) {
				Object.keys(baseCache.groups).forEach((group) => {
					if ((<RegExp>p.group).test(group)) {
						this.cancelTask({...p, group, reason: 'rgxp'});
					}
				});

				return this;
			}

			const
				group = baseCache.groups[p.group];

			if (group == null) {
				return this;
			}

			cache = group;

			if (p.reason == null) {
				p.reason = 'group';
			}

		} else {
			cache = baseCache.root;
		}

		const {labels, links} = cache;

		if (p.label != null) {
			const tmp = labels[p.label];

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
			const link = links.get(p.id);

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

				link.onClear.forEach((handler) => {
					handler.call(this.ctx, ctx);
				});

				const {clearFn} = link;

				if (clearFn != null && !p.preventDefault) {
					clearFn(link.id, ctx);
				}
			}

		} else {
			links.forEach((link) => {
				this.cancelTask({...p, id: link.id});
			});
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
	 * Marks a task (or a group of tasks) from the namespace by the specified label
	 *
	 * @param label
	 * @param task - operation options or a link to the task
	 * @param [name] - namespace of the operation
	 */
	protected markTask(label: string, task: CanUndef<ClearProxyOptions | any>, name?: string): this {
		task = task != null ? this.idsMap.get(task) ?? task : task;

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
			cache: LocalCache;

		if (p.group != null) {
			if (Object.isRegExp(p.group)) {
				Object.keys(baseCache.groups).forEach((group) => {
					if ((<RegExp>p.group).test(group)) {
						this.markTask(label, {...p, group, reason: 'rgxp'});
					}
				});

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
					link.queue.forEach((fn) => fn());

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
			links.forEach((link) => {
				this.markTask(label, {...p, id: link.id});
			});
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
	 * Marks all asynchronous tasks from the namespace by the specified label
	 *
	 * @param label
	 * @param opts - operation options
	 */
	protected markAllTasks(label: string, opts: FullClearOptions): this {
		this.markTask(label, opts);
		return this;
	}
}
