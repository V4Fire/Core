/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Super, { asyncCounter, isPromisifyNamespace, isAsyncOptions } from 'core/async/modules/base';
import {

	AsyncWorkerOptions,
	AsyncProxyOptions,
	AsyncRequestOptions,
	AsyncPromiseOptions,
	ClearProxyOptions,

	ClearOptionsId,
	WorkerLikeP,
	CancelablePromise,

	AsyncCb,
	WrappedCb

} from 'core/async/interface';

export * from 'core/async/modules/base';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * Wraps the specified worker object.
	 *
	 * This method doesn't attach any hook or listeners to the object,
	 * but every time the same object is registered, Async will increment the number of links that relates to this object.
	 * And when we try to destroy the worker using one of Async methods, like "terminateWorker",
	 * it will de-increment the links value. When the number of links is equal to zero,
	 * Async will try to call a "real" object destructor using one of possible destructor methods from a whitelist
	 * or by the specified destructor name, also if the worker is a function, it is interpreted as the destructor.
	 *
	 * @param worker
	 * @param [opts] - additional options for the operation
	 */
	worker<T extends WorkerLikeP>(worker: T, opts?: AsyncWorkerOptions<CTX>): T {
		const
			p = opts || {},
			{workerCache} = this;

		if (!workerCache.has(worker)) {
			workerCache.set(worker, true);
			worker[asyncCounter] = (worker[asyncCounter] || 0) + 1;
		}

		return this.registerTask({
			...p,
			name: this.namespaces.worker,
			obj: worker,
			clearFn: this.workerDestructor.bind(this, p.destructor),
			periodic: p.single !== true
		}) || worker;
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
	 * but if we cancel the operation using one of Async methods, like "cancelProxy",
	 * the target function won't be invoked.
	 *
	 * @param cb
	 * @param [opts] - additional options for the operation
	 */
	proxy<F extends WrappedCb, C extends object = CTX>(cb: F, opts?: AsyncProxyOptions<C>): F {
		return this.registerTask<F, C>({
			...opts,
			name: opts?.name || this.namespaces.proxy,
			obj: cb,
			wrapper: (fn) => fn,
			linkByWrapper: true,
			periodic: opts?.single === false
		}) || <any>(() => undefined);
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
	 * but if we cancel the operation using one of Async methods, like "cancelRequest", the promise will be rejected.
	 * The request can be provided as a promise or as a function, that returns a promise.
	 *
	 * @param request
	 * @param [opts] - additional options for the operation
	 */
	request<T = unknown>(request: (() => PromiseLike<T>) | PromiseLike<T>, opts?: AsyncRequestOptions): Promise<T> {
		return this.promise(request, {...opts, name: this.namespaces.request}) || new Promise<T>(() => undefined);
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
	 * but if we cancel the operation using one of Async methods, like "cancelPromise", the promise will be rejected.
	 * The promise can be provided as it is or as a function, that returns a promise.
	 *
	 * @param promise
	 * @param [opts] - additional options for the operation
	 */
	promise<T = unknown>(promise: (() => PromiseLike<T>) | PromiseLike<T>, opts?: AsyncPromiseOptions): Promise<T> {
		const
			p = <AsyncPromiseOptions>({name: this.namespaces.promise, ...opts});

		return new Promise((resolve, reject) => {
			let
				canceled = false;

			const proxyResolve = <(value: unknown) => unknown>this.proxy(resolve, {
				...p,

				clearFn: () => {
					this.promiseDestructor(p.destructor, <Promise<unknown>>promise);
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

			if (!canceled) {
				if (Object.isFunction(promise)) {
					promise = <any>promise();
				}

				(<Promise<unknown>>promise).then(proxyResolve, (err) => {
					if (canceled) {
						return;
					}

					reject(err);
					this.clearProxy({id: proxyResolve, name: p.name});
				});
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
			nm = isAsyncOptions<ClearProxyOptions>(task) && task.name;

		this
			.cancelTask(task, nm || nms.promise);

		if (!nm) {
			for (let keys = Object.keys(nms), i = 0; i < keys.length; i++) {
				const
					key = keys[i],
					nm = nms[key];

				if (nm && isPromisifyNamespace.test(key)) {
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

				if (destructor) {
					fn = worker[destructor];

				} else if (Object.isFunction(worker)) {
					fn = worker;

				} else {
					fn =
						worker.terminate ||
						worker.destroy ||
						worker.destructor ||
						worker.close ||
						worker.abort ||
						worker.cancel ||
						worker.disconnect ||
						worker.unwatch;
				}

				if (fn && Object.isFunction(fn)) {
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

		if (destructor) {
			fn = promise[destructor];

		} else {
			fn =
				(<CancelablePromise>promise).abort ||
				(<CancelablePromise>promise).cancel;
		}

		if (fn && Object.isFunction(fn)) {
			if ('catch' in promise && Object.isFunction(promise.catch)) {
				promise.catch(() => {
					// Promise error loopback
				});
			}

			fn.call(promise);
		}
	}

	/**
	 * Factory for promise clear handlers
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

			if (replacedBy && obj.join === 'replace' && obj.link.onClear.length < MAX_PROMISE_DEPTH) {
				replacedBy.onComplete.push([resolve, reject]);

				const
					onClear = (<AsyncCb<CTX>[]>[]).concat(obj.link.onClear, <AsyncCb<CTX>>reject);

				for (let i = 0; i < onClear.length; i++) {
					replacedBy.onClear.push(onClear[i]);
				}

			} else {
				reject(obj);
			}
		};
	}

	/**
	 * Factory for promise merge handlers
	 *
	 * @param resolve
	 * @param reject
	 */
	onPromiseMerge(resolve: Function, reject: Function): Function {
		return (obj) => obj.onComplete.push([resolve, reject]);
	}

	/**
	 * Marks a promise by the specified label
	 *
	 * @param label
	 * @param [id] - operation id (if not specified, the operation will be extended for all promise namespaces)
	 */
	protected markPromise(label: string, id?: Promise<unknown>): this;

	/**
	 * Marks a promise or a group of promises by the specified label
	 *
	 * @param label
	 * @param opts - additional options
	 */
	protected markPromise(label: string, opts: ClearOptionsId<Promise<any>>): this;
	protected markPromise(field: string, task?: Promise<any> | ClearOptionsId<Promise<unknown>>): this {
		const
			nms = this.namespaces,
			nm = isAsyncOptions<ClearProxyOptions>(task) && task.name;

		this
			.markTask(field, task, nm || nms.promise);

		if (!nm) {
			for (let keys = Object.keys(nms), i = 0; i < keys.length; i++) {
				const
					key = keys[i],
					nm = nms[key];

				if (nm && isPromisifyNamespace.test(key)) {
					this.markTask(field, task, nm);
				}
			}
		}

		return this;
	}
}
