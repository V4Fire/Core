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

	AsyncOptions,
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
	 *
	 * @alias
	 * @param opts - options for the operation
	 */
	terminateWorker(opts: ClearProxyOptions<WorkerLikeP>): this;
	terminateWorker(task?: WorkerLikeP | ClearProxyOptions<WorkerLikeP>): this {
		return this.clearWorker(Object.cast(task));
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
	 * Creates a new function that wraps the original and returns it.
	 *
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
		}) ?? Object.cast(() => undefined);
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
	 *
	 * @alias
	 * @param opts - options for the operation
	 */
	cancelProxy(opts: ClearProxyOptions<Function>): this;
	cancelProxy(task?: Function | ClearProxyOptions<Function>): this {
		return this.clearProxy(Object.cast(task));
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
	 * Creates a promise that wraps the passed request and returns it.
	 *
	 * This method doesn't attach any hook or listeners to the object,
	 * but if we cancel the operation by using one of Async's methods, like, "cancelRequest",
	 * the promise will be rejected.
	 *
	 * The request can be provided as a promise or function, that returns a promise.
	 * Notice, the method uses `Async.promise`, but with a different namespace: `request` instead of `promise`.
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
	 * Cancels the specified request.
	 * The canceled promise will be automatically rejected.
	 *
	 * @alias
	 * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
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
	 * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
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
		return this.cancelTask(task, this.namespaces.request);
	}

	/**
	 * Mutes the specified request.
	 * If the request is resolved during it muted, the promise wrapper will be rejected.
	 *
	 * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
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
	 * Creates a new asynchronous iterable object from the specified iterable and returns it.
	 * If the passed iterable doesn't have `Symbol.asyncIterator`, it will be created from a synchronous object iterator
	 * (the synchronous iterator will also be preserved).
	 *
	 * Notice, until the created promise object isn't executed by invoking the `next` method,
	 * any async operations won't be registered.
	 *
	 * @param iterable
	 * @param [opts] - additional options for the operation
	 *
	 * @example
	 * ```js
	 * const async = new Async();
	 *
	 * for await (const el of async.iterable([1, 2, 3, 4])) {
	 *   console.log(el);
	 * }
	 * ```
	 */
	iterable<T>(iterable: AnyIterable<T>, opts?: AsyncOptions): AsyncIterable<T> | AsyncIterable<T> & Iterable<T> {
		const
			baseIterator = this.getBaseIterator(iterable);

		if (baseIterator == null) {
			return Object.cast({
				// eslint-disable-next-line require-yield
				*[Symbol.asyncIterator]() {
					return undefined;
				}
			});
		}

		let
			globalError,
			doneDelay = 0;

		const newIterable = {
			[Symbol.asyncIterator]: () => ({
				[Symbol.asyncIterator]() {
					return this;
				},

				next: () => {
					if (globalError != null) {
						return Promise.reject(globalError);
					}

					const promise = this.promise(Promise.resolve(baseIterator.next()), {
						...opts,
						name: this.namespaces.iterable,
						onMutedResolve: (resolve, reject) => {
							// Prevent an infinity loop if the iterable is already done
							if (doneDelay > 0) {
								setTimeout(() => {
									resolve({value: undefined, done: true});
								}, doneDelay);

								return;
							}

							Promise.resolve(baseIterator.next()).then((res) => {
								if (res.done) {
									if (doneDelay === 0) {
										doneDelay = 15;

									} else if (doneDelay < 200) {
										doneDelay *= 2;
									}
								}

								resolve(res);
							}, reject);
						}
					});

					promise.catch((err) => {
						if (Object.isDictionary(err) && err.type === 'clearAsync') {
							globalError = err;
						}
					});

					this.idsMap.set(newIterable, this.idsMap.get(promise) ?? promise);
					return promise;
				}
			})
		};

		if (Object.isIterable(iterable[Symbol.iterator])) {
			newIterable[Symbol.iterator] = iterable[Symbol.iterator];
		}

		return newIterable;
	}

	/**
	 * Cancels the specified iterable object.
	 * Notice that cancellation affects only objects that have already been activated by invoking the `next` method.
	 * So, for example, canceled iterable will throw an error on the next invoking of `next`.
	 *
	 * @alias
	 * @param [id] - link to the iterable (if not specified, then the operation will be applied for all registered tasks)
	 */
	cancelIterable(id?: AsyncIterable<unknown>): this;

	/**
	 * Cancels the specified iterable or a group of iterable.
	 * Notice that cancellation affects only objects that have already been activated by invoking the `next` method.
	 * So, for example, canceled iterable will throw an error on the next invoking of `next`.
	 *
	 * @alias
	 * @param opts - options for the operation
	 */
	cancelIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
	cancelIterable(task?: AsyncIterable<unknown> | ClearOptionsId<AsyncIterable<unknown>>): this {
		return this.clearIterable(Object.cast(task));
	}

	/**
	 * Cancels the specified iterable object.
	 * Notice that cancellation affects only objects that have already been activated by invoking the `next` method.
	 * So, for example, canceled iterable will throw an error on the next invoking of `next`.
	 *
	 * @param [id] - link to the request (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearIterable(id?: Promise<unknown>): this;

	/**
	 * Cancels the specified iterable object.
	 * Notice that cancellation affects only objects that have already been activated by invoking the `next` method.
	 * So, for example, canceled iterable will throw an error on the next invoking of `next`.
	 *
	 * @param opts - options for the operation
	 */
	clearIterable(opts: ClearOptionsId<Promise<unknown>>): this;
	clearIterable(task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
		return this.cancelTask(task, this.namespaces.iterable);
	}

	/**
	 * Mutes the specified iterable object.
	 * Elements that are consumed during the object is muted will be ignored.
	 * Notice that muting affects only objects that have already been activated by invoking the `next` method.
	 *
	 * @param [id] - link to the iterable (if not specified, then the operation will be applied for all registered tasks)
	 */
	muteIterable(id?: AsyncIterable<unknown>): this;

	/**
	 * Mutes the specified iterable object or a group of iterable objects.
	 * Elements, that are consumed during the object is muted will be ignored.
	 * Notice that muting affects only objects that have already been activated by invoking the `next` method.
	 *
	 * @param opts - options for the operation
	 */
	muteIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
	muteIterable(task?: AsyncIterable<unknown> | ClearOptionsId<AsyncIterable<unknown>>): this {
		return this.markTask('muted', task, this.namespaces.iterable);
	}

	/**
	 * Unmutes the specified iterable object
	 * @param [id] - link to the iterable (if not specified, then the operation will be applied for all registered tasks)
	 */
	unmuteIterable(id?: AsyncIterable<unknown>): this;

	/**
	 * Unmutes the specified iterable function or a group of iterable objects
	 * @param opts - options for the operation
	 */
	unmuteIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
	unmuteIterable(task?: AsyncIterable<unknown> | ClearOptionsId<AsyncIterable<unknown>>): this {
		return this.markTask('!muted', task, this.namespaces.iterable);
	}

	/**
	 * Suspends the specified iterable object.
	 * Notice that suspending affects only objects that have already been activated by invoking the `next` method.
	 *
	 * @param [id] - link to the iterable (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendIterable(id?: AsyncIterable<unknown>): this;

	/**
	 * Suspends the specified iterable or a group of iterable objects.
	 * Notice that suspending affects only objects that have already been activated by invoking the `next` method.
	 *
	 * @param opts - options for the operation
	 */
	suspendIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
	suspendIterable(task?: AsyncIterable<unknown> | ClearOptionsId<AsyncIterable<unknown>>): this {
		return this.markTask('paused', task, this.namespaces.iterable);
	}

	/**
	 * Unsuspends the specified iterable object
	 * @param [id] - link to the iterable (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendIterable(id?: AsyncIterable<unknown>): this;

	/**
	 * Unsuspends the specified iterable or a group of iterable objects
	 * @param opts - options for the operation
	 */
	unsuspendIterable(opts: ClearOptionsId<AsyncIterable<unknown>>): this;
	unsuspendIterable(task?: AsyncIterable<unknown> | ClearOptionsId<AsyncIterable<unknown>>): this {
		return this.markTask('!paused', task, this.namespaces.iterable);
	}

	/**
	 * Creates a new promise that wraps the passed promise and returns it.
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

		let
			wrappedResolve;

		const wrappedPromise = new SyncPromise((resolve, reject) => {
			let
				canceled = false,
				proxyReject;

			wrappedResolve = this.proxy(resolve, {
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
				},

				onMutedCall: (link) => {
					const
						handlers = Array.concat([], opts?.onMutedResolve);

					if (handlers.length > 0) {
						for (let i = 0; i < handlers.length; i++) {
							handlers[i].call(ctx, wrappedResolve, proxyReject);
						}

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

				proxyReject = this.proxy((err) => {
					if (canceled || p.name == null) {
						return;
					}

					const
						cache = that.cache[p.name],
						links = p.group != null ? cache?.groups[p.group]?.links : cache?.root.links;

					const
						task = links?.get(wrappedResolve),
						handlers = links?.get(wrappedResolve)?.onComplete;

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

				return promise.then(wrappedResolve, proxyReject);
			}
		});

		this.idsMap.set(wrappedPromise, wrappedResolve);
		return wrappedPromise;
	}

	/**
	 * Cancels the specified promise.
	 * The canceled promise will be automatically rejected.
	 *
	 * @alias
	 * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
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
	 * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
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
	 * Mutes the specified promise.
	 * If the promise is resolved during it muted, the promise wrapper will be rejected.
	 *
	 * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
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
	 * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
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
	 * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
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
	 * @param [id] - link to the promise (if not specified, then the operation will be applied for all registered tasks)
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
	protected markPromise(label: string, opts: ClearOptionsId<Promise<unknown>>): this;
	protected markPromise(label: string, task?: Promise<unknown> | ClearOptionsId<Promise<unknown>>): this {
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

	/**
	 * Returns an iterator from the passed iterable object.
	 * Notice, an asynchronous iterator has more priority.
	 *
	 * @param [iterable]
	 */
	protected getBaseIterator<T>(iterable: AnyIterable<T>): CanUndef<AnyIterableIterator<T>> {
		if (Object.isFunction(iterable[Symbol.asyncIterator])) {
			return iterable[Symbol.asyncIterator]();
		}

		if (Object.isFunction(iterable[Symbol.iterator])) {
			return iterable[Symbol.iterator]();
		}
	}
}
