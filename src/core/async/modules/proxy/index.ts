/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/async/modules/proxy/README.md]]
 * @packageDeclaration
 */

import SyncPromise from 'core/promise/sync';

import Super, {

	asyncCounter,

	isAsyncOptions,
	isPromisifyNamespace,

	BoundFn,

	AsyncCbOptions,
	AsyncProxyOptions,

	ClearProxyOptions,
	ClearOptionsId

} from 'core/async/modules/base';

import type {

	WorkerLikeP,
	PromiseLikeP,
	CancelablePromise,

	AsyncRequestOptions,
	AsyncWorkerOptions,
	AsyncPromiseOptions

} from 'core/async/interface';

export * from 'core/async/modules/base';
export * from 'core/async/interface';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * Wraps the specified worker object.
	 *
	 * This method doesn't attach any hook or listeners to the object,
	 * but every time the same object is registered, Async will increment the number of links that relate to this object.
	 * After, when we try to destroy the worker by using one of Async's methods, like, `terminateWorker`,
	 * it will de-increment values of links. When the number of links is equal to zero,
	 * Async will try to call a "real" object destructor by using one of the possible destructor methods from
	 * the whitelist or by the specified destructor name, also if the worker is a function,
	 * it is interpreted as the destructor.
	 *
	 * @param worker
	 * @param [opts] - additional options for the operation
	 *
	 * @example
	 * ```js
	 * const
	 *   async = new Async(),
	 *   el = document.createElement('div');
	 *
	 * $el.appendChild(el);
	 *
	 * // This function will work as the worker destructor
	 * async.worker(() => el.remove());
	 *
	 * const
	 *   myWorker = new Worker('my-worker.js');
	 *
	 * async.worker(myWorker);
	 *
	 * async.clearAll();
	 * ```
	 */
	worker<T extends WorkerLikeP>(worker: T, opts?: AsyncWorkerOptions<CTX>): T {
		const
			{workerCache} = this;

		if (!workerCache.has(worker)) {
			workerCache.set(worker, true);
			worker[asyncCounter] = Number(worker[asyncCounter] ?? 0) + 1;
		}

		const
			clearFn = this.workerDestructor.bind(this, opts?.destructor);

		return this.registerTask({
			...opts,

			name: this.namespaces.worker,
			obj: worker,

			clearFn,
			periodic: opts?.single === false,

			onMerge(...args: unknown[]): void {
				const
					handlers = Array.concat([], opts?.onMerge);

				for (let i = 0; i < handlers.length; i++) {
					handlers[i].apply(this, args);
				}

				clearFn(worker);
			}
		}) ?? worker;
	}

	/**
	 * Terminates the specified worker
	 *
	 * @alias
	 * @param [id] - link to the worker (if not specified, then the operation will be applied for all registered tasks)
	 */
	terminateWorker(id?: WorkerLikeP): this;

	/**
	 * Terminates the specified worker or a group of workers
	 * @param opts - options for the operation
	 */
	terminateWorker(opts: ClearProxyOptions<WorkerLikeP>): this;
	terminateWorker(task?: WorkerLikeP | ClearProxyOptions<WorkerLikeP>): this {
		return this.clearWorker(<any>task);
	}

	/**
	 * Terminates the specified worker
	 * @param [id] - link to the worker (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearWorker(id?: WorkerLikeP): this;

	/**
	 * Terminates the specified worker or a group of workers
	 * @param opts - options for the operation
	 */
	clearWorker(opts: ClearProxyOptions<WorkerLikeP>): this;
	clearWorker(task?: WorkerLikeP | ClearProxyOptions<WorkerLikeP>): this {
		return this.cancelTask(task, isAsyncOptions<ClearProxyOptions>(task) && task.name || this.namespaces.worker);
	}

	/**
	 * Wraps the specified function.
	 * This method doesn't attach any hook or listeners to the object,
	 * but if we cancel the operation by using one of Async's methods, like, `cancelProxy`,
	 * the target function won't be invoked.
	 *
	 * @param fn
	 * @param [opts] - additional options for the operation
	 *
	 * @example
	 * ```js
	 * const
	 *   async = new Async();
	 *
	 * myImage.onload = async.proxy(() => {
	 *   // ...
	 * });
	 * ```
	 */
	proxy<F extends BoundFn<C>, C extends object = CTX>(fn: F, opts?: AsyncProxyOptions<C>): F {
		return this.registerTask<F>({
			...opts,
			name: opts?.name ?? this.namespaces.proxy,
			obj: fn,
			wrapper: (fn) => fn,
			linkByWrapper: true,
			periodic: opts?.single === false
		}) ?? <any>(() => undefined);
	}

	/**
	 * Returns a new function that allows invoking the passed function only with the specified delay.
	 * The next invocation of the function will cancel the previous.
	 *
	 * @param fn
	 * @param delay
	 * @param [opts] - additional options for the operation
	 */
	debounce<F extends BoundFn<C>, C extends object = CTX>(
		fn: F,
		delay: number,
		opts?: AsyncCbOptions<C>
	): AnyFunction<Parameters<F>, void> {
		return this.proxy(fn, {...opts, single: false}).debounce(delay);
	}

	/**
	 * Returns a new function that allows invoking the passed function not more often than the specified delay
	 *
	 * @param fn
	 * @param delay
	 * @param [opts] - additional options for the operation
	 */
	throttle<F extends BoundFn<C>, C extends object = CTX>(
		fn: F,
		delay: number,
		opts?: AsyncCbOptions<C>
	): AnyFunction<Parameters<F>, void> {
		return this.proxy(fn, {...opts, single: false}).throttle(delay);
	}

	/**
	 * Cancels the specified proxy function
	 *
	 * @alias
	 * @param [id] - link to the function (if not specified, then the operation will be applied for all registered tasks)
	 */
	cancelProxy(id?: Function): this;

	/**
	 * Cancels the specified proxy function or a group of functions
	 * @param opts - options for the operation
	 */
	cancelProxy(opts: ClearProxyOptions<Function>): this;
	cancelProxy(task?: Function | ClearProxyOptions<Function>): this {
		return this.clearProxy(<any>task);
	}

	/**
	 * Cancels the specified proxy function
	 * @param [id] - link to the function (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearProxy(id?: Function): this;

	/**
	 * Cancels the specified proxy function or a group of functions
	 * @param opts - options for the operation
	 */
	clearProxy(opts: ClearProxyOptions<Function>): this;
	clearProxy(task?: Function | ClearProxyOptions<Function>): this {
		return this.cancelTask(task, isAsyncOptions<ClearProxyOptions>(task) && task.name || this.namespaces.proxy);
	}

	/**
	 * Mutes the specified proxy function
	 * @param [id] - link to the function (if not specified, then the operation will be applied for all registered tasks)
	 */
	muteProxy(id?: Function): this;

	/**
	 * Mutes the specified proxy function or a group of functions
	 * @param opts - options for the operation
	 */
	muteProxy(opts: ClearProxyOptions<Function>): this;
	muteProxy(task?: Function | ClearProxyOptions<Function>): this {
		return this.markTask(
			'muted',
			task,
			isAsyncOptions<ClearProxyOptions>(task) && task.name || this.namespaces.proxy
		);
	}

	/**
	 * Unmutes the specified proxy function
	 * @param [id] - link to the function (if not specified, then the operation will be applied for all registered tasks)
	 */
	unmuteProxy(id?: Function): this;

	/**
	 * Unmutes the specified proxy function or a group of functions
	 * @param opts - options for the operation
	 */
	unmuteProxy(opts: ClearProxyOptions<Function>): this;
	unmuteProxy(task?: Function | ClearProxyOptions<Function>): this {
		return this.markTask(
			'!muted',
			task,
			isAsyncOptions<ClearProxyOptions>(task) && task.name || this.namespaces.proxy
		);
	}

	/**
	 * Suspends the specified proxy function
	 * @param [id] - link to the function (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendProxy(id?: Function): this;

	/**
	 * Suspends the specified proxy function or a group of functions
	 * @param opts - options for the operation
	 */
	suspendProxy(opts: ClearProxyOptions<Function>): this;
	suspendProxy(task?: Function | ClearProxyOptions<Function>): this {
		return this.markTask(
			'paused',
			task,
			isAsyncOptions<ClearProxyOptions>(task) && task.name || this.namespaces.proxy
		);
	}

	/**
	 * Unsuspends the specified proxy function
	 * @param [id] - link to the function (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendProxy(id?: Function): this;

	/**
	 * Unsuspends the specified proxy function or a group of functions
	 * @param opts - options for the operation
	 */
	unsuspendProxy(opts: ClearProxyOptions<Function>): this;
	unsuspendProxy(task?: Function | ClearProxyOptions<Function>): this {
		return this.markTask(
			'!paused',
			task,
			isAsyncOptions<ClearProxyOptions>(task) && task.name || this.namespaces.proxy
		);
	}

	/**
	 * Wraps the specified external request.
	 *
	 * This method doesn't attach any hook or listeners to the object,
	 * but if we cancel the operation by using one of Async's methods, like, "cancelRequest",
	 * the promise will be rejected.
	 *
	 * The request can be provided as a promise or function, that returns a promise.
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
		return this.promise(request, {...opts, name: this.namespaces.request});
	}

	/**
	 * Cancels the specified request
	 *
	 * @alias
	 * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
	 */
	cancelRequest(id?: Promise<unknown>): this;

	/**
	 * Cancels the specified request or a group of requests
	 * @param opts - options for the operation
	 */
	cancelRequest(opts: ClearOptionsId<Promise<unknown>>): this;
	cancelRequest(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.clearRequest(<any>task);
	}

	/**
	 * Cancels the specified request
	 * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearRequest(id?: Promise<unknown>): this;

	/**
	 * Cancels the specified request or a group of requests
	 * @param opts - options for the operation
	 */
	clearRequest(opts: ClearOptionsId<Promise<unknown>>): this;
	clearRequest(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.cancelTask(task, this.namespaces.request);
	}

	/**
	 * Mutes the specified request
	 * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
	 */
	muteRequest(id?: Promise<unknown>): this;

	/**
	 * Mutes the specified request or a group of requests
	 * @param opts - options for the operation
	 */
	muteRequest(opts: ClearOptionsId<Promise<unknown>>): this;
	muteRequest(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markTask('muted', task, this.namespaces.request);
	}

	/**
	 * Unmutes the specified request
	 * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
	 */
	unmuteRequest(id?: Promise<unknown>): this;

	/**
	 * Unmutes the specified request or a group of requests
	 * @param opts - options for the operation
	 */
	unmuteRequest(opts: ClearOptionsId<Promise<unknown>>): this;
	unmuteRequest(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markTask('!muted', task, this.namespaces.request);
	}

	/**
	 * Suspends the specified request
	 * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendRequest(id?: Promise<unknown>): this;

	/**
	 * Suspends the specified request or a group of requests
	 * @param opts - options for the operation
	 */
	suspendRequest(opts: ClearOptionsId<Promise<unknown>>): this;
	suspendRequest(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markTask('paused', task, this.namespaces.request);
	}

	/**
	 * Unsuspends the specified request
	 * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendRequest(id?: Promise<unknown>): this;

	/**
	 * Unsuspends the specified request or a group of requests
	 * @param opts - options for the operation
	 */
	unsuspendRequest(opts: ClearOptionsId<Promise<unknown>>): this;
	unsuspendRequest(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markTask('!paused', task, this.namespaces.request);
	}

	/**
	 * Wraps the specified promise.
	 *
	 * This method doesn't attach any hook or listeners to the object,
	 * but if we cancel the operation by using one of Async's methods, like, "cancelPromise",
	 * the promise will be rejected.
	 *
	 * The promise can be provided as it is or as a function, that returns a promise.
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
			name: this.namespaces.promise,
			...opts
		});

		return new SyncPromise((resolve, reject) => {
			let
				canceled = false,
				proxyReject;

			const proxyResolve = this.proxy(resolve, {
				...p,

				clearFn: () => {
					this.promiseDestructor(p.destructor, <Promise<unknown>>promise);

					if (proxyReject != null) {
						this.clearProxy({id: proxyReject, name: p.name});
					}
				},

				onClear: (...args) => {
					canceled = true;
					return this.onPromiseClear(resolve, reject)(...args);
				},

				onMerge: (...args) => {
					canceled = true;
					return this.onPromiseMerge(resolve, reject)(...args);
				}
			});

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (!canceled) {
				if (Object.isFunction(promise)) {
					promise = promise();
				}

				proxyReject = this.proxy((err) => {
					if (canceled || p.name == null) {
						return;
					}

					const
						cache = that.cache[p.name],
						links = p.group != null ? cache?.groups[p.group]?.links : cache?.root.links,
						task = links?.get(proxyResolve),
						handlers = links?.get(proxyResolve)?.onComplete;

					if (task != null && handlers != null) {
						if (task.muted === true) {
							return;
						}

						const exec = () => {
							reject(err);

							for (let i = 0; i < handlers.length; i++) {
								handlers[i][1].call(ctx, err);
							}
						};

						if (task.paused === true) {
							task.queue.push(exec);
							return;
						}

						exec();

					} else {
						reject(err);
					}

				}, Object.select(p, ['name', 'group']));

				return promise.then(proxyResolve, proxyReject);
			}
		});
	}

	/**
	 * Cancels the specified promise
	 *
	 * @alias
	 * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
	 */
	cancelPromise(id?: Promise<unknown>): this;

	/**
	 * Cancels the specified promise or a group of promises
	 * @param opts - options for the operation
	 */
	cancelPromise(opts: ClearProxyOptions<Promise<unknown>>): this;
	cancelPromise(task?: Promise<unknown> | ClearProxyOptions<Promise<unknown>>): this {
		return this.clearPromise(<any>task);
	}

	/**
	 * Cancels the specified promise
	 * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearPromise(id?: Promise<unknown>): this;

	/**
	 * Cancels the specified promise or a group of promises
	 * @param opts - options for the operation
	 */
	clearPromise(opts: ClearProxyOptions<Promise<unknown>>): this;
	clearPromise(task?: Promise<unknown> | ClearProxyOptions<Promise<unknown>>): this {
		const
			nms = this.namespaces,
			nm = isAsyncOptions<ClearProxyOptions>(task) ? task.name : null;

		this
			.cancelTask(task, nm ?? nms.promise);

		if (nm == null) {
			for (let keys = Object.keys(nms), i = 0; i < keys.length; i++) {
				const
					key = keys[i],
					nm = nms[key];

				if (nm != null && isPromisifyNamespace.test(key)) {
					this.cancelTask(task, nm);
				}
			}
		}

		return this;
	}

	/**
	 * Mutes the specified promise
	 * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
	 */
	mutePromise(id?: Promise<unknown>): this;

	/**
	 * Mutes the specified promise or a group of promises
	 * @param opts - options for the operation
	 */
	mutePromise(opts: ClearOptionsId<Promise<unknown>>): this;
	mutePromise(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markPromise('muted', <any>task);
	}

	/**
	 * Unmutes the specified promise
	 * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
	 */
	unmutePromise(id?: Promise<unknown>): this;

	/**
	 * Unmutes the specified promise or a group of promises
	 * @param opts - options for the operation
	 */
	unmutePromise(opts: ClearOptionsId<Promise<unknown>>): this;
	unmutePromise(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markPromise('!muted', <any>task);
	}

	/**
	 * Suspends the specified promise
	 * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendPromise(id?: Promise<unknown>): this;

	/**
	 * Suspends the specified promise or a group of promises
	 * @param opts - options for the operation
	 */
	suspendPromise(opts: ClearOptionsId<Promise<unknown>>): this;
	suspendPromise(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markPromise('paused', <any>task);
	}

	/**
	 * Unsuspends the specified promise
	 * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendPromise(id?: Promise<unknown>): this;

	/**
	 * Unsuspends the specified promise or a group of promises
	 * @param opts - options for the operation
	 */
	unsuspendPromise(opts: ClearOptionsId<Promise<unknown>>): this;
	unsuspendPromise(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.markPromise('!paused', <any>task);
	}

	/**
	 * Terminates the specified worker
	 *
	 * @param destructor - name of the destructor method
	 * @param worker
	 */
	workerDestructor(destructor: CanUndef<string>, worker: WorkerLikeP): void {
		const
			{workerCache} = this;

		if (workerCache.has(worker)) {
			workerCache.delete(worker);

			if (--worker[asyncCounter] <= 0) {
				let
					fn;

				if (destructor != null) {
					fn = worker[destructor];

				} else if (Object.isSimpleFunction(worker)) {
					fn = worker;

				} else {
					fn =
						worker.terminate ??
						worker.destroy ??
						worker.destructor ??
						worker.close ??
						worker.abort ??
						worker.cancel ??
						worker.disconnect ??
						worker.unwatch;
				}

				if (Object.isFunction(fn)) {
					fn.call(worker);

				} else {
					throw new ReferenceError('A function to destroy the worker is not defined');
				}
			}
		}
	}

	/**
	 * Terminates the specified promise
	 *
	 * @param destructor - name of the destructor method
	 * @param promise
	 */
	promiseDestructor(
		destructor: CanUndef<string>,
		promise: PromiseLike<unknown> | CancelablePromise
	): void {
		let
			fn;

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
	 * Factory to create promise clear handlers
	 *
	 * @param resolve
	 * @param reject
	 */
	onPromiseClear(resolve: Function, reject: Function): Function {
		const
			MAX_PROMISE_DEPTH = 25;

		return (obj) => {
			const
				{replacedBy} = obj;

			if (replacedBy != null && obj.join === 'replace' && obj.link.onClear.length < MAX_PROMISE_DEPTH) {
				replacedBy.onComplete.push([resolve, reject]);

				const
					onClear = Array.concat([], obj.link.onClear, reject);

				for (let i = 0; i < onClear.length; i++) {
					replacedBy.onClear.push(onClear[i]);
				}

			} else {
				reject(obj);
			}
		};
	}

	/**
	 * Factory to create promise merge handlers
	 *
	 * @param resolve
	 * @param reject
	 */
	onPromiseMerge(resolve: Function, reject: Function): Function {
		return (obj) => obj.onComplete.push([resolve, reject]);
	}

	/**
	 * Marks a promise with the specified label
	 *
	 * @param label
	 * @param [id] - operation id (if not specified, the operation will be extended for all promise namespaces)
	 */
	protected markPromise(label: string, id?: Promise<unknown>): this;

	/**
	 * Marks a promise or group of promises with the specified label
	 *
	 * @param label
	 * @param opts - additional options
	 */
	protected markPromise(label: string, opts: ClearOptionsId<Promise<any>>): this;
	protected markPromise(label: string, task?: Promise<any> | ClearOptionsId<Promise<unknown>>): this {
		const
			nms = this.namespaces,
			nm = isAsyncOptions<ClearProxyOptions>(task) ? task.name : null;

		this
			.markTask(label, task, nm ?? nms.promise);

		if (nm == null) {
			for (let keys = Object.keys(nms), i = 0; i < keys.length; i++) {
				const
					key = keys[i],
					nm = nms[key];

				if (nm != null && isPromisifyNamespace.test(key)) {
					this.markTask(label, task, nm);
				}
			}
		}

		return this;
	}
}
