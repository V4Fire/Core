/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as i from 'core/async/interface';
import Super, { asyncCounter, isPromisifyNamespace, isAsyncOptions } from 'core/async/modules/base';
export * from 'core/async/modules/base';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * Wrapper for workers: WebWorker, Socket, etc.
	 *
	 * @param worker
	 * @param [params] - additional parameters for the operation:
	 *   *) [name] - worker name
	 *   *) [destructor] - name of destructor method
	 *   *) [join] - if true, then competitive tasks (with same labels) will be joined to the first
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [onClear] - clear handler
	 *   *) [onMerge] - merge handler (join: true)
	 */
	worker<T extends i.WorkerLikeP>(worker: T, params?: i.AsyncWorkerOptions<CTX>): T {
		const
			p = params || {},
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
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	terminateWorker(id?: i.WorkerLikeP): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - link for the worker
	 *   *) [label] - label for the task
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	terminateWorker(params: i.ClearProxyOptions<i.WorkerLikeP>): this;
	terminateWorker(p: any): this {
		return this.clearWorker(p);
	}

	/**
	 * Terminates the specified worker
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	clearWorker(id?: i.WorkerLikeP): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - link for the worker
	 *   *) [label] - label for the task
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearWorker(params: i.ClearProxyOptions<i.WorkerLikeP>): this;
	clearWorker(p: any): this {
		return this.cancelTask(p, isAsyncOptions<i.ClearProxyOptions>(p) && p.name || this.namespaces.worker);
	}

	/**
	 * Wrapper for a remote request
	 *
	 * @param request
	 * @param [params] - additional parameters for the operation:
	 *   *) [join] - strategy for joining competitive tasks (with same labels):
	 *       *) true - all tasks will be joined to the first;
	 *       *) 'replace' - all tasks will be joined (replaced) to the last.
	 *
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [destructor] - name of destructor method
	 */
	request<T = unknown>(request: (() => PromiseLike<T>) | PromiseLike<T>, params?: i.AsyncRequestOptions): Promise<T> {
		return this.promise(request, {...params, name: this.namespaces.request}) || new Promise<T>(() => undefined);
	}

	/**
	 * Cancels the specified request
	 *
	 * @alias
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	cancelRequest(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - link for the request
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	cancelRequest(params: i.ClearOptionsId<Promise<unknown>>): this;
	cancelRequest(p: any): this {
		return this.clearRequest(p);
	}

	/**
	 * Cancels the specified request
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	clearRequest(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - link for the request
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearRequest(params: i.ClearOptionsId<Promise<unknown>>): this;
	clearRequest(p: any): this {
		return this.cancelTask(p, this.namespaces.request);
	}

	/**
	 * Mutes a request operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteRequest(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteRequest(params: i.ClearOptionsId<Promise<unknown>>): this;
	muteRequest(p: any): this {
		return this.markTask('muted', p, this.namespaces.request);
	}

	/**
	 * Unmutes a request operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteRequest(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteRequest(params: i.ClearOptionsId<Promise<unknown>>): this;
	unmuteRequest(p: any): this {
		return this.markTask('!muted', p, this.namespaces.request);
	}

	/**
	 * Suspends a request operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendRequest(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendRequest(params: i.ClearOptionsId<Promise<unknown>>): this;
	suspendRequest(p: any): this {
		return this.markTask('paused', p, this.namespaces.request);
	}

	/**
	 * Unsuspends a request operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendRequest(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendRequest(params: i.ClearOptionsId<Promise<unknown>>): this;
	unsuspendRequest(p: any): this {
		return this.markTask('!paused', p, this.namespaces.request);
	}

	/**
	 * Wrapper for a callback function
	 *
	 * @param cb
	 * @param [params] - additional parameters for the operation:
	 *   *) [name] - operation name
	 *   *) [join] - if true, then competitive tasks (with same labels) will be joined to the first
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [single] - if false, then after first invocation the proxy it won't be removed
	 *   *) [onClear] - clear handler
	 *   *) [onMerge] - merge handler (join: true)
	 */
	proxy<F extends i.WrappedCb, C extends object = CTX>(cb: F, params?: i.AsyncProxyOptions<C>): F {
		return this.registerTask<F, C>({
			...params,
			name: params?.name || this.namespaces.proxy,
			obj: cb,
			wrapper: (fn) => fn,
			linkByWrapper: true,
			periodic: params?.single === false
		}) || <any>(() => undefined);
	}

	/**
	 * Cancels the specified callback function
	 *
	 * @alias
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	cancelProxy(id?: Function): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [name] - operation name
	 *   *) [id] - link for the callback
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	cancelProxy(params: i.ClearProxyOptions<Function>): this;
	cancelProxy(p: any): this {
		return this.clearProxy(p);
	}

	/**
	 * Cancels the specified callback function
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	clearProxy(id?: Function): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [name] - operation name
	 *   *) [id] - link for the callback
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearProxy(params: i.ClearProxyOptions<Function>): this;
	clearProxy(p: any): this {
		return this.cancelTask(p, isAsyncOptions<i.ClearProxyOptions>(p) && p.name || this.namespaces.proxy);
	}

	/**
	 * Mutes a proxy operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteProxy(id?: Function): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [name] - operation name
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteProxy(params: i.ClearProxyOptions<Function>): this;
	muteProxy(p: any): this {
		return this.markTask('muted', p, isAsyncOptions<i.ClearProxyOptions>(p) && p.name || this.namespaces.proxy);
	}

	/**
	 * Unmutes a proxy operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteProxy(id?: Function): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [name] - operation name
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteProxy(params: i.ClearProxyOptions<Function>): this;
	unmuteProxy(p: any): this {
		return this.markTask('!muted', p, isAsyncOptions<i.ClearProxyOptions>(p) && p.name || this.namespaces.proxy);
	}

	/**
	 * Suspends a proxy operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendProxy(id?: Function): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [name] - operation name
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendProxy(params: i.ClearProxyOptions<Function>): this;
	suspendProxy(p: any): this {
		return this.markTask('paused', p, isAsyncOptions<i.ClearProxyOptions>(p) && p.name || this.namespaces.proxy);
	}

	/**
	 * Unsuspends a proxy operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendProxy(id?: Function): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [name] - operation name
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendProxy(params: i.ClearProxyOptions<Function>): this;
	unsuspendProxy(p: any): this {
		return this.markTask('!paused', p, isAsyncOptions<i.ClearProxyOptions>(p) && p.name || this.namespaces.proxy);
	}

	/**
	 * Wrapper for a promise
	 *
	 * @param promise
	 * @param [params] - additional parameters for the operation:
	 *   *) [join] - strategy for joining competitive tasks (with same labels):
	 *       *) true - all tasks will be joined to the first;
	 *       *) 'replace' - all tasks will be joined (replaced) to the last.
	 *
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [destructor] - name of destructor method
	 */
	promise<T = unknown>(promise: (() => PromiseLike<T>) | PromiseLike<T>, params?: i.AsyncPromiseOptions): Promise<T> {
		const
			p = <i.AsyncPromiseOptions>({name: this.namespaces.promise, ...params});

		return new Promise((resolve, reject) => {
			let
				canceled = false;

			const proxyResolve = <(value: unknown) => unknown>this.proxy(resolve, {
				...<any>p,

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
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	cancelPromise(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - link for the promise
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	cancelPromise(params: i.ClearProxyOptions<Function>): this;
	cancelPromise(p: any): this {
		return this.clearPromise(p);
	}

	/**
	 * Cancels the specified promise
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	clearPromise(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - link for the promise
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearPromise(params: i.ClearProxyOptions<Function>): this;
	clearPromise(p: any): this {
		const
			nms = this.namespaces,
			nm = isAsyncOptions<i.ClearProxyOptions>(p) && p.name;

		this
			.cancelTask(p, nm || nms.promise);

		if (!nm) {
			for (let keys = Object.keys(nms), i = 0; i < keys.length; i++) {
				const
					key = keys[i],
					nm = nms[key];

				if (nm && isPromisifyNamespace.test(key)) {
					this.cancelTask(p, nm);
				}
			}
		}

		return this;
	}

	/**
	 * Mutes a promise operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	mutePromise(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	mutePromise(params: i.ClearOptionsId<Function>): this;
	mutePromise(p: any): this {
		return this.markPromise('muted', p);
	}

	/**
	 * Unmutes a proxy operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmutePromise(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmutePromise(params: i.ClearOptionsId<Function>): this;
	unmutePromise(p: any): this {
		return this.markPromise('!muted', p);
	}

	/**
	 * Suspends a promise operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendPromise(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendPromise(params: i.ClearOptionsId<Function>): this;
	suspendPromise(p: any): this {
		return this.markPromise('paused', p);
	}

	/**
	 * Unsuspends a promise operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendPromise(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendPromise(params: i.ClearOptionsId<Function>): this;
	unsuspendPromise(p: any): this {
		return this.markPromise('!paused', p);
	}

	/**
	 * Terminates the specified worker
	 *
	 * @param destructor - name of the destructor method
	 * @param worker
	 */
	workerDestructor(destructor: CanUndef<string>, worker: i.WorkerLikeP): void {
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
					throw new ReferenceError('A function for destructing the worker is not defined');
				}
			}
		}
	}

	/**
	 * Aborts the specified promise
	 *
	 * @param destructor - name of the destructor method
	 * @param promise
	 */
	promiseDestructor(
		destructor: CanUndef<string>,
		promise: PromiseLike<unknown> | i.CancelablePromise
	): void {
		let
			fn;

		if (destructor) {
			fn = promise[destructor];

		} else {
			fn =
				(<i.CancelablePromise>promise).abort ||
				(<i.CancelablePromise>promise).cancel;
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
					onClear = (<i.AsyncCb<CTX>[]>[]).concat(obj.link.onClear, <i.AsyncCb<CTX>>reject);

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
	 * Marks a promise task (or a group of tasks) by the specified label
	 *
	 * @param label
	 * @param [id] - operation id (if not specified, the operation will be extended for all promise namespaces)
	 */
	protected markPromise(label: string, id?: Promise<unknown>): this;

	/**
	 * @param label
	 * @param opts - additional options:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	protected markPromise(label: string, opts: i.ClearOptionsId<Function>): this;
	protected markPromise(field: string, task?: Promise<unknown> | i.ClearOptionsId<Function>): this {
		const
			nms = this.namespaces,
			nm = isAsyncOptions<i.ClearProxyOptions>(task) && task.name;

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
