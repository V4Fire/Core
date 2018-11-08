/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* tslint:disable:max-file-line-count */

import { convertEnumToDict } from 'core/helpers';

export const
	asyncCounter = Symbol('Async counter id');

export interface AsyncLink<T extends object = Async> {
	id: unknown;
	obj: unknown;
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
	group?: string | RegExp;
}

export interface ClearOptsId<T = unknown> extends ClearOpts {
	id?: T;
}

export interface ClearProxyOpts<T = unknown> extends ClearOptsId<T> {
	name?: string;
}

export interface AsyncOpts {
	join?: boolean | 'replace';
	label?: string | symbol;
	group?: string;
}

export type AsyncCtx<T extends object = Async> = {
	type: string;
	link: AsyncLink<T>;
	replacedBy?: AsyncLink<T>;
} & AsyncOpts & ClearOptsId<unknown>;

export interface AsyncClearHandler<T extends object = Async> {
	(this: T, ctx: AsyncCtx<T>): void;
}

export interface AsyncCompleteHandler<T extends object = Async> {
	(this: T, ...args: unknown[]): void;
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
	links: Map<unknown, unknown>;
}

export interface CacheObject {
	root: LocalCacheObject;
	groups: Dictionary<LocalCacheObject>;
}

export interface EventLike<T extends EventEmitterLikeP = EventEmitterLikeP> {
	emitter: T;
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

export type ProxyCb<A = unknown, R = unknown, CTX extends object = Async> = A extends never ?
	((this: CTX) => R) : A extends unknown[] ?
		((this: CTX, ...args: A) => R) : ((this: CTX, e: A) => R);

export type IdleCb<R = unknown, CTX extends object = Async> = ProxyCb<IdleDeadline, R, CTX>;

export interface CancelablePromise<T> extends Promise<T> {
	abort?: Function;
	cancel?: Function;
}

export enum LinkNames {
	proxy,
	promise,
	request,
	idleCallback,
	timeout,
	interval,
	immediate,
	worker,
	eventListener
}

export type Link = keyof typeof LinkNames;
export type LinkNamesList = Record<Link, Link> & Dictionary;

export const linkNamesDictionary =
	<Record<Link, Link>>convertEnumToDict(LinkNames);

/**
 * Returns true if the specified value is instance of AsyncOpts
 * @param value
 */
export function isParams<T = AsyncOpts>(value: unknown): value is T {
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
	setImmediate(fn: Function, params?: AsyncCbOpts<CTX>): number | object {
		return this.setAsync({
			...params,
			name: Async.linkNames.idleCallback,
			obj: fn,
			clearFn: clearImmediate,
			wrapper: setImmediate,
			linkByWrapper: true
		});
	}

	/**
	 * Wrapper for clearImmediate
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	clearImmediate(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearImmediate(params: ClearOptsId<number | object>): this;
	clearImmediate(p: any): this {
		return this.clearAsync(p, Async.linkNames.immediate);
	}

	/**
	 * Mutes a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteImmediate(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteImmediate(params: ClearOptsId<number | object>): this;
	muteImmediate(p: any): this {
		return this.markAsync('muted', p, Async.linkNames.immediate);
	}

	/**
	 * Unmutes a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all handlers)
	 */
	unmuteImmediate(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteImmediate(params: ClearOptsId<number | object>): this;
	unmuteImmediate(p: any): this {
		return this.markAsync('!muted', p, Async.linkNames.immediate);
	}

	/**
	 * Suspends a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendImmediate(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendImmediate(params: ClearOptsId<number | object>): this;
	suspendImmediate(p: any): this {
		return this.markAsync('paused', p, Async.linkNames.immediate);
	}

	/**
	 * Unsuspends a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendImmediate(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendImmediate(params: ClearOptsId<number | object>): this;
	unsuspendImmediate(p: any): this {
		return this.markAsync('!paused', p, Async.linkNames.immediate);
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
	setInterval(fn: Function, interval: number, params?: AsyncCbOpts<CTX>): number | object {
		return this.setAsync({
			...params,
			name: Async.linkNames.interval,
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
	clearInterval(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearInterval(params: ClearOptsId<number | object>): this;
	clearInterval(p: any): this {
		return this.clearAsync(p, Async.linkNames.interval);
	}

	/**
	 * Mutes a setInterval operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteInterval(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteInterval(params: ClearOptsId<number | object>): this;
	muteInterval(p: any): this {
		return this.markAsync('!muted', p, Async.linkNames.interval);
	}

	/**
	 * Unmutes a setInterval operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteInterval(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteInterval(params: ClearOptsId<number | object>): this;
	unmuteInterval(p: any): this {
		return this.markAsync('!muted', p, Async.linkNames.interval);
	}

	/**
	 * Suspends a setInterval operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendInterval(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendInterval(params: ClearOptsId<number | object>): this;
	suspendInterval(p: any): this {
		return this.markAsync('paused', p, Async.linkNames.interval);
	}

	/**
	 * Unsuspends a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendInterval(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendInterval(params: ClearOptsId<number | object>): this;
	unsuspendInterval(p: any): this {
		return this.markAsync('!paused', p, Async.linkNames.interval);
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
	setTimeout(fn: Function, timer: number, params?: AsyncCbOpts<CTX>): number | object {
		return this.setAsync({
			...params,
			name: Async.linkNames.timeout,
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
	clearTimeout(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearTimeout(params: ClearOptsId<number | object>): this;
	clearTimeout(p: any): this {
		return this.clearAsync(p, Async.linkNames.timeout);
	}

	/**
	 * Mutes a setTimeout operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteTimeout(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteTimeout(params: ClearOptsId<number | object>): this;
	muteTimeout(p: any): this {
		return this.markAsync('muted', p, Async.linkNames.timeout);
	}

	/**
	 * Unmutes a setTimeout operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteTimeout(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteTimeout(params: ClearOptsId<number | object>): this;
	unmuteTimeout(p: any): this {
		return this.markAsync('!muted', p, Async.linkNames.timeout);
	}

	/**
	 * Suspends a setTimeout operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendTimeout(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendTimeout(params: ClearOptsId<number | object>): this;
	suspendTimeout(p: any): this {
		return this.markAsync('paused', p, Async.linkNames.timeout);
	}

	/**
	 * Unsuspends a setTimeout operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendTimeout(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendTimeout(params: ClearOptsId<number | object>): this;
	unsuspendTimeout(p: any): this {
		return this.markAsync('!paused', p, Async.linkNames.timeout);
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
	requestIdleCallback<R = unknown>(
		fn: IdleCb<R, CTX>,
		params?: AsyncCreateIdleOpts<CTX>
	): number | object {
		return this.setAsync({
			...params && Object.reject(params, 'timeout'),
			name: Async.linkNames.idleCallback,
			obj: fn,
			clearFn: cancelIdleCallback,
			wrapper: requestIdleCallback,
			linkByWrapper: true,
			args: params && Object.select(params, 'timeout')
		});
	}

	/**
	 * Wrapper for cancelIdleCallback
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	cancelIdleCallback(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	cancelIdleCallback(params: ClearOptsId<number | object>): this;
	cancelIdleCallback(p: any): this {
		return this.clearAsync(p, Async.linkNames.idleCallback);
	}

	/**
	 * Mutes a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteIdleCallback(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteIdleCallback(params: ClearOptsId<number | object>): this;
	muteIdleCallback(p: any): this {
		return this.markAsync('muted', p, Async.linkNames.idleCallback);
	}

	/**
	 * Unmutes a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteIdleCallback(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteIdleCallback(params: ClearOptsId<number | object>): this;
	unmuteIdleCallback(p: any): this {
		return this.markAsync('!muted', p, Async.linkNames.idleCallback);
	}

	/**
	 * Suspends a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendIdleCallback(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendIdleCallback(params: ClearOptsId<number | object>): this;
	suspendIdleCallback(p: any): this {
		return this.markAsync('paused', p, Async.linkNames.idleCallback);
	}

	/**
	 * Unsuspends a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendIdleCallback(id?: number | object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendIdleCallback(params: ClearOptsId<number | object>): this;
	unsuspendIdleCallback(p: any): this {
		return this.markAsync('!paused', p, Async.linkNames.idleCallback);
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
	worker<T extends WorkerLikeP>(worker: T, params?: AsyncWorkerOpts<CTX>): T {
		const
			p = params || {},
			{workerCache} = this;

		if (!workerCache.has(worker)) {
			workerCache.set(worker, true);
			worker[asyncCounter] = (worker[asyncCounter] || 0) + 1;
		}

		return this.setAsync({
			...p,
			name: Async.linkNames.worker,
			obj: worker,
			clearFn: this.workerDestructor.bind(this, p.destructor),
			periodic: p.single !== true
		});
	}

	/**
	 * Terminates the specified worker
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
	terminateWorker(params: ClearProxyOpts<WorkerLikeP>): this;
	terminateWorker(p: any): this {
		return this.clearAsync(p, isParams<ClearProxyOpts>(p) && p.name || Async.linkNames.worker);
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
	request<T = unknown>(request: (() => PromiseLike<T>) | PromiseLike<T>, params?: AsyncOpts): Promise<T> {
		return this.promise(request, {...params, name: Async.linkNames.request});
	}

	/**
	 * Cancels the specified request
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	cancelRequest(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - link for the request
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	cancelRequest(params: ClearOptsId<Promise<unknown>>): this;
	cancelRequest(p: any): this {
		return this.clearAsync(p, Async.linkNames.request);
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
	muteRequest(params: ClearOptsId<Promise<unknown>>): this;
	muteRequest(p: any): this {
		return this.markAsync('muted', p, Async.linkNames.request);
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
	unmuteRequest(params: ClearOptsId<Promise<unknown>>): this;
	unmuteRequest(p: any): this {
		return this.markAsync('!muted', p, Async.linkNames.request);
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
	suspendRequest(params: ClearOptsId<Promise<unknown>>): this;
	suspendRequest(p: any): this {
		return this.markAsync('paused', p, Async.linkNames.request);
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
	unsuspendRequest(params: ClearOptsId<Promise<unknown>>): this;
	unsuspendRequest(p: any): this {
		return this.markAsync('!paused', p, Async.linkNames.request);
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
	 */
	proxy<A = unknown, R = unknown>(cb: Function, params?: AsyncProxyOpts<CTX>): ProxyCb<A, R, CTX> {
		const p = params || {};
		return this.setAsync({
			...params,
			name: p.name || Async.linkNames.proxy,
			obj: cb,
			wrapper: (fn) => fn,
			linkByWrapper: true,
			periodic: p.single === false
		});
	}

	/**
	 * Cancels the specified callback function
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
	cancelProxy(params: ClearProxyOpts<Function>): this;
	cancelProxy(p: any): this {
		return this.clearAsync(p, isParams<ClearProxyOpts>(p) && p.name || Async.linkNames.proxy);
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
	muteProxy(params: ClearProxyOpts<Function>): this;
	muteProxy(p: any): this {
		return this.markAsync('muted', p, isParams<ClearProxyOpts>(p) && p.name || Async.linkNames.proxy);
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
	unmuteProxy(params: ClearProxyOpts<Function>): this;
	unmuteProxy(p: any): this {
		return this.markAsync('!muted', p, isParams<ClearProxyOpts>(p) && p.name || Async.linkNames.proxy);
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
	suspendProxy(params: ClearProxyOpts<Function>): this;
	suspendProxy(p: any): this {
		return this.markAsync('paused', p, isParams<ClearProxyOpts>(p) && p.name || Async.linkNames.proxy);
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
	unsuspendProxy(params: ClearProxyOpts<Function>): this;
	unsuspendProxy(p: any): this {
		return this.markAsync('!paused', p, isParams<ClearProxyOpts>(p) && p.name || Async.linkNames.proxy);
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
	promise<T = unknown>(promise: (() => PromiseLike<T>) | PromiseLike<T>, params?: AsyncPromiseOpts): Promise<T> {
		const
			p = <AsyncPromiseOpts>({name: Async.linkNames.promise, ...params});

		return new Promise((resolve, reject) => {
			let
				canceled = false;

			const proxyResolve = <(value: unknown) => unknown>this.proxy(resolve, {
				...<any>p,

				clearFn: () => {
					this.promiseDestructor(<Promise<unknown>>promise);
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
					this.cancelProxy({id: proxyResolve, name: p.name});
				});
			}
		});
	}

	/**
	 * Cancels the specified promise
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	cancelPromise(id?: Promise<unknown>): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - link for the promise
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	cancelPromise(params: ClearProxyOpts<Function>): this;
	cancelPromise(p: any): this {
		return this.clearAsync(p, isParams<ClearProxyOpts>(p) && p.name || Async.linkNames.promise);
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
	mutePromise(params: ClearOptsId<Function>): this;
	mutePromise(p: any): this {
		return this.markAsync('muted', p, isParams<ClearProxyOpts>(p) && p.name || Async.linkNames.promise);
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
	unmutePromise(params: ClearOptsId<Function>): this;
	unmutePromise(p: any): this {
		return this.markAsync('!muted', p, isParams<ClearProxyOpts>(p) && p.name || Async.linkNames.promise);
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
	suspendPromise(params: ClearOptsId<Function>): this;
	suspendPromise(p: any): this {
		return this.markAsync('paused', p, isParams<ClearProxyOpts>(p) && p.name || Async.linkNames.promise);
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
	unsuspendPromise(params: ClearOptsId<Function>): this;
	unsuspendPromise(p: any): this {
		return this.markAsync('!paused', p, isParams<ClearProxyOpts>(p) && p.name || Async.linkNames.promise);
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

			id = this.setInterval(cb, DELAY, {
				...<any>params,
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
	): object;

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
	on<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		params: AsyncOnOpts<CTX>,
		...args: unknown[]
	): object;

	on<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		cb: ProxyCb<E, R, CTX>,
		p: any,
		...args: unknown[]
	): object {
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
			links: object[] = [];

		for (let i = 0; i < events.length; i++) {
			const
				event = events[i];

			links.push(this.setAsync({
				...p,
				name: Async.linkNames.eventListener,
				obj: cb,
				wrapper(cb: Function): unknown {
					const handler = function (this: unknown): unknown {
						if (Object.isFunction(emitter) || p.single && !emitter.once) {
							that.eventListenerDestructor({emitter, event, handler, args});
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
	once<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		...args: unknown[]
	): object;

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
	once<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		params: AsyncOnceOpts<CTX>,
		...args: unknown[]
	): object;

	once<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		p: any,
		...args: unknown[]
	): object {
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
	promisifyOnce<T = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		params: AsyncOpts & {options?: AddEventListenerOptions},
		...args: unknown[]
	): Promise<T>;

	/**
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param [args] - additional arguments for the emitter
	 */
	promisifyOnce<T = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		...args: unknown[]
	): Promise<T>;

	promisifyOnce<T = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		p: any,
		...args: unknown[]
	): Promise<T> {
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
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	off(id?: object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	off(params: ClearOptsId<object>): this;
	off(p: any): this {
		return this.clearAsync(isEvent(p) ? {id: p} : p, Async.linkNames.eventListener);
	}

	/**
	 * Mutes an event operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteEventListeners(id?: object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteEventListeners(params: ClearOptsId<object>): this;
	muteEventListeners(p: any): this {
		return this.markAsync('muted', isEvent(p) ? {id: p} : p, Async.linkNames.eventListener);
	}

	/**
	 * Unmutes an event operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteEventListeners(id?: object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteEventListeners(params: ClearOptsId<object>): this;
	unmuteEventListeners(p: any): this {
		return this.markAsync('!muted', isEvent(p) ? {id: p} : p, Async.linkNames.eventListener);
	}

	/**
	 * Suspends an event operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendEventListeners(id?: object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendEventListeners(params: ClearOptsId<object>): this;
	suspendEventListeners(p: any): this {
		return this.markAsync('paused', isEvent(p) ? {id: p} : p, Async.linkNames.eventListener);
	}

	/**
	 * Unsuspends an event operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendEventListeners(id?: object): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendEventListeners(params: ClearOptsId<object>): this;
	unsuspendEventListeners(p: any): this {
		return this.markAsync('!paused', isEvent(p) ? {id: p} : p, Async.linkNames.eventListener);
	}

	/**
	 * Clears all async operations
	 *
	 * @param [params] - additional parameters for the operation:
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearAll(params?: ClearOpts): this {
		this
			.off(params);

		for (let o = Async.linkNames, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `clear-${o[keys[i]]}`.camelize(false);

			if (Object.isFunction(this[alias])) {
				this[alias](params);
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
	muteAll(params?: ClearOpts): this {
		this
			.muteEventListeners(params);

		for (let o = Async.linkNames, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `mute-${o[keys[i]]}`.camelize(false);

			if (Object.isFunction(this[alias])) {
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
	unmuteAll(params?: ClearOpts): this {
		this
			.unmuteEventListeners(params);

		for (let o = Async.linkNames, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `unmute-${o[keys[i]]}`.camelize(false);

			if (Object.isFunction(this[alias])) {
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
	suspendAll(params?: ClearOpts): this {
		this
			.suspendEventListeners(params);

		for (let o = Async.linkNames, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `suspend-${o[keys[i]]}`.camelize(false);

			if (Object.isFunction(this[alias])) {
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
	unsuspendAll(params?: ClearOpts): this {
		this
			.unsuspendEventListeners(params);

		for (let o = Async.linkNames, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				alias = `unsuspend-${o[keys[i]]}`.camelize(false);

			if (Object.isFunction(this[alias])) {
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
	protected eventListenerDestructor(params: EventLike): void {
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
	protected workerDestructor(destructor: CanUndef<string>, worker: WorkerLikeP): void {
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
	protected promiseDestructor(promise: PromiseLike<unknown> | CancelablePromise<unknown>): void {
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
	protected setAsync(p: Dictionary<any>): any {
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
	protected clearAsync(p: Dictionary<any>, name?: string): this {
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
					keys = Object.keys(obj);

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
					clearFn = link.clearFn;

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
	protected clearAllAsync(p: Dictionary<any>): this {
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
			this.markAsync(field, {...p, group: keys[i]});
		}

		return this;
	}
}
