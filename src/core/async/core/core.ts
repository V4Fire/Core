/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Task from 'core/async/core/task';

import { usedNamespaces, namespacesCache, Namespaces } from 'core/async/const';
import { isZombieGroup } from 'core/async/core/const';

import type {

	FullAsyncOptions,
	FullClearOptions,
	ClearProxyOptions,

	Marker,
	TaskCtx,

	GlobalCache,
	LocalCache

} from 'core/async/interface';

export default class Async<CTX extends object = Async<any>> {
	/**
	 * The lock status.
	 * If set to true, all new tasks won't be registered.
	 */
	locked: boolean = false;

	/**
	 * The enum containing all namespaces supported by Async
	 */
	readonly Namespaces: typeof Namespaces = Namespaces;

	/**
	 * Cache for asynchronous operations
	 */
	protected readonly cache: GlobalCache[] = namespacesCache.slice();

	/**
	 * Cache for initialized workers
	 */
	protected readonly workerCache: WeakMap<object, boolean> = new WeakMap();

	/**
	 * Task identifiers
	 */
	protected readonly ids: WeakMap<object, object> = new WeakMap();

	/**
	 * The context of applying for asynchronous handlers
	 */
	protected readonly ctx: CTX;

	/**
	 * Used asynchronous namespaces
	 */
	protected readonly usedNamespaces: boolean[] = usedNamespaces.slice();

	/**
	 * @param [ctx] - the context of applying for asynchronous handlers
	 */
	constructor(ctx?: CTX) {
		this.ctx = ctx ?? Object.cast(this);
	}

	/**
	 * Returns a cache object by the specified name
	 *
	 * @param task
	 */
	protected getCache(
		task: Pick<FullAsyncOptions<any>, 'namespace' | 'promise' | 'label'> & {group?: string | RegExp}
	): GlobalCache {
		const pos = task.promise ?? task.namespace;

		const cache = this.cache[pos] ?? {
			root: {
				labels: null,
				links: new Map()
			},

			groups: null
		};

		if (task.group != null && cache.groups == null) {
			cache.groups = Object.createDict();
		}

		if (task.label != null && cache.root.labels == null) {
			cache.root.labels = Object.createDict();
		}

		this.cache[pos] = cache;

		return cache;
	}

	/**
	 * Registers an asynchronous task with the specified parameters
	 * @param params
	 */
	protected registerTask<R = unknown>(params: FullAsyncOptions<any>): R | null {
		if (this.locked) {
			return null;
		}

		this.usedNamespaces[params.promise != null ? this.Namespaces.promise : params.namespace] = true;

		const commonCache = this.getCache(params);

		const {label, group} = params;

		let cache: LocalCache;

		if (group != null && commonCache.groups != null) {
			cache = commonCache.groups[group] ?? {
				labels: null,
				links: new Map()
			};

			if (label != null && cache.labels == null) {
				cache.labels = Object.createDict();
			}

			commonCache.groups[group] = cache;

		} else {
			cache = commonCache.root;
		}

		const
			{ctx} = this,
			{labels, links} = cache,
			{links: commonLinks} = commonCache.root;

		const labelCache = label != null && labels != null ? labels[label] : null;

		if (labelCache != null && params.join === true) {
			const link = links.get(labelCache);

			Array.toArray(params.onMerge).forEach((handler) => {
				handler.call(ctx, link);
			});

			return labelCache;
		}

		const normalizedTask = params.callable && Object.isFunction(params.task) ?
			params.task.call(ctx) :
			params.task;

		let
			taskId = normalizedTask,
			wrappedTask = normalizedTask,
			task: CanNull<Task> = null;

		if (!params.periodic || Object.isFunction(wrappedTask)) {
			wrappedTask = (...args: unknown[]) => {
				if (task == null) {
					return;
				}

				if (task.muted) {
					Array.toArray(params.onMutedCall).forEach((handler) => {
						handler.call(ctx, task);
					});
				}

				if (task.muted) {
					return;
				}

				if (!params.periodic) {
					if (task.paused) {
						task.muted = true;

					} else {
						task.unregister();
					}
				}

				const needUnregister = !params.periodic && task.paused;

				if (task.paused) {
					task.queue.push(execTask);
					return;
				}

				return execTask();

				function execTask() {
					if (task == null) {
						return;
					}

					if (needUnregister) {
						task.unregister();
					}

					let taskRes = normalizedTask;

					if (Object.isFunction(normalizedTask)) {
						switch (args.length) {
							case 0:
								taskRes = normalizedTask.call(ctx);
								break;

							case 1:
								taskRes = normalizedTask.call(ctx, args[0]);
								break;

							case 2:
								taskRes = normalizedTask.call(ctx, args[0], args[1]);
								break;

							case 3:
								taskRes = normalizedTask.call(ctx, args[0], args[1], args[2]);
								break;

							default:
								taskRes = normalizedTask.apply(ctx, args);
						}
					}

					if (Object.isPromiseLike(taskRes)) {
						taskRes.then(invokeHandlers(), invokeHandlers(1));

					} else {
						const handler = invokeHandlers();

						switch (args.length) {
							case 0:
								handler();
								break;

							case 1:
								handler(args[0]);
								break;

							case 2:
								handler(args[0], args[1]);
								break;

							case 3:
								handler(args[0], args[1], args[2]);
								break;

							default:
								taskRes = handler(...args);
						}
					}

					return taskRes;
				}

				function invokeHandlers(i: number = 0) {
					return (...args: unknown[]) => {
						if (task == null) {
							return;
						}

						const handlers = task.onComplete;

						if (Object.isArray(handlers)) {
							handlers.forEach((handler) => {
								const resolvedHandler = Object.isFunction(handler) ? handler : handler[i];

								switch (args.length) {
									case 0:
										resolvedHandler.call(ctx);
										break;

									case 1:
										resolvedHandler.call(ctx, args[0]);
										break;

									case 2:
										resolvedHandler.call(ctx, args[0], args[1]);
										break;

									default:
										resolvedHandler.apply(ctx, args);
								}
							});
						}
					};
				}
			};
		}

		if (params.wrapper) {
			const args = Array.toArray(wrappedTask, params.callable ? taskId : null, params.args);

			let taskRes: unknown;

			switch (args.length) {
				case 1:
					taskRes = params.wrapper(args[0]);
					break;

				case 2:
					taskRes = params.wrapper(args[0], args[1]);
					break;

				case 3:
					taskRes = params.wrapper(args[0], args[1], args[2]);
					break;

				default:
					taskRes = params.wrapper(...args);
			}

			if (params.linkByWrapper) {
				taskId = taskRes;
			}
		}

		task = new Task(taskId, params, cache, commonCache);

		if (labelCache != null) {
			this.cancelTask({...params, replacedBy: task, reason: 'collision'});
		}

		links.set(taskId, task);

		if (links !== commonLinks) {
			commonLinks.set(taskId, task);
		}

		if (label != null && labels != null) {
			labels[label] = taskId;
		}

		return taskId;
	}

	/**
	 * Cancels an asynchronous task (or a group of tasks) from the specified namespace
	 *
	 * @param task - the operation options or a reference to the task to be canceled
	 * @param [namespace] - the namespace from which the task or tasks should be canceled
	 */
	protected cancelTask(task: CanUndef<FullClearOptions | any>, namespace?: Namespaces): this {
		task = task != null ? this.ids.get(task) ?? task : task;

		let p: FullClearOptions;

		if (namespace != null) {
			if (task === undefined) {
				return this.cancelTask({namespace, reason: 'all'});
			}

			p = Object.isDictionary(task) ? {...task, namespace} : {namespace, id: task};

		} else {
			p = task ?? {};
		}

		const commonCache = this.getCache(p);

		const {group, label} = p;

		let cache: LocalCache;

		if (group != null && commonCache.groups != null) {
			if (Object.isRegExp(group)) {
				Object.keys(commonCache.groups).forEach((groupName) => {
					if (group.test(groupName)) {
						this.cancelTask({...p, group: groupName, reason: 'rgxp'});
					}
				});

				return this;
			}

			const localCache = commonCache.groups[group];

			if (localCache == null) {
				return this;
			}

			cache = localCache;

			if (p.reason == null) {
				p.reason = 'group';
			}

		} else {
			cache = commonCache.root;
		}

		const {labels, links} = cache;

		if (label != null && labels != null) {
			const id = labels[label];

			if (p.id != null && p.id !== id) {
				return this;
			}

			p.id = id;

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

				if (link.clearFn != null && !p.preventDefault) {
					link.clearFn(link.id, ctx);
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
	 * Marks an asynchronous task (or a group of tasks) within the specified namespace using the given marker
	 *
	 * @param marker
	 * @param task - the operation options or a reference to the task to be marked
	 * @param [namespace] - the namespace from which the task or tasks should be marked
	 */
	protected markTask(
		marker: Marker,
		task: CanUndef<ClearProxyOptions | any>,
		namespace?: Namespaces
	): this {
		task = task != null ? this.ids.get(task) ?? task : task;

		let p: FullClearOptions;

		if (namespace != null) {
			if (task === undefined) {
				return this.markTask(marker, {namespace, reason: 'all'});
			}

			p = Object.isDictionary(task) ? {...task, namespace} : {namespace, id: task};

		} else {
			p = task ?? {};
		}

		const commonCache = this.getCache(p);

		const {group, label} = p;

		let cache: LocalCache;

		if (group != null && commonCache.groups != null) {
			if (Object.isRegExp(group)) {
				Object.keys(commonCache.groups).forEach((groupName) => {
					if (group.test(groupName)) {
						this.markTask(marker, {...p, group: groupName, reason: 'rgxp'});
					}
				});

				return this;
			}

			const localCache = commonCache.groups[group];

			if (localCache == null) {
				return this;
			}

			cache = localCache;

		} else {
			cache = commonCache.root;
		}

		const {labels, links} = cache;

		if (label != null && labels != null) {
			const id = labels[label];

			if (p.id != null && p.id !== id) {
				return this;
			}

			p.id = id;

			if (p.reason == null) {
				p.reason = 'label';
			}
		}

		if (p.reason == null) {
			p.reason = 'id';
		}

		if (p.id != null) {
			const link = links.get(p.id);

			if (link) {
				const skipZombie =
					link.group != null &&
					p.reason === 'all' &&
					isZombieGroup.test(link.group);

				if (skipZombie) {
					return this;
				}

				if (marker === '!paused') {
					link.queue.forEach((fn) => fn());

					link.muted = false;
					link.paused = false;
					link.queue = [];

				} else if (marker.startsWith('!')) {
					link[marker.slice(1)] = false;

				} else {
					link[marker] = true;
				}
			}

		} else {
			links.forEach((link) => {
				this.markTask(marker, {...p, id: link.id});
			});
		}

		return this;
	}

	/**
	 * Marks all asynchronous tasks within the specified namespace using the given marker
	 *
	 * @param marker
	 * @param opts - the operation options
	 */
	protected markAllTasks(marker: Marker, opts: FullClearOptions): this {
		this.markTask(marker, opts);
		return this;
	}
}
