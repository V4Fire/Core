/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* tslint:disable:max-file-line-count */

import { createSyncPromise } from 'core/event';

export const
	asyncCounter = Symbol('Async counter id');

export interface AsyncLink<CTX extends object = Async> {
	id: unknown;
	obj: unknown;
	objName?: string;
	label?: string | symbol;
	paused: boolean;
	muted: boolean;
	queue: Function[];
	clearFn?: Function;
	onComplete: AsyncCompleteCb<CTX>[][];
	onClear: AsyncCb<CTX>[];
}

export interface ClearOptions {
	label?: string | symbol;
	group?: string | RegExp;
	preventDefault?: boolean;
}

export interface ClearOptionsId<ID = unknown> extends ClearOptions {
	id?: ID;
}

export interface ClearProxyOptions<ID = unknown> extends ClearOptionsId<ID> {
	name?: string;
}

export interface AsyncOptions {
	join?: boolean | 'replace';
	label?: string | symbol;
	group?: string;
}

export type ClearReasons =
	'id' |
	'label' |
	'collision' |
	'group' |
	'rgxp' |
	'all';

export type AsyncCtx<CTX extends object = Async> = {
	type: string;
	link: AsyncLink<CTX>;
	replacedBy?: AsyncLink<CTX>;
	reason?: ClearReasons;
} & AsyncOptions & ClearOptionsId<unknown>;

export interface AsyncCb<CTX extends object = Async> {
	(this: CTX, ctx: AsyncCtx<CTX>): void;
}

export interface AsyncCompleteCb<CTX extends object = Async> {
	(this: CTX, ...args: unknown[]): void;
}

export interface AsyncCbOptions<CTX extends object = Async> extends AsyncOptions {
	promise?: boolean;
	onClear?: CanArray<AsyncCb<CTX>>;
	onMerge?: CanArray<AsyncCb<CTX>>;
}

export interface AsyncCbOptionsSingle<CTX extends object = Async> extends AsyncCbOptions<CTX> {
	single?: boolean;
}

export interface AsyncProxyOptions<CTX extends object = Async> extends AsyncCbOptionsSingle<CTX> {
	name?: string;
}

export interface AsyncPromiseOptions extends AsyncOptions {
	name?: string;
	destructor?: string;
}

export interface AsyncRequestOptions extends AsyncOptions {
	destructor?: string;
}

export interface AsyncCreateIdleOptions<CTX extends object = Async> extends AsyncCbOptions<CTX> {
	timeout?: number;
}

export interface AsyncIdleOptions extends AsyncOptions {
	timeout?: number;
}

export interface AsyncWaitOptions extends AsyncOptions {
	delay?: number;
}

export interface AsyncOnOptions<CTX extends object = Async> extends AsyncCbOptionsSingle<CTX> {
	options?: AddEventListenerOptions;
}

export interface AsyncOnceOptions<T extends object = Async> extends AsyncCbOptions<T> {
	options?: AddEventListenerOptions;
}

export interface AsyncPromisifyOnceOptions<
	E = unknown,
	R = unknown,
	CTX extends object = Async
> extends AsyncOptions {
	handler: ProxyCb<E, R, CTX>;
	options?: AddEventListenerOptions;
}

export interface AsyncWorkerOptions<CTX extends object = Async> extends AsyncProxyOptions<CTX> {
	destructor?: string;
}

export type TimerId = number | object;
export type EventId = CanArray<object>;

export interface LocalCacheObject {
	labels: Dictionary;
	links: Map<unknown, unknown>;
}

export interface CacheObject {
	root: LocalCacheObject;
	groups: Dictionary<LocalCacheObject>;
}

export interface EventLike<E extends EventEmitterLikeP = EventEmitterLikeP> {
	emitter: E;
	event: string;
	handler: ProxyCb;
	args: unknown[];
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
export interface WrappedFunction<CTX extends object = Async> extends Function {
	(this: CTX, ...args: any[]): any;
}

export type ProxyCb<A = unknown, R = unknown, CTX extends object = Async> = A extends never ?
	((this: CTX) => R) : A extends unknown[] ?
		((this: CTX, ...args: A) => R) : ((this: CTX, e: A) => R) | Function;

export type IdleCb<R = unknown, CTX extends object = Async> = ProxyCb<IdleDeadline, R, CTX>;

export interface CancelablePromise<T = unknown> extends Promise<T> {
	abort?: Function;
	cancel?: Function;
}

export enum LinkNames {
	proxy,
	proxyPromise,
	promise,
	request,
	idleCallback,
	idleCallbackPromise,
	timeout,
	timeoutPromise,
	interval,
	intervalPromise,
	immediate,
	immediatePromise,
	worker,
	eventListener,
	eventListenerPromise
}

export const
	isPromisifyLinkName = /Promise$/,
	isZombieGroup = /:zombie\b/,
	linkNamesDictionary = Object.convertEnumToDict(LinkNames);

export type Link = keyof typeof LinkNames;
export type LinkNamesList = typeof linkNamesDictionary;

/**
 * Returns true if the specified value is instance of AsyncOptions
 * @param value
 */
export function isParams<T = AsyncOptions>(value: unknown): value is T {
	return Object.isObject(value);
}

/**
 * Returns true if the specified value is instance of EventLike
 * @param value
 */
export function isEvent(value: unknown): value is EventLike {
	return Object.isObject(value) && Object.isString((<any>value).event);
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
	 * Object with default names of async operations
	 */
	static linkNames: LinkNamesList = linkNamesDictionary;

	/**
	 * Lock status
	 */
	locked: boolean = false;

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
	protected readonly context: CTX;

	/**
	 * Link for Async.linkNames
	 */
	protected get linkNames(): LinkNamesList {
		return (<typeof Async>this.constructor).linkNames;
	}

	/**
	 * @param [ctx] - context for functions
	 */
	constructor(ctx?: CTX) {
		this.context = ctx || <any>this;
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
	 *   *) [onMerge] - merge handler (join: true)
	 */
	setImmediate(fn: Function, params?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		const
			// tslint:disable-next-line
			wrapper = globalThis['setImmediate'],

			// tslint:disable-next-line
			clearFn = globalThis['clearImmediate'];

		return this.setAsync({
			...params,
			name: this.linkNames.immediate,
			obj: fn,
			clearFn,
			wrapper,
			linkByWrapper: true
		});
	}

	/**
	 * Wrapper for clearImmediate
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	clearImmediate(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearImmediate(params: ClearOptionsId<TimerId>): this;
	clearImmediate(p: any): this {
		return this.clearAsync(p, this.linkNames.immediate);
	}

	/**
	 * Mutes a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteImmediate(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteImmediate(params: ClearOptionsId<TimerId>): this;
	muteImmediate(p: any): this {
		return this.markAsync('muted', p, this.linkNames.immediate);
	}

	/**
	 * Unmutes a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all handlers)
	 */
	unmuteImmediate(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteImmediate(params: ClearOptionsId<TimerId>): this;
	unmuteImmediate(p: any): this {
		return this.markAsync('!muted', p, this.linkNames.immediate);
	}

	/**
	 * Suspends a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendImmediate(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendImmediate(params: ClearOptionsId<TimerId>): this;
	suspendImmediate(p: any): this {
		return this.markAsync('paused', p, this.linkNames.immediate);
	}

	/**
	 * Unsuspends a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendImmediate(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendImmediate(params: ClearOptionsId<TimerId>): this;
	unsuspendImmediate(p: any): this {
		return this.markAsync('!paused', p, this.linkNames.immediate);
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
	 *   *) [onMerge] - merge handler (join: true)
	 */
	setInterval(fn: Function, interval: number, params?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		return this.setAsync({
			...params,
			name: this.linkNames.interval,
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
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	clearInterval(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearInterval(params: ClearOptionsId<TimerId>): this;
	clearInterval(p: any): this {
		return this.clearAsync(p, this.linkNames.interval);
	}

	/**
	 * Mutes a setInterval operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteInterval(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteInterval(params: ClearOptionsId<TimerId>): this;
	muteInterval(p: any): this {
		return this.markAsync('!muted', p, this.linkNames.interval);
	}

	/**
	 * Unmutes a setInterval operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteInterval(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteInterval(params: ClearOptionsId<TimerId>): this;
	unmuteInterval(p: any): this {
		return this.markAsync('!muted', p, this.linkNames.interval);
	}

	/**
	 * Suspends a setInterval operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendInterval(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendInterval(params: ClearOptionsId<TimerId>): this;
	suspendInterval(p: any): this {
		return this.markAsync('paused', p, this.linkNames.interval);
	}

	/**
	 * Unsuspends a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendInterval(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendInterval(params: ClearOptionsId<TimerId>): this;
	unsuspendInterval(p: any): this {
		return this.markAsync('!paused', p, this.linkNames.interval);
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
	 *   *) [onMerge] - merge handler (join: true)
	 */
	setTimeout(fn: Function, timer: number, params?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		return this.setAsync({
			...params,
			name: this.linkNames.timeout,
			obj: fn,
			clearFn: clearTimeout,
			wrapper: setTimeout,
			linkByWrapper: true,
			args: [timer]
		});
	}

	/**
	 * Wrapper for clearTimeout
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	clearTimeout(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearTimeout(params: ClearOptionsId<TimerId>): this;
	clearTimeout(p: any): this {
		return this.clearAsync(p, this.linkNames.timeout);
	}

	/**
	 * Mutes a setTimeout operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteTimeout(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteTimeout(params: ClearOptionsId<TimerId>): this;
	muteTimeout(p: any): this {
		return this.markAsync('muted', p, this.linkNames.timeout);
	}

	/**
	 * Unmutes a setTimeout operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteTimeout(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteTimeout(params: ClearOptionsId<TimerId>): this;
	unmuteTimeout(p: any): this {
		return this.markAsync('!muted', p, this.linkNames.timeout);
	}

	/**
	 * Suspends a setTimeout operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendTimeout(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendTimeout(params: ClearOptionsId<TimerId>): this;
	suspendTimeout(p: any): this {
		return this.markAsync('paused', p, this.linkNames.timeout);
	}

	/**
	 * Unsuspends a setTimeout operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendTimeout(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendTimeout(params: ClearOptionsId<TimerId>): this;
	unsuspendTimeout(p: any): this {
		return this.markAsync('!paused', p, this.linkNames.timeout);
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
	 *   *) [onMerge] - merge handler (join: true)
	 */
	requestIdleCallback<R = unknown>(
		fn: IdleCb<R, CTX>,
		params?: AsyncCreateIdleOptions<CTX>
	): Nullable<TimerId> {
		let
			wrapper,
			clearFn;

		if (typeof requestIdleCallback !== 'function') {
			wrapper = (fn) => setTimeout(() => fn({timeRemaining: () => 0}), 50);
			clearFn = clearTimeout;

		} else {
			wrapper = requestIdleCallback;
			clearFn = cancelIdleCallback;
		}

		return this.setAsync({
			...params && Object.reject(params, 'timeout'),
			name: this.linkNames.idleCallback,
			obj: fn,
			clearFn,
			wrapper,
			linkByWrapper: true,
			args: params && Object.select(params, 'timeout')
		});
	}

	/**
	 * Wrapper for cancelIdleCallback
	 *
	 * @alias
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	cancelIdleCallback(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	cancelIdleCallback(params: ClearOptionsId<TimerId>): this;
	cancelIdleCallback(p: any): this {
		return this.clearIdleCallback(p);
	}

	/**
	 * Wrapper for cancelIdleCallback
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	clearIdleCallback(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearIdleCallback(params: ClearOptionsId<TimerId>): this;
	clearIdleCallback(p: any): this {
		return this.clearAsync(p, this.linkNames.idleCallback);
	}

	/**
	 * Mutes a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteIdleCallback(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteIdleCallback(params: ClearOptionsId<TimerId>): this;
	muteIdleCallback(p: any): this {
		return this.markAsync('muted', p, this.linkNames.idleCallback);
	}

	/**
	 * Unmutes a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteIdleCallback(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteIdleCallback(params: ClearOptionsId<TimerId>): this;
	unmuteIdleCallback(p: any): this {
		return this.markAsync('!muted', p, this.linkNames.idleCallback);
	}

	/**
	 * Suspends a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendIdleCallback(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendIdleCallback(params: ClearOptionsId<TimerId>): this;
	suspendIdleCallback(p: any): this {
		return this.markAsync('paused', p, this.linkNames.idleCallback);
	}

	/**
	 * Unsuspends a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendIdleCallback(id?: TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendIdleCallback(params: ClearOptionsId<TimerId>): this;
	unsuspendIdleCallback(p: any): this {
		return this.markAsync('!paused', p, this.linkNames.idleCallback);
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
	 *   *) [onMerge] - merge handler (join: true)
	 */
	worker<T extends WorkerLikeP>(worker: T, params?: AsyncWorkerOptions<CTX>): T {
		const
			p = params || {},
			{workerCache} = this;

		if (!workerCache.has(worker)) {
			workerCache.set(worker, true);
			worker[asyncCounter] = (worker[asyncCounter] || 0) + 1;
		}

		return this.setAsync({
			...p,
			name: this.linkNames.worker,
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
	terminateWorker(id?: WorkerLikeP): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - link for the worker
	 *   *) [label] - label for the task
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	terminateWorker(params: ClearProxyOptions<WorkerLikeP>): this;
	terminateWorker(p: any): this {
		return this.clearWorker(p);
	}

	/**
	 * Terminates the specified worker
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	clearWorker(id?: WorkerLikeP): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - link for the worker
	 *   *) [label] - label for the task
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearWorker(params: ClearProxyOptions<WorkerLikeP>): this;
	clearWorker(p: any): this {
		return this.clearAsync(p, isParams<ClearProxyOptions>(p) && p.name || this.linkNames.worker);
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
	request<T = unknown>(request: (() => PromiseLike<T>) | PromiseLike<T>, params?: AsyncRequestOptions): Promise<T> {
		return this.promise(request, {...params, name: this.linkNames.request}) || new Promise<T>(() => undefined);
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
	cancelRequest(params: ClearOptionsId<Promise<unknown>>): this;
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
	clearRequest(params: ClearOptionsId<Promise<unknown>>): this;
	clearRequest(p: any): this {
		return this.clearAsync(p, this.linkNames.request);
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
	muteRequest(params: ClearOptionsId<Promise<unknown>>): this;
	muteRequest(p: any): this {
		return this.markAsync('muted', p, this.linkNames.request);
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
	unmuteRequest(params: ClearOptionsId<Promise<unknown>>): this;
	unmuteRequest(p: any): this {
		return this.markAsync('!muted', p, this.linkNames.request);
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
	suspendRequest(params: ClearOptionsId<Promise<unknown>>): this;
	suspendRequest(p: any): this {
		return this.markAsync('paused', p, this.linkNames.request);
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
	unsuspendRequest(params: ClearOptionsId<Promise<unknown>>): this;
	unsuspendRequest(p: any): this {
		return this.markAsync('!paused', p, this.linkNames.request);
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
	proxy<T extends WrappedFunction, CTX extends object = Async>(cb: T, params?: AsyncProxyOptions<CTX>): T {
		const p = params || {};
		return this.setAsync({
			...p,
			name: p.name || this.linkNames.proxy,
			obj: cb,
			wrapper: (fn) => fn,
			linkByWrapper: true,
			periodic: p.single === false
		}) || (() => undefined);
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
	cancelProxy(params: ClearProxyOptions<Function>): this;
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
	clearProxy(params: ClearProxyOptions<Function>): this;
	clearProxy(p: any): this {
		return this.clearAsync(p, isParams<ClearProxyOptions>(p) && p.name || this.linkNames.proxy);
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
	muteProxy(params: ClearProxyOptions<Function>): this;
	muteProxy(p: any): this {
		return this.markAsync('muted', p, isParams<ClearProxyOptions>(p) && p.name || this.linkNames.proxy);
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
	unmuteProxy(params: ClearProxyOptions<Function>): this;
	unmuteProxy(p: any): this {
		return this.markAsync('!muted', p, isParams<ClearProxyOptions>(p) && p.name || this.linkNames.proxy);
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
	suspendProxy(params: ClearProxyOptions<Function>): this;
	suspendProxy(p: any): this {
		return this.markAsync('paused', p, isParams<ClearProxyOptions>(p) && p.name || this.linkNames.proxy);
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
	unsuspendProxy(params: ClearProxyOptions<Function>): this;
	unsuspendProxy(p: any): this {
		return this.markAsync('!paused', p, isParams<ClearProxyOptions>(p) && p.name || this.linkNames.proxy);
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
	promise<T = unknown>(promise: (() => PromiseLike<T>) | PromiseLike<T>, params?: AsyncPromiseOptions): Promise<T> {
		const
			p = <AsyncPromiseOptions>({name: this.linkNames.promise, ...params});

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
	cancelPromise(params: ClearProxyOptions<Function>): this;
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
	clearPromise(params: ClearProxyOptions<Function>): this;
	clearPromise(p: any): this {
		const
			nms = this.linkNames,
			nm = isParams<ClearProxyOptions>(p) && p.name;

		this
			.clearAsync(p, nm || nms.promise);

		if (!nm) {
			for (let keys = Object.keys(nms), i = 0; i < keys.length; i++) {
				const
					key = keys[i],
					nm = nms[key];

				if (nm && isPromisifyLinkName.test(key)) {
					this.clearAsync(p, nm);
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
	mutePromise(params: ClearOptionsId<Function>): this;
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
	unmutePromise(params: ClearOptionsId<Function>): this;
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
	suspendPromise(params: ClearOptionsId<Function>): this;
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
	unsuspendPromise(params: ClearOptionsId<Function>): this;
	unsuspendPromise(p: any): this {
		return this.markPromise('!paused', p);
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
	sleep(timer: number, params?: AsyncOptions): Promise<void> {
		return new Promise((resolve, reject) => {
			this.setTimeout(resolve, timer, {
				...<any>params,
				promise: true,
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
	nextTick(params?: AsyncOptions): Promise<void> {
		return new Promise((resolve, reject) => {
			this.setImmediate(resolve, {
				...<any>params,
				promise: true,
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
	idle(params?: AsyncIdleOptions): Promise<IdleDeadline> {
		return new Promise((resolve, reject) => {
			this.requestIdleCallback(resolve, {
				...<any>params,
				promise: true,
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
	wait(fn: Function, params?: AsyncWaitOptions): Promise<boolean> {
		const
			DELAY = params?.delay || 15;

		if (fn()) {
			if (params?.label) {
				this.clearPromise(params);
			}

			return createSyncPromise(true);
		}

		return new Promise((resolve, reject) => {
			let
				id;

			const cb = () => {
				if (fn()) {
					resolve(true);
					this.clearPromise(id);
				}
			};

			id = this.setInterval(cb, DELAY, {
				...<any>params,
				promise: true,
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
	on<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		...args: unknown[]
	): Nullable<EventId>;

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
	 *   *) [onMerge] - merge handler (join: true)
	 *
	 * @param [args] - additional arguments for the emitter
	 */
	on<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		params: AsyncOnOptions<CTX>,
		...args: unknown[]
	): Nullable<EventId>;

	on<E, R>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		cb: ProxyCb<E, R, CTX>,
		p: any,
		...args: unknown[]
	): Nullable<EventId> {
		if (p !== undefined && !Object.isObject(p)) {
			args.unshift(p);
			p = undefined;
		}

		p = {...p};
		events = Object.isArray(events) ? events : events.split(/\s+/);

		if (p.options) {
			p.single = p.options.once = 'single' in p ? p.single : p.options.once;
			args.unshift(p.options);
			p.options = undefined;
		}

		const
			that = this,
			links: object[] = [],
			multEvent = events.length > 1;

		for (let i = 0; i < events.length; i++) {
			const
				event = events[i];

			const link = this.setAsync({
				...p,
				name: this.linkNames.eventListener,
				obj: cb,
				wrapper(cb: Function): unknown {
					const handler = function (this: unknown): unknown {
						if (Object.isFunction(emitter) || p.single && (multEvent || !emitter.once)) {
							if (multEvent) {
								that.clearEventListener(links);

							} else {
								that.eventListenerDestructor({emitter, event, handler, args});
							}
						}

						const
							res = cb.apply(this, arguments);

						if (Object.isPromise(res)) {
							res.catch(stderr);
						}

						return res;
					};

					const fn = Object.isFunction(emitter) ?
						emitter : p.single && emitter.once || emitter.addEventListener || emitter.addListener || emitter.on;

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
			});

			if (link) {
				links.push(link);
			}
		}

		return events.length <= 1 ? links[0] || null : links;
	}

	/**
	 * Wrapper for an event emitter once
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param handler - event handler
	 * @param [args] - additional arguments for the emitter
	 */
	once<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		...args: unknown[]
	): Nullable<EventId>;

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
	 *   *) [onMerge] - merge handler (join: true)
	 *
	 * @param [args] - additional arguments for the emitter
	 */
	once<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		params: AsyncOnceOptions<CTX>,
		...args: unknown[]
	): Nullable<EventId>;

	once<E, R>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		p: any,
		...args: unknown[]
	): Nullable<EventId> {
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
	 *   *) [handler] - event handler (the result will be provided as a promise result)
	 *
	 * @param [args] - additional arguments for the emitter
	 */
	promisifyOnce<R = unknown, E = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		params: AsyncPromisifyOnceOptions<E, R, CTX>,
		...args: unknown[]
	): Promise<R>;

	/**
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param [args] - additional arguments for the emitter
	 */
	promisifyOnce<R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		...args: unknown[]
	): Promise<R>;

	promisifyOnce<R, E>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		p: any,
		...args: unknown[]
	): Promise<R> {
		if (p !== undefined && !Object.isObject(p)) {
			args.unshift(p);
			p = undefined;
		}

		return new Promise((resolve, reject) => {
			const handler = (e) => {
				if (p && Object.isFunction(p.handler)) {
					return resolve(p.handler.call(this.context, e));
				}

				resolve(e);
			};

			this.once(emitter, events, handler, {
				...p,
				promise: true,
				onClear: this.onPromiseClear(handler, reject),
				onMerge: this.onPromiseMerge(handler, reject)
			}, ...args);
		});
	}

	/**
	 * Wrapper for an event emitter remove listener
	 *
	 * @alias
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	off(id?: EventId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	off(params: ClearOptionsId<EventId>): this;
	off(p: any): this {
		return this.clearEventListener(p);
	}

	/**
	 * Wrapper for an event emitter remove listener
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	clearEventListener(id?: EventId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearEventListener(params: ClearOptionsId<EventId>): this;
	clearEventListener(p: any): this {
		if (Object.isArray(p)) {
			for (let i = 0; i < p.length; i++) {
				this.clearEventListener(<EventId>p[i]);
			}

			return this;
		}

		return this.clearAsync(isEvent(p) ? {id: p} : p, this.linkNames.eventListener);
	}

	/**
	 * Mutes an event operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteEventListener(id?: EventId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteEventListener(params: ClearOptionsId<EventId>): this;
	muteEventListener(p: any): this {
		return this.markEvent('muted', p);
	}

	/**
	 * Unmutes an event operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteEventListener(id?: EventId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteEventListener(params: ClearOptionsId<EventId>): this;
	unmuteEventListener(p: any): this {
		return this.markEvent('!muted', p);
	}

	/**
	 * Suspends an event operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendEventListener(id?: EventId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendEventListener(params: ClearOptionsId<EventId>): this;
	suspendEventListener(p: any): this {
		return this.markEvent('paused', p);
	}

	/**
	 * Unsuspends an event operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendEventListener(id?: EventId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendEventListener(params: ClearOptionsId<EventId>): this;
	unsuspendEventListener(p: any): this {
		return this.markEvent('!paused', p);
	}

	/**
	 * Clears all async operations
	 *
	 * @param [params] - additional parameters for the operation:
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearAll(params?: ClearOptions): this {
		for (let o = this.linkNames, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `clear-${o[keys[i]]}`.camelize(false);

			if (Object.isFunction(this[alias])) {
				this[alias](params);

			} else if (!isPromisifyLinkName.test(alias)) {
				throw new ReferenceError(`Method "${alias}" is not defined`);
			}
		}

		return this;
	}

	/**
	 * Mutes all async operations
	 *
	 * @param [params] - additional parameters for the operation:
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteAll(params?: ClearOptions): this {
		for (let o = this.linkNames, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `mute-${o[keys[i]]}`.camelize(false);

			if (!isPromisifyLinkName.test(alias) && Object.isFunction(this[alias])) {
				this[alias](params);
			}
		}

		return this;
	}

	/**
	 * Unmutes all async operations
	 *
	 * @param [params] - additional parameters for the operation:
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteAll(params?: ClearOptions): this {
		for (let o = this.linkNames, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `unmute-${o[keys[i]]}`.camelize(false);

			if (!isPromisifyLinkName.test(alias) && Object.isFunction(this[alias])) {
				this[alias](params);
			}
		}

		return this;
	}

	/**
	 * Suspends all async operations
	 *
	 * @param [params] - additional parameters for the operation:
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendAll(params?: ClearOptions): this {
		for (let o = this.linkNames, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `suspend-${o[keys[i]]}`.camelize(false);

			if (!isPromisifyLinkName.test(alias) && Object.isFunction(this[alias])) {
				this[alias](params);
			}
		}

		return this;
	}

	/**
	 * Unsuspends all async operations
	 *
	 * @param [params] - additional parameters for the operation:
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendAll(params?: ClearOptions): this {
		for (let o = this.linkNames, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `unsuspend-${o[keys[i]]}`.camelize(false);

			if (!isPromisifyLinkName.test(alias) && Object.isFunction(this[alias])) {
				this[alias](params);
			}
		}

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
	eventListenerDestructor(params: EventLike): void {
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
					throw new ReferenceError('Destructor function for the worker is not defined');
				}
			}
		}
	}

	/**
	 * Aborts the specified promise
	 *
	 * @param destructor - name of destructor method
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
	 * Marks a promise operation as a field
	 *
	 * @param field
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	protected markPromise(field: string, id?: Promise<unknown>): this;

	/**
	 * @param field
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	protected markPromise(field: string, params: ClearOptionsId<Function>): this;
	protected markPromise(field: string, p: any): this {
		const
			nms = this.linkNames,
			nm = isParams<ClearProxyOptions>(p) && p.name;

		this
			.markAsync(field, p, nm || nms.promise);

		if (!nm) {
			for (let keys = Object.keys(nms), i = 0; i < keys.length; i++) {
				const
					key = keys[i],
					nm = nms[key];

				if (nm && isPromisifyLinkName.test(key)) {
					this.markAsync(field, p, nm);
				}
			}
		}

		return this;
	}

	/**
	 * Marks an event operation as a field
	 *
	 * @param field
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	protected markEvent(field: string, id?: EventId): this;

	/**
	 * @param field
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	protected markEvent(field: string, params: ClearOptionsId<EventId>): this;
	protected markEvent(field: string, p: any): this {
		if (Object.isArray(p)) {
			for (let i = 0; i < p.length; i++) {
				this.markEvent(field, <EventId>p[i]);
			}

			return this;
		}

		return this.markAsync(field, isEvent(p) ? {id: p} : p, this.linkNames.eventListener);
	}

	/**
	 * Returns a cache object by the specified name
	 *
	 * @param name
	 * @param [promise] - if true, the the name will marked as promisified
	 */
	protected initCache(name: string, promise?: boolean): CacheObject {
		name = promise ? `${name}Promise` : name;
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
	protected setAsync(p: Dictionary<any>): any {
		if (this.locked) {
			return null;
		}

		const
			baseCache = this.initCache(p.name, p.promise),
			ctx = this.context;

		let
			cache;

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
				mergeHandlers = <AsyncCb<CTX>[]>[].concat(p.onMerge || []),
				link = links.get(labelCache);

			for (let i = 0; i < mergeHandlers.length; i++) {
				mergeHandlers[i].call(ctx, link);
			}

			return labelCache;
		}

		let
			id,
			finalObj,
			wrappedObj = id = finalObj = p.needCall && Object.isFunction(p.obj) ? p.obj.call(ctx) : p.obj;

		if (!p.periodic || Object.isFunction(wrappedObj)) {
			wrappedObj = function (this: unknown): unknown {
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

						if (labels[p.label]) {
							labels[p.label] = undefined;
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
			onClear: <AsyncCb<CTX>[]>[].concat(p.onClear || [])
		};

		if (labelCache) {
			this.clearAsync({...p, replacedBy: link, reason: 'collision'});
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
	protected clearAsync(p: Dictionary<any>, name?: string): this {
		if (name) {
			if (p === undefined) {
				return this.clearAllAsync({name, reason: 'all'});
			}

			p = Object.isObject(p) ? {...p, name} : {name, id: p};
		}

		const
			baseCache = this.initCache(p.name, p.promise);

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
						this.clearAsync({...p, group, reason: 'rgxp'});
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
					clearHandlers[i].call(this.context, ctx);
				}

				if (clearFn && !p.preventDefault) {
					clearFn.call(null, link.id, ctx);
				}
			}

		} else {
			for (let o = links.values(), el = o.next(); !el.done; el = o.next()) {
				this.clearAsync({...p, id: el.value.id});
			}
		}

		return this;
	}

	/**
	 * Clears all listeners by the specified parameters
	 * @param p
	 */
	protected clearAllAsync(p: Dictionary<any>): this {
		this.clearAsync.apply(this, arguments);

		const
			obj = this.initCache(p.name, p.promise).groups,
			keys = Object.keys(obj);

		for (let i = 0; i < keys.length; i++) {
			const
				group = keys[i];

			if (!isZombieGroup.test(group)) {
				this.clearAsync({...p, group});
			}
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
	protected markAsync(field: string, p: Dictionary<any>, name?: string): this {
		if (name) {
			if (p === undefined) {
				return this.markAllAsync(field, {name});
			}

			p = Object.isObject(p) ? {...p, name} : {name, id: p};
		}

		const
			baseCache = this.initCache(p.name);

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
						this.markAsync(field, {...p, group});
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
	protected markAllAsync(field: string, p: Dictionary<any>): this {
		this.markAsync.apply(this, arguments);

		const
			obj = this.initCache(p.name).groups,
			keys = Object.keys(obj);

		for (let i = 0; i < keys.length; i++) {
			const
				group = keys[i];

			if (!isZombieGroup.test(group)) {
				this.markAsync(field, {...p, group});
			}
		}

		return this;
	}
}
