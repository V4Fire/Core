/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/promise/sync';

import Super from 'core/async/proxy/proxy';

import { PrimitiveNamespaces } from 'core/async/const';

import {

	isAsyncOptions,
	isPromisifyNamespace,

	ClearProxyOptions,
	ClearOptionsId,

	Marker,

	Task,
	TaskCtx

} from 'core/async/core';

import type { PromiseLikeP, CancelablePromise, AsyncRequestOptions, AsyncPromiseOptions } from 'core/async/interface';

export * from 'core/async/core';
export * from 'core/async/interface';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * Creates a new promise that wraps the passed promise and returns it.
	 *
	 * This method doesn't attach any hooks or listeners to the object.
	 * However, if the operation is canceled using one of Async's methods,
	 * such as cancelPromise, the promise will be rejected.
	 *
	 * The promise can be provided directly or as a function that returns a promise.
	 *
	 * @param promise
	 * @param [opts] - additional options for the operation
	 *
	 * @example
	 * ```js
	 * const
	 *   async = new Async();
	 *
	 * async.promise(new Promise(() => {
	 *   // ...
	 * }))
	 * ```
	 */
	promise<T = unknown>(promise: PromiseLikeP<T>, opts?: AsyncPromiseOptions): Promise<T> {
		if (!Object.isTruly(promise)) {
			return SyncPromise.resolve();
		}

		const
			that = this,
			{ctx} = this;

		const p = <AsyncPromiseOptions>({
			namespace: PrimitiveNamespaces.promise,
			...opts
		});

		let wrappedResolve: AnyFunction;

		const wrappedPromise = new SyncPromise(promiseConstructor);

		this.ids.set(wrappedPromise, wrappedResolve!);

		return wrappedPromise;

		function promiseConstructor(resolve: AnyFunction, reject: AnyFunction) {
			let canceled = false;

			let wrappedReject: CanNull<AnyFunction> = null;

			wrappedResolve = that.proxy(resolve, {
				...p,

				clear: () => {
					that.promiseDestructor(p.destructor, <Promise<unknown>>promise);

					if (wrappedReject != null) {
						that.clearProxy({id: wrappedReject, namespace: p.namespace});
					}
				},

				onClear: (...args) => {
					canceled = true;
					return that.onPromiseClear(resolve, reject)(...args);
				},

				onMerge: (...args) => {
					canceled = true;
					return that.onPromiseMerge(resolve, reject)(...args);
				},

				onMutedCall: (link) => {
					const handlers = Array.toArray(opts?.onMutedResolve);

					if (handlers.length > 0) {
						handlers.forEach((handler) => {
							handler.call(ctx, wrappedResolve, wrappedReject);
						});

					} else {
						reject({
							...p,
							link,
							reason: 'muting',
							type: 'clearAsync'
						});
					}
				}
			});

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (!canceled) {
				if (Object.isFunction(promise)) {
					promise = promise();
				}

				wrappedReject = that.proxy((err) => {
					if (canceled || p.namespace == null) {
						return;
					}

					const
						cache = that.cache[p.namespace],
						links = p.group != null ? cache.groups![p.group]?.links : cache.root.links;

					const
						task = links?.get(wrappedResolve),
						handlers = links?.get(wrappedResolve)?.onComplete;

					if (task != null && handlers != null) {
						if (task.muted) {
							return;
						}

						const execTask = () => {
							reject(err);

							handlers.forEach((handler) => {
								handler[1].call(ctx, err);
							});
						};

						if (task.paused) {
							task.queue.push(execTask);
							return;
						}

						execTask();

					} else {
						reject(err);
					}

				}, {namespace: p.namespace, group: p.group});

				promise.then(wrappedResolve, wrappedReject);
			}
		}
	}

	/**
	 * Cancels the specified promise.
	 * The canceled promise will be automatically rejected.
	 *
	 * @alias
	 * @param [id] - a reference to the promise to be canceled
	 *   (if not specified, the operation will be applied to all registered tasks)
	 */
	cancelPromise(id?: Promise<unknown>): this;

	/**
	 * Cancels the specified promise or a group of promises.
	 * The canceled promises will be automatically rejected.
	 *
	 * @alias
	 * @param opts - options for the operation
	 */
	cancelPromise(opts: ClearProxyOptions<Promise<unknown>>): this;
	cancelPromise(task?: Promise<unknown> | ClearProxyOptions<Promise<unknown>>): this {
		return this.clearPromise(Object.cast(task));
	}

	/**
	 * Cancels the specified promise.
	 * The canceled promise will be automatically rejected.
	 *
	 * @param [id] - a reference to the promise to be canceled
	 *   (if not specified, the operation will be applied to all registered tasks)
	 */
	clearPromise(id?: Promise<unknown>): this;

	/**
	 * Cancels the specified promise or a group of promises.
	 * The canceled promises will be automatically rejected.
	 *
	 * @param opts - options for the operation
	 */
	clearPromise(opts: ClearProxyOptions<Promise<unknown>>): this;
	clearPromise(task?: Promise<unknown> | ClearProxyOptions<Promise<unknown>>): this {
		const namespace = isAsyncOptions<ClearProxyOptions>(task) ? task.namespace : null;

		this.cancelTask(task, namespace ?? PrimitiveNamespaces.promise);

		if (namespace == null) {
			Object.values(this.Namespaces).forEach((namespace) => {
				if (Object.isNumber(namespace) && isPromisifyNamespace.test(namespace)) {
					this.cancelTask(task, namespace);
				}
			});
		}

		return this;
	}

	/**
	 * Mutes the specified promise.
	 * If the promise is resolved during it muted, the promise wrapper will be rejected.
	 *
	 * @param [id] - a reference to the promise to be muted
	 *   (if not specified, the operation will be applied to all registered tasks)
	 */
	mutePromise(id?: Promise<unknown>): this;

	/**
	 * Mutes the specified promise or a group of promises.
	 * If the promises are resolved during muted, the promise wrappers will be rejected.
	 *
	 * @param opts - options for the operation
	 */
	mutePromise(opts: ClearOptionsId<Promise<unknown>>): this;
	mutePromise(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markPromise('muted', Object.cast(task));
	}

	/**
	 * Unmutes the specified promise
	 *
	 * @param [id] - a reference to the promise to be unmuted
	 *   (if not specified, the operation will be applied to all registered tasks)
	 */
	unmutePromise(id?: Promise<unknown>): this;

	/**
	 * Unmutes the specified promise or a group of promises
	 * @param opts - options for the operation
	 */
	unmutePromise(opts: ClearOptionsId<Promise<unknown>>): this;
	unmutePromise(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markPromise('!muted', Object.cast(task));
	}

	/**
	 * Suspends the specified promise
	 *
	 * @param [id] - a reference to the promise to be suspended
	 *   (if not specified, the operation will be applied to all registered tasks)
	 */
	suspendPromise(id?: Promise<unknown>): this;

	/**
	 * Suspends the specified promise or a group of promises
	 * @param opts - options for the operation
	 */
	suspendPromise(opts: ClearOptionsId<Promise<unknown>>): this;
	suspendPromise(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markPromise('paused', Object.cast(task));
	}

	/**
	 * Unsuspends the specified promise
	 *
	 * @param [id] - a reference to the promise to be unsuspended
	 *   (if not specified, the operation will be applied to all registered tasks)
	 */
	unsuspendPromise(id?: Promise<unknown>): this;

	/**
	 * Unsuspends the specified promise or a group of promises
	 * @param opts - options for the operation
	 */
	unsuspendPromise(opts: ClearOptionsId<Promise<unknown>>): this;
	unsuspendPromise(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markPromise('!paused', Object.cast(task));
	}

	/**
	 * Creates a promise that wraps the passed request and returns it.
	 *
	 * This method doesn't attach any hooks or listeners to the object.
	 * However, if the operation is canceled using one of Async's methods, such as `cancelRequest`,
	 * the promise will be rejected.
	 *
	 * The request can be provided as a promise or as a function that returns a promise.
	 * Note that this method uses `Async.promise`, but with a different namespace: `request` instead of `promise`.
	 *
	 * @param request
	 * @param [opts] - additional options for the operation
	 *
	 * @example
	 * ```js
	 * const async = new Async();
	 * async.request(fetch('foo/bla'));
	 * ```
	 */
	request<T = unknown>(request: (() => PromiseLike<T>) | PromiseLike<T>, opts?: AsyncRequestOptions): Promise<T> {
		return this.promise(request, {...opts, namespace: PrimitiveNamespaces.request});
	}

	/**
	 * Cancels the specified request.
	 * The canceled promise will be automatically rejected.
	 *
	 * @alias
	 * @param [id] - a reference to the request to be canceled
	 *   (if not specified, the operation will be applied to all registered tasks)
	 */
	cancelRequest(id?: Promise<unknown>): this;

	/**
	 * Cancels the specified request or a group of requests.
	 * The canceled promises will be automatically rejected.
	 *
	 * @alias
	 * @param opts - options for the operation
	 */
	cancelRequest(opts: ClearOptionsId<Promise<unknown>>): this;
	cancelRequest(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.clearRequest(Object.cast(task));
	}

	/**
	 * Cancels the specified request.
	 * The canceled promise will be automatically rejected.
	 *
	 * @param [id] - a reference to the request to be canceled
	 *   (if not specified, the operation will be applied to all registered tasks)
	 */
	clearRequest(id?: Promise<unknown>): this;

	/**
	 * Cancels the specified request or a group of requests.
	 * The canceled promises will be automatically rejected.
	 *
	 * @param opts - options for the operation
	 */
	clearRequest(opts: ClearOptionsId<Promise<unknown>>): this;
	clearRequest(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.cancelTask(task, PrimitiveNamespaces.request);
	}

	/**
	 * Mutes the specified request.
	 * If the request is resolved during it muted, the promise wrapper will be rejected.
	 *
	 * @param [id] - a reference to the request to be muted
	 *   (if not specified, the operation will be applied to all registered tasks)
	 */
	muteRequest(id?: Promise<unknown>): this;

	/**
	 * Mutes the specified request or a group of requests.
	 * If the requests are resolved during muted, the promise wrappers will be rejected.
	 *
	 * @param opts - options for the operation
	 */
	muteRequest(opts: ClearOptionsId<Promise<unknown>>): this;
	muteRequest(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markTask('muted', task, PrimitiveNamespaces.request);
	}

	/**
	 * Unmutes the specified request
	 *
	 * @param [id] - a reference to the request to be unmuted
	 *   (if not specified, the operation will be applied to all registered tasks)
	 */
	unmuteRequest(id?: Promise<unknown>): this;

	/**
	 * Unmutes the specified request or a group of requests
	 * @param opts - options for the operation
	 */
	unmuteRequest(opts: ClearOptionsId<Promise<unknown>>): this;
	unmuteRequest(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markTask('!muted', task, PrimitiveNamespaces.request);
	}

	/**
	 * Suspends the specified request
	 *
	 * @param [id] - a reference to the request to be suspended
	 *   (if not specified, the operation will be applied to all registered tasks)
	 */
	suspendRequest(id?: Promise<unknown>): this;

	/**
	 * Suspends the specified request or a group of requests
	 * @param opts - options for the operation
	 */
	suspendRequest(opts: ClearOptionsId<Promise<unknown>>): this;
	suspendRequest(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markTask('paused', task, PrimitiveNamespaces.request);
	}

	/**
	 * Unsuspends the specified request
	 *
	 * @param [id] - a reference to the request to be unsuspended
	 *   (if not specified, the operation will be applied to all registered tasks)
	 */
	unsuspendRequest(id?: Promise<unknown>): this;

	/**
	 * Unsuspends the specified request or a group of requests
	 * @param opts - options for the operation
	 */
	unsuspendRequest(opts: ClearOptionsId<Promise<unknown>>): this;
	unsuspendRequest(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markTask('!paused', task, PrimitiveNamespaces.request);
	}

	/**
	 * Terminates the specified promise
	 *
	 * @param destructor - the name of the destructor method to be used for termination
	 * @param promise - the promise object to be terminated
	 */
	promiseDestructor(
		destructor: CanUndef<string>,
		promise: PromiseLike<unknown> | CancelablePromise
	): void {
		let fn: CanUndef<Function>;

		if (destructor != null) {
			fn = promise[destructor];

		} else {
			const p = <CancelablePromise>promise;
			fn = p.abort ?? p.cancel;
		}

		if (Object.isFunction(fn)) {
			// eslint-disable-next-line @typescript-eslint/unbound-method
			if ('catch' in promise && Object.isFunction(promise.catch)) {
				promise.catch(() => {
					// Promise error loopback
				});
			}

			fn.call(promise);
		}
	}

	/**
	 * A factory to create the promise clear handlers
	 *
	 * @param resolve
	 * @param reject
	 */
	onPromiseClear(resolve: AnyFunction, reject: AnyFunction): AnyFunction {
		const MAX_PROMISE_DEPTH = 25;

		return (task: TaskCtx) => {
			const {replacedBy} = task;

			if (replacedBy != null && task.join === 'replace' && task.link.onClear.length < MAX_PROMISE_DEPTH) {
				replacedBy.onComplete.push([resolve, reject]);

				Array.toArray(task.link.onClear, reject).forEach((onClear) => {
					replacedBy.onClear.push(onClear);
				});

			} else {
				reject(task);
			}
		};
	}

	/**
	 * A factory to create the promise merge handlers
	 *
	 * @param resolve
	 * @param reject
	 */
	onPromiseMerge(resolve: AnyFunction, reject: AnyFunction): Function {
		return (task: Task) => task.onComplete.push([resolve, reject]);
	}

	/**
	 * Marks a promise using the given marker
	 *
	 * @param marker
	 * @param [id] - operation id (if not specified, the operation will be extended for all promise namespaces)
	 */
	protected markPromise(marker: Marker, id?: Promise<unknown>): this;

	/**
	 * Marks a promise or a group of promises using the given marker
	 *
	 * @param label
	 * @param opts - additional options
	 */
	protected markPromise(label: Marker, opts: ClearOptionsId<Promise<unknown>>): this;
	protected markPromise(label: Marker, task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		const namespace = isAsyncOptions<ClearProxyOptions>(task) ? task.namespace : null;

		this.markTask(label, task, namespace ?? PrimitiveNamespaces.promise);

		if (namespace == null) {
			Object.values(this.Namespaces).forEach((namespace) => {
				if (Object.isNumber(namespace) && isPromisifyNamespace.test(namespace)) {
					this.markTask(label, task, namespace);
				}
			});
		}

		return this;
	}
}
