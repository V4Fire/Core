/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* tslint:disable:max-file-line-count */
/// <reference types="node"/>

export const
	asyncCounter = Symbol('Async counter id');

export interface AsyncLink<T extends object = Async> {
	id: any;
	obj: any;
	objName?: string;
	label?: string | symbol;
	paused: boolean;
	muted: boolean;
	queue: Function[];
	clearFn?: Function;
	onComplete: AsyncCompleteHandler<T>[][];
	onClear: AsyncClearHandler<T>[];
}

export interface ClearOpts {
	label?: string | symbol;
	group?: string | symbol | RegExp;
}

export interface ClearOptsId<T> extends ClearOpts {
	id?: T;
}

export interface ClearProxyOpts<T> extends ClearOptsId<T> {
	name?: string;
}

export interface AsyncOpts {
	join?: boolean | 'replace';
	label?: string | symbol;
	group?: string | symbol;
}

export type AsyncCtx<T extends object = Async> = {
	type: string;
	link: AsyncLink<T>;
	replacedBy?: AsyncLink<T>;
} & AsyncOpts & ClearOptsId<any>;

export interface AsyncClearHandler<T extends object = Async> {
	(this: T, ctx: AsyncCtx<T>): void;
}

export interface AsyncCompleteHandler<T extends object = Async> {
	(this: T, ...args: any[]): void;
}

export interface AsyncMergeHandler<T extends object = Async> {
	(this: T, link: AsyncLink<T>): void;
}

export interface AsyncCbOpts<T extends object = Async> extends AsyncOpts {
	onClear?: AsyncClearHandler<T> | AsyncClearHandler<T>[];
	onMerge?: AsyncMergeHandler<T> | AsyncMergeHandler<T>[];
}

export interface AsyncCbOptsSingle<T extends object = Async> extends AsyncCbOpts<T> {
	single?: boolean;
}

export interface AsyncProxyOpts<T extends object = Async> extends AsyncCbOptsSingle<T> {
	name?: string;
}

export interface AsyncPromiseOpts extends AsyncOpts {
	name?: string;
}

export interface AsyncCreateIdleOpts<T extends object = Async> extends AsyncCbOpts<T> {
	timeout?: number;
}

export interface AsyncIdleOpts extends AsyncOpts {
	timeout?: number;
}

export interface AsyncWaitOpts extends AsyncOpts {
	delay?: number;
}

export interface AsyncOnOpts<T extends object = Async> extends AsyncCbOptsSingle<T> {
	options?: AddEventListenerOptions;
}

export interface AsyncOnceOpts<T extends object = Async> extends AsyncCbOpts<T> {
	options?: AddEventListenerOptions;
}

export interface AsyncWorkerOpts<T extends object = Async> extends AsyncProxyOpts<T> {
	destructor?: string;
}

export interface LocalCacheObject {
	labels: Dictionary;
	links: Map<any, any>;
}

export interface CacheObject {
	root: LocalCacheObject;
	groups: Dictionary<LocalCacheObject>;
}

export interface WorkerLike {
	terminate?: Function;
	destroy?: Function;
	destructor?: Function;
	close?: Function;
	abort?: Function;
	cancel?: Function;
	disconnect?: Function;
	unwatch?: Function;
}

export interface EventEmitterLike {
	on?: Function;
	addListener?: Function;
	addEventListener?: Function;
	once?: Function;
	off?: Function;
	removeListener?: Function;
	removeEventListener?: Function;
}

export type WorkerLikeP = Function | WorkerLike;
export type EventEmitterLikeP = Function | EventEmitterLike;

export interface CancelablePromise<T> extends Promise<T> {
	abort?: Function;
	cancel?: Function;
}

/**
 * Base class for Async IO
 *
 * @example
 * this.setImmediate(() => alert(1));                                // 1
 * this.setImmediate(() => alert(2), {label: 'foo'});                // -
 * this.setImmediate(() => alert(3), {label: 'foo'});                // 3, calls only last task with a same label
 * this.setImmediate(() => alert(4), {group: 'bar'});                // 4
 * this.setImmediate(() => alert(5), {label: 'foo', group: 'bar'});  // -
 * this.setImmediate(() => alert(6), {label: 'foo', group: 'bar'});  // 6
 */
export default class Async<CTX extends object = Async<any>> {
	/**
	 * Cache object for async operations
	 */
	protected readonly cache: Dictionary<CacheObject> = Object.createDict();

	/**
	 * Cache object for initialized workers
	 */
	protected readonly workerCache: WeakMap<object, boolean> = new WeakMap();

	/**
	 * Context for functions
	 */
	protected readonly context?: CTX;

	/**
	 * @param [ctx] - context for functions
	 */
	constructor(ctx?: CTX) {
		this.context = ctx;
	}

	/**
	 * Wrapper for setImmediate
	 *
	 * @param fn - callback function
	 * @param [params] - additional parameters for the operation:
	 *   *) [join] - if true, then competitive tasks (with same labels) will be joined to the first
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [onClear] - clear handler
	 */
	setImmediate(fn: Function, params?: AsyncCbOpts<CTX>): number | NodeJS.Timer {
		return this.setAsync({
			...params,
			name: 'immediate',
			obj: fn,
			clearFn: clearImmediate,
			wrapper: setImmediate,
			linkByWrapper: true
		});
	}

	/**
	 * Wrapper for clearImmediate
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	clearImmediate(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearImmediate(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	clearImmediate(p) {
		return this.clearAsync(p, 'immediate');
	}

	/**
	 * Mutes a setImmediate operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	muteImmediate(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteImmediate(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	muteImmediate(p) {
		return this.markAsync('muted', p, 'immediate');
	}

	/**
	 * Unmutes a setImmediate operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unmuteImmediate(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteImmediate(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	unmuteImmediate(p) {
		return this.markAsync('!muted', p, 'immediate');
	}

	/**
	 * Suspends a setImmediate operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	suspendImmediate(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendImmediate(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	suspendImmediate(p) {
		return this.markAsync('paused', p, 'immediate');
	}

	/**
	 * Unsuspends a setImmediate operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unsuspendImmediate(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendImmediate(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	unsuspendImmediate(p) {
		return this.markAsync('!paused', p, 'immediate');
	}

	/**
	 * Wrapper for setInterval
	 *
	 * @param fn - callback function
	 * @param interval - interval value
	 * @param [params] - additional parameters for the operation:
	 *   *) [join] - if true, then competitive tasks (with same labels) will be joined to the first
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [onClear] - clear handler
	 */
	setInterval(fn: Function, interval: number, params?: AsyncCbOpts<CTX>): number | NodeJS.Timer {
		return this.setAsync({
			...params,
			name: 'interval',
			obj: fn,
			clearFn: clearInterval,
			wrapper: setInterval,
			linkByWrapper: true,
			periodic: true,
			args: [interval]
		});
	}

	/**
	 * Wrapper for clearInterval
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	clearInterval(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearInterval(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	clearInterval(p) {
		return this.clearAsync(p, 'interval');
	}

	/**
	 * Mutes a setInterval operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	muteInterval(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteInterval(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	muteInterval(p) {
		return this.markAsync('!muted', p, 'interval');
	}

	/**
	 * Unmutes a setInterval operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unmuteInterval(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteInterval(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	unmuteInterval(p) {
		return this.markAsync('!muted', p, 'interval');
	}

	/**
	 * Suspends a setInterval operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	suspendInterval(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendInterval(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	suspendInterval(p) {
		return this.markAsync('paused', p, 'interval');
	}

	/**
	 * Unsuspends a setImmediate operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unsuspendInterval(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendInterval(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	unsuspendInterval(p) {
		return this.markAsync('!paused', p, 'interval');
	}

	/**
	 * Wrapper for setTimeout
	 *
	 * @param fn - callback function
	 * @param timer - timer value
	 * @param [params] - additional parameters for the operation:
	 *   *) [join] - if true, then competitive tasks (with same labels) will be joined to the first
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [onClear] - clear handler
	 */
	setTimeout(fn: Function, timer: number, params?: AsyncCbOpts<CTX>): number | NodeJS.Timer {
		return this.setAsync({
			...params,
			name: 'timeout',
			obj: fn,
			clearFn: clearTimeout,
			wrapper: setTimeout,
			linkByWrapper: true,
			args: [timer]
		});
	}

	/**
	 * Wrapper for clearTimeout
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	clearTimeout(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearTimeout(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	clearTimeout(p) {
		return this.clearAsync(p, 'timeout');
	}

	/**
	 * Mutes a setTimeout operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	muteTimeout(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteTimeout(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	muteTimeout(p) {
		return this.markAsync('muted', p, 'timeout');
	}

	/**
	 * Unmutes a setTimeout operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unmuteTimeout(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteTimeout(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	unmuteTimeout(p) {
		return this.markAsync('!muted', p, 'timeout');
	}

	/**
	 * Suspends a setTimeout operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	suspendTimeout(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendTimeout(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	suspendTimeout(p) {
		return this.markAsync('paused', p, 'timeout');
	}

	/**
	 * Unsuspends a setTimeout operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unsuspendTimeout(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendTimeout(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	unsuspendTimeout(p) {
		return this.markAsync('!paused', p, 'timeout');
	}

	/**
	 * Wrapper for requestIdleCallback
	 *
	 * @param fn - callback function
	 * @param [params] - additional parameters for the operation:
	 *   *) [timeout] - timeout value for the native requestIdleCallback
	 *   *) [join] - if true, then competitive tasks (with same labels) will be joined to the first
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [onClear] - clear handler
	 */
	requestIdleCallback(
		fn: (deadline: IdleDeadline) => any,
		params?: AsyncCreateIdleOpts<CTX>
	): number | NodeJS.Timer {
		return this.setAsync({
			...params && Object.reject(params, 'timeout'),
			name: 'idleCallback',
			obj: fn,
			clearFn: cancelIdleCallback,
			wrapper: requestIdleCallback,
			linkByWrapper: true,
			args: params && Object.select(params, 'timeout')
		});
	}

	/**
	 * Wrapper for cancelIdleCallback
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	cancelIdleCallback(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	cancelIdleCallback(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	cancelIdleCallback(p) {
		return this.clearAsync(p, 'idleCallback');
	}

	/**
	 * Mutes a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	muteIdleCallback(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteIdleCallback(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	muteIdleCallback(p) {
		return this.markAsync('muted', p, 'idleCallback');
	}

	/**
	 * Unmutes a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unmuteIdleCallback(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteIdleCallback(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	unmuteIdleCallback(p) {
		return this.markAsync('!muted', p, 'idleCallback');
	}

	/**
	 * Suspends a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	suspendIdleCallback(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendIdleCallback(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	suspendIdleCallback(p) {
		return this.markAsync('paused', p, 'idleCallback');
	}

	/**
	 * Unsuspends a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unsuspendIdleCallback(id?: number | NodeJS.Timer): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendIdleCallback(params: ClearOptsId<number | NodeJS.Timer>): this;

	// tslint:disable-next-line
	unsuspendIdleCallback(p) {
		return this.markAsync('!paused', p, 'idleCallback');
	}

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
	 */
	worker<T>(worker: T & WorkerLikeP, params?: AsyncWorkerOpts<CTX>): T {
		const
			p = params || {},
			{workerCache} = this;

		if (!workerCache.has(worker)) {
			workerCache.set(worker, true);
			worker[asyncCounter] = (worker[asyncCounter] || 0) + 1;
		}

		return this.setAsync({
			...p,
			name: 'worker',
			obj: worker,
			clearFn: this.workerDestructor.bind(this, p.destructor),
			periodic: p.single !== true
		});
	}

	/**
	 * Terminates the specified worker
	 * @param [worker] - link for the worker (if not defined wil be terminate all workers)
	 */
	terminateWorker<T>(worker?: T & WorkerLikeP): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - link for the worker
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	terminateWorker<T>(params: ClearProxyOpts<T & WorkerLikeP>): this;

	// tslint:disable-next-line
	terminateWorker(p) {
		return this.clearAsync(p, Object.isObject(p) && p.name || 'worker');
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
	 */
	request<T>(request: (() => PromiseLike<T>) | PromiseLike<T>, params?: AsyncOpts): Promise<T> {
		return this.promise(request, {...params, name: 'request'});
	}

	/**
	 * Cancels the specified request
	 * @param [request] - link for the request (if not defined wil be cancel all request)
	 */
	cancelRequest(request?: Promise<any>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - link for the request
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	cancelRequest(params: ClearOptsId<Promise<any>>): this;

	// tslint:disable-next-line
	cancelRequest(p) {
		return this.clearAsync(p, 'request');
	}

	/**
	 * Mutes a request operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	muteRequest(id?: Promise<any>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteRequest(params: ClearOptsId<Promise<any>>): this;

	// tslint:disable-next-line
	muteRequest(p) {
		return this.markAsync('muted', p, 'request');
	}

	/**
	 * Unmutes a request operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unmuteRequest(id?: Promise<any>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteRequest(params: ClearOptsId<Promise<any>>): this;

	// tslint:disable-next-line
	unmuteRequest(p) {
		return this.markAsync('!muted', p, 'request');
	}

	/**
	 * Suspends a request operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	suspendRequest(id?: Promise<any>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendRequest(params: ClearOptsId<Promise<any>>): this;

	// tslint:disable-next-line
	suspendRequest(p) {
		return this.markAsync('paused', p, 'request');
	}

	/**
	 * Unsuspends a request operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unsuspendRequest(id?: Promise<any>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendRequest(params: ClearOptsId<Promise<any>>): this;

	// tslint:disable-next-line
	unsuspendRequest(p) {
		return this.markAsync('!paused', p, 'request');
	}

	/**
	 * Wrapper for a callback function
	 *
	 * @param cb
	 * @param [params] - additional parameters for the operation:
	 *   *) [join] - if true, then competitive tasks (with same labels) will be joined to the first
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [single] - if false, then after first invocation the proxy it won't be removed
	 *   *) [onClear] - clear handler
	 */
	proxy(cb: Function, params?: AsyncProxyOpts<CTX>): Function {
		const p = params || {};
		return this.setAsync({
			...params,
			name: p.name || 'proxy',
			obj: cb,
			wrapper: (fn) => fn,
			linkByWrapper: true,
			periodic: p.single === false
		});
	}

	/**
	 * Cancels the specified callback function
	 * @param [cb] - link for the callback (if not defined will be remove all callbacks)
	 */
	cancelProxy<T>(cb?: Function): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - link for the callback
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	cancelProxy<T>(params: ClearProxyOpts<Function>): this;

	// tslint:disable-next-line
	cancelProxy(p) {
		return this.clearAsync(p, Object.isObject(p) && p.name || 'proxy');
	}

	/**
	 * Mutes a proxy operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	muteProxy(id?: Function): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteProxy(params: ClearOptsId<Function>): this;

	// tslint:disable-next-line
	muteProxy(p) {
		return this.markAsync('muted', p, Object.isObject(p) && p.name || 'proxy');
	}

	/**
	 * Unmutes a proxy operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unmuteProxy(id?: Function): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteProxy(params: ClearOptsId<Function>): this;

	// tslint:disable-next-line
	unmuteProxy(p) {
		return this.markAsync('!muted', p, Object.isObject(p) && p.name || 'proxy');
	}

	/**
	 * Suspends a proxy operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	suspendProxy(id?: Function): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendProxy(params: ClearOptsId<Function>): this;

	// tslint:disable-next-line
	suspendProxy(p) {
		return this.markAsync('paused', p, Object.isObject(p) && p.name || 'proxy');
	}

	/**
	 * Unsuspends a proxy operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unsuspendProxy(id?: Function): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendProxy(params: ClearOptsId<Function>): this;

	// tslint:disable-next-line
	unsuspendProxy(p) {
		return this.markAsync('!paused', p, Object.isObject(p) && p.name || 'proxy');
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
	 */
	promise<T>(promise: (() => PromiseLike<T>) | PromiseLike<T>, params?: AsyncPromiseOpts): Promise<T> {
		const
			p = <AsyncPromiseOpts>(params || {});

		return new Promise((resolve, reject) => {
			let
				canceled = false;

			const proxyResolve = <(value: any) => any>this.proxy(resolve, {
				...<any>p,

				clearFn: () => {
					this.promiseDestructor(<Promise<any>>promise);
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

				(<Promise<any>>promise).then(proxyResolve, (err) => {
					if (canceled) {
						return;
					}

					reject(err);
					this.cancelProxy({id: proxyResolve, name: p.name});
				});
			}
		});
	}

	/**
	 * Promise for setTimeout
	 *
	 * @param timer
	 * @param [params] - additional parameters for the operation:
	 *   *) [join] - strategy for joining competitive tasks (with same labels):
	 *       *) true - all tasks will be joined to the first;
	 *       *) 'replace' - all tasks will be joined (replaced) to the last.
	 *
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 */
	sleep(timer: number, params?: AsyncOpts): Promise<void> {
		return new Promise((resolve, reject) => {
			this.setTimeout(resolve, timer, {
				...<any>params,
				onClear: this.onPromiseClear(resolve, reject),
				onMerge: this.onPromiseMerge(resolve, reject)
			});
		});
	}

	/**
	 * Promise for setImmediate
	 *
	 * @param [params] - additional parameters for the operation:
	 *   *) [join] - strategy for joining competitive tasks (with same labels):
	 *       *) true - all tasks will be joined to the first;
	 *       *) 'replace' - all tasks will be joined (replaced) to the last.
	 *
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 */
	nextTick(params?: AsyncOpts): Promise<void> {
		return new Promise((resolve, reject) => {
			this.setImmediate(resolve, {
				...<any>params,
				onClear: this.onPromiseClear(resolve, reject),
				onMerge: this.onPromiseMerge(resolve, reject)
			});
		});
	}

	/**
	 * Promise for requestIdleCallback
	 *
	 * @param [params] - additional parameters for the operation:
	 *   *) [timeout] - timeout value for the native requestIdleCallback
	 *   *) [join] - strategy for joining competitive tasks (with same labels):
	 *       *) true - all tasks will be joined to the first;
	 *       *) 'replace' - all tasks will be joined (replaced) to the last.
	 *
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 */
	idle(params?: AsyncIdleOpts): Promise<IdleDeadline> {
		return new Promise((resolve, reject) => {
			this.requestIdleCallback(resolve, {
				...<any>params,
				onClear: this.onPromiseClear(resolve, reject),
				onMerge: this.onPromiseMerge(resolve, reject)
			});
		});
	}

	/**
	 * Waits until the specified function returns a positive value (== true)
	 *
	 * @param fn
	 * @param [params] - additional parameters for the operation:
	 *   *) [join] - strategy for joining competitive tasks (with same labels):
	 *       *) true - all tasks will be joined to the first;
	 *       *) 'replace' - all tasks will be joined (replaced) to the last.
	 *
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [delay] - delay in milliseconds
	 */
	wait(fn: Function, params?: AsyncWaitOpts): Promise<boolean> {
		const
			DELAY = params && params.delay || 50;

		return new Promise((resolve, reject) => {
			if (fn()) {
				resolve(true);
				return;
			}

			let id;
			const cb = () => {
				if (fn()) {
					resolve(true);
					this.clearInterval(id);
				}
			};

			id = this.setInterval(cb, DELAY, <any>{
				...params,
				onClear: this.onPromiseClear(resolve, reject),
				onMerge: this.onPromiseMerge(resolve, reject)
			});
		});
	}

	/**
	 * Wrapper for an event emitter add listener
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param handler - event handler
	 * @param [args] - additional arguments for the emitter
	 */
	on<T>(emitter: T & EventEmitterLikeP, events: string | string[], handler: Function, ...args: any[]): object;

	/**
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param handler - event handler
	 * @param params - parameters for the operation:
	 *   *) [options] - additional options for addEventListener
	 *   *) [join] - if true, then competitive tasks (with same labels) will be joined to the first
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [single] - if true, then after first invocation the event listener will be removed
	 *   *) [onClear] - clear handler
	 *
	 * @param [args] - additional arguments for the emitter
	 */
	on<T>(
		emitter: T & EventEmitterLikeP,
		events: string | string[],
		handler: Function,
		params: AsyncOnOpts<CTX>,
		...args: any[]
	): object;

	// tslint:disable-next-line
	on(emitter, events, cb, p, ...args) {
		if (p !== undefined && !Object.isObject(p)) {
			args.unshift(p);
			p = undefined;
		}

		p = p || {};
		events = Object.isArray(events) ? events : events.split(/\s+/);

		if (p.options) {
			p.single = p.options.once = 'single' in p ? p.single : p.options.once;
			args.unshift(p.options);
			p.options = undefined;
		}

		const
			that = this,
			links: any[] = [];

		for (let i = 0; i < events.length; i++) {
			const
				event = events[i];

			links.push(this.setAsync({
				...p,
				name: 'eventListener',
				obj: cb,
				wrapper(cb: Function): any {
					const handler = function (this: any): any {
						if (p.single && !emitter.once) {
							that.eventListenerDestructor({emitter, event, handler, args});
						}

						const
							res = cb.apply(this, arguments);

						if (Object.isPromise(res)) {
							res.catch(stderr);
						}

						return res;
					};

					const
						fn = p.single && emitter.once || emitter.addEventListener || emitter.addListener || emitter.on;

					if (Object.isFunction(fn)) {
						fn.call(emitter, event, handler, ...args);

					} else {
						throw new ReferenceError('Add event listener function for the event emitter is not defined');
					}

					return {
						event,
						emitter,
						handler,
						args
					};
				},

				clearFn: this.eventListenerDestructor,
				linkByWrapper: true,
				periodic: !p.single,
				group: p.group || event
			}));
		}

		return events.length === 1 ? links[0] : links;
	}

	/**
	 * Wrapper for an event emitter once
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param handler - event handler
	 * @param [args] - additional arguments for the emitter
	 */
	once<T>(emitter: T & EventEmitterLikeP, events: string | string[], handler: Function, ...args: any[]): object;

	/**
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param handler - event handler
	 * @param params - parameters for the operation:
	 *   *) [options] - additional options for addEventListener
	 *   *) [join] - if true, then competitive tasks (with same labels) will be joined to the first
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [onClear] - clear handler
	 *
	 * @param [args] - additional arguments for the emitter
	 */
	once<T>(
		emitter: T & EventEmitterLikeP,
		events: string | string[],
		handler: Function,
		params: AsyncOnceOpts<CTX>,
		...args: any[]
	): object;

	// tslint:disable-next-line
	once(emitter, events, handler, p, ...args) {
		if (p !== undefined && !Object.isObject(p)) {
			args.unshift(p);
			p = undefined;
		}

		return this.on(emitter, events, handler, {...p, single: true}, ...args);
	}

	/**
	 * Promise for once
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param params - parameters for the operation:
	 *   *) [options] - additional options for addEventListener
	 *   *) [join] - strategy for joining competitive tasks (with same labels):
	 *       *) true - all tasks will be joined to the first;
	 *       *) 'replace' - all tasks will be joined (replaced) to the last.
	 *
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *
	 * @param [args] - additional arguments for the emitter
	 */
	promisifyOnce<T>(
		emitter: T & EventEmitterLikeP,
		events: string | string[],
		params: AsyncOpts & {options?: AddEventListenerOptions},
		...args: any[]
	): Promise<any>;

	/**
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param [args] - additional arguments for the emitter
	 */
	promisifyOnce<T>(emitter: T & EventEmitterLikeP, events: string | string[], ...args: any[]): Promise<any>;

	// tslint:disable-next-line
	promisifyOnce(emitter, events, p, ...args) {
		if (p !== undefined && !Object.isObject(p)) {
			args.unshift(p);
			p = undefined;
		}

		return new Promise((resolve, reject) => {
			this.once(emitter, events, resolve, {
				...p,
				onClear: this.onPromiseClear(resolve, reject),
				onMerge: this.onPromiseMerge(resolve, reject)
			}, ...args);
		});
	}

	/**
	 * Wrapper for an event emitter remove listener
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	off(id?: object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	off(params: ClearOptsId<object>): this;

	// tslint:disable-next-line
	off(p) {
		return this.clearAsync(Object.isObject(p) && Object.isString(p.event) ? {id: p} : p, 'eventListener');
	}

	/**
	 * Mutes an event operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	muteEventListeners(id?: object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteEventListeners(params: ClearOptsId<object>): this;

	// tslint:disable-next-line
	muteEventListeners(p) {
		return this.markAsync(
			'muted',
			Object.isObject(p) && Object.isString(p.event) ? {id: p} : p,
			'eventListener'
		);
	}

	/**
	 * Unmutes an event operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unmuteEventListeners(id?: object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteEventListeners(params: ClearOptsId<object>): this;

	// tslint:disable-next-line
	unmuteEventListeners(p) {
		return this.markAsync(
			'!muted',
			Object.isObject(p) && Object.isString(p.event) ? {id: p} : p,
			'eventListener'
		);
	}

	/**
	 * Suspends an event operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	suspendEventListeners(id?: object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendEventListeners(params: ClearOptsId<object>): this;

	// tslint:disable-next-line
	suspendEventListeners(p) {
		return this.markAsync(
			'paused',
			Object.isObject(p) && Object.isString(p.event) ? {id: p} : p,
			'eventListener'
		);
	}

	/**
	 * Unsuspends an event operation
	 * @param [id] - operation id (if not defined will be remove all handlers)
	 */
	unsuspendEventListeners(id?: object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendEventListeners(params: ClearOptsId<object>): this;

	// tslint:disable-next-line
	unsuspendEventListeners(p) {
		return this.markAsync(
			'!paused',
			Object.isObject(p) && Object.isString(p.event) ? {id: p} : p,
			'eventListener'
		);
	}

	/**
	 * Clears all async operations
	 *
	 * @param [params] - additional parameters for the operation:
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearAll(params?: ClearOpts): this {
		const
			p: any = params;

		this
			.off(p);

		this
			.clearImmediate(p)
			.clearInterval(p)
			.clearTimeout(p)
			.cancelIdleCallback(p);

		this
			.cancelRequest(p)
			.terminateWorker(p)
			.cancelProxy(p);

		return this;
	}

	/**
	 * Mutes all async operations
	 *
	 * @param [params] - additional parameters for the operation:
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteAll(params?: ClearOpts): this {
		const
			p: any = params;

		this
			.muteEventListeners(p);

		this
			.muteImmediate(p)
			.muteInterval(p)
			.muteTimeout(p)
			.muteIdleCallback(p);

		this
			.muteRequest(p)
			.muteProxy(p);

		return this;
	}

	/**
	 * Unmutes all async operations
	 *
	 * @param [params] - additional parameters for the operation:
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteAll(params?: ClearOpts): this {
		const
			p: any = params;

		this
			.unmuteEventListeners(p);

		this
			.unmuteImmediate(p)
			.unmuteInterval(p)
			.unmuteTimeout(p)
			.unmuteIdleCallback(p);

		this
			.unmuteRequest(p)
			.unmuteProxy(p);

		return this;
	}

	/**
	 * Suspends all async operations
	 *
	 * @param [params] - additional parameters for the operation:
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendAll(params?: ClearOpts): this {
		const
			p: any = params;

		this
			.suspendEventListeners(p);

		this
			.suspendImmediate(p)
			.suspendInterval(p)
			.suspendTimeout(p)
			.suspendIdleCallback(p);

		this
			.suspendRequest(p)
			.suspendProxy(p);

		return this;
	}

	/**
	 * Unsuspends all async operations
	 *
	 * @param [params] - additional parameters for the operation:
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendAll(params?: ClearOpts): this {
		const
			p: any = params;

		this
			.unsuspendEventListeners(p);

		this
			.unsuspendImmediate(p)
			.unsuspendInterval(p)
			.unsuspendTimeout(p)
			.unsuspendIdleCallback(p);

		this
			.unsuspendRequest(p)
			.unsuspendProxy(p);

		return this;
	}

	/**
	 * Removes an event handler from the specified emitter
	 *
	 * @param params - parameters:
	 *   *) emitter - event emitter
	 *   *) event - event name
	 *   *) handler - event handler
	 *   *) args - additional arguments for the emitter
	 */
	protected eventListenerDestructor<T>(params: {
		emitter: T & EventEmitterLikeP;
		event: string;
		handler: Function;
		args: any[];
	}): void {
		const
			e = params.emitter,
			fn = Object.isFunction(e) ? e : e.removeEventListener || e.removeListener || e.off;

		if (fn && Object.isFunction(fn)) {
			fn.call(e, params.event, params.handler);

		} else {
			throw new ReferenceError('Remove event listener function for the event emitter is not defined');
		}
	}

	/**
	 * Terminates the specified worker
	 *
	 * @param destructor - name of destructor method
	 * @param worker
	 */
	protected workerDestructor<T>(destructor: string | undefined, worker: T & WorkerLikeP): void {
		const
			{workerCache} = this;

		if (workerCache.has(worker)) {
			workerCache.delete(worker);

			if (--worker[asyncCounter] <= 0) {
				let fn;

				if (destructor) {
					fn = destructor;

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
					throw new ReferenceError('Destructor function for the worker is not defined');
				}
			}
		}
	}

	/**
	 * Aborts the specified promise
	 * @param promise
	 */
	protected promiseDestructor<T>(promise: PromiseLike<T> | CancelablePromise<T>): void {
		if ('abort' in promise || 'cancel' in promise) {
			const
				fn = (promise.abort || promise.cancel);

			if (!fn || !Object.isFunction(fn)) {
				return;
			}

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
	protected onPromiseClear(resolve: Function, reject: Function): Function {
		const
			MAX_PROMISE_DEPTH = 25;

		return (obj) => {
			const
				{replacedBy} = obj;

			if (replacedBy && obj.join === 'replace' && obj.link.onClear.length < MAX_PROMISE_DEPTH) {
				replacedBy.onComplete.push([resolve, reject]);

				const
					onClear = (<Function[]>[]).concat(obj.link.onClear, reject);

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
	protected onPromiseMerge(resolve: Function, reject: Function): Function {
		return (obj) => obj.onComplete.push([resolve, reject]);
	}

	/**
	 * Returns a cache object by the specified name
	 * @param name
	 */
	protected initCache(name: string): CacheObject {
		return this.cache[name] = this.cache[name] || {
			root: {
				labels: Object.createDict(),
				links: new Map()
			},

			groups: Object.createDict()
		};
	}

	/**
	 * Initializes the specified listener
	 * @param p
	 */
	protected setAsync(p: Dictionary): any {
		const
			baseCache = this.initCache(p.name);

		let cache;
		if (p.group) {
			baseCache.groups[p.group] = baseCache.groups[p.group] || {
				labels: Object.createDict(),
				links: new Map()
			};

			cache = baseCache.groups[p.group];

		} else {
			cache = baseCache.root;
		}

		const
			{labels, links} = cache,
			labelCache = labels[p.label];

		if (labelCache && p.join === true) {
			const
				mergeHandlers = <AsyncMergeHandler<CTX>[]>[].concat(p.onMerge || []),
				ctx = links.get(labelCache);

			for (let i = 0; i < mergeHandlers.length; i++) {
				mergeHandlers[i].call(this.context || this, ctx);
			}

			return labelCache;
		}

		const
			ctx = this.context;

		let
			id,
			finalObj,
			wrappedObj = id = finalObj = p.needCall && Object.isFunction(p.obj) ? p.obj.call(ctx || this) : p.obj;

		if (!p.periodic || Object.isFunction(wrappedObj)) {
			wrappedObj = function (this: any): any {
				const
					args = arguments,
					link = links.get(id),
					fnCtx = ctx || this;

				if (!link || link.muted) {
					return;
				}

				if (!p.periodic) {
					if (link.paused) {
						link.muted = true;

					} else {
						links.delete(id);
						labels[p.label] = undefined;
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
					needDelete = !p.periodic && link.paused;

				const exec = () => {
					if (needDelete) {
						links.delete(id);
						labels[p.label] = undefined;
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

		if (p.wrapper) {
			const
				link = p.wrapper.apply(null, [wrappedObj].concat(p.needCall ? id : [], p.args));

			if (p.linkByWrapper) {
				id = link;
			}
		}

		const link = {
			id,
			obj: p.obj,
			objName: p.obj.name,
			label: p.label,
			paused: false,
			muted: false,
			queue: [],
			clearFn: p.clearFn,
			onComplete: [],
			onClear: <AsyncClearHandler<CTX>[]>[].concat(p.onClear || [])
		};

		if (labelCache) {
			this.clearAsync({...p, replacedBy: link});
		}

		links.set(id, link);

		if (p.label) {
			labels[p.label] = id;
		}

		return id;
	}

	/**
	 * Clears the specified listeners
	 *
	 * @param p
	 * @param [name]
	 */
	protected clearAsync(p: Dictionary, name?: string): this {
		if (name) {
			if (p === undefined) {
				return this.clearAllAsync({name});
			}

			p = Object.isObject(p) ? {...p, name} : {name, id: p};
		}

		const
			baseCache = this.initCache(p.name);

		let cache;
		if (p.group) {
			if (Object.isRegExp(p.group)) {
				const
					obj = baseCache.groups,
					keys = <string[]>Object.keys(obj);

				for (let i = 0; i < keys.length; i++) {
					const
						group = keys[i];

					if (p.group.test(group)) {
						this.clearAsync({...p, group});
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
				links.delete(link.id);
				labels[link.label] = undefined;

				const ctx = {
					...p,
					link,
					type: 'clearAsync'
				};

				const
					clearHandlers = link.onClear,
					clearFn = p.clearFn || link.clearFn;

				for (let i = 0; i < clearHandlers.length; i++) {
					clearHandlers[i].call(this.context || this, ctx);
				}

				if (clearFn) {
					clearFn.call(null, link.id, ctx);
				}
			}

		} else {
			const
				values = links.values();

			for (let el = values.next(); !el.done; el = values.next()) {
				this.clearAsync({...p, id: el.value.id});
			}
		}

		return this;
	}

	/**
	 * Clears all listeners by the specified parameters
	 * @param p
	 */
	protected clearAllAsync(p: Dictionary): this {
		this.clearAsync.apply(this, arguments);

		const
			obj = this.initCache(p.name).groups,
			keys = Object.keys(obj);

		for (let i = 0; i < keys.length; i++) {
			this.clearAsync({...p, group: keys[i]});
		}

		return this;
	}

	/**
	 * Marks the specified listeners as a field
	 *
	 * @param field
	 * @param p
	 * @param [name]
	 */
	protected markAsync(field: string, p: Dictionary, name?: string): this {
		if (name) {
			if (p === undefined) {
				return this.markAllAsync(field, {name});
			}

			p = Object.isObject(p) ? {...p, name} : {name, id: p};
		}

		const
			baseCache = this.initCache(p.name);

		let cache;
		if (p.group) {
			if (Object.isRegExp(p.group)) {
				const
					obj = baseCache.groups,
					keys = <string[]>Object.keys(obj);

				for (let i = 0; i < keys.length; i++) {
					const
						group = keys[i];

					if (p.group.test(group)) {
						this.clearAsync({...p, group});
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
				if (field === '!paused') {
					for (let o = link.queue, i = 0; i < o.length; i++) {
						o[i]();
					}

					link.muted = false;
					link.paused = false;
					link.queue = [];

				} else if (field[0] === '!') {
					link[field.slice(1)] = false;

				} else {
					link[field] = true;
				}
			}

		} else {
			const
				values = links.values();

			for (let el = values.next(); !el.done; el = values.next()) {
				this.markAsync(field, {...p, id: el.value.id});
			}
		}

		return this;
	}

	/**
	 * Marks all listeners by the specified parameters as a field
	 *
	 * @param field
	 * @param p
	 */
	protected markAllAsync(field: string, p: Dictionary): this {
		this.markAsync.apply(this, arguments);

		const
			obj = this.initCache(p.name).groups,
			keys = Object.keys(obj);

		for (let i = 0; i < keys.length; i++) {
			this.markAsync(field, {...p, group: keys[i]});
		}

		return this;
	}
}
