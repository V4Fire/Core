/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';

export enum Namespaces {
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

export type Namespace = keyof typeof Namespaces;

/** @deprecated */
export { Namespaces as LinkNames };

export type Label = string | symbol;
export type Group = string;
export type Join = boolean | 'replace';

export type TimerId = number | object;
export type EventId = CanArray<object>;

export interface AsyncOptions {
	/**
	 * Label of the task (the previous task with the same label will be canceled)
	 */
	label?: Label;

	/**
	 * Group name of the task
	 */
	group?: Group;

	/**
	 * Strategy for joining competitive tasks (with same labels):
	 *   1. `true` - all tasks will be joined to the first;
	 *   1. `'replace'` - all tasks will be joined (replaced) to the last (only for promises).
	 */
	join?: Join;
}

export type FullAsyncOptions<CTX extends object = Async> =
	{
		name: string;
		obj: object & {name?: string};
		periodic?: boolean;
		needCall?: boolean;
		args?: CanArray<unknown>;
		wrapper?: WrappedCb<CTX>;
		linkByWrapper?: boolean;
		clearFn?: ClearFn<CTX>;
	} &

	AsyncProxyOptions<CTX> &

	(
		AsyncPromiseOptions |
		AsyncWorkerOptions<CTX> |
		AsyncPromisifyOnceOptions<unknown, unknown, CTX>
	);

export type ClearReason =
	'id' |
	'label' |
	'collision' |
	'group' |
	'rgxp' |
	'all';

export interface ClearOptions {
	/**
	 * Label of the task
	 */
	label?: Label;

	/**
	 * Group name of the task
	 */
	group?: Group | RegExp;

	/**
	 * If true, then the cleanup handler of the task is prevented
	 */
	preventDefault?: boolean;
}

export interface ClearOptionsId<ID = any> extends ClearOptions {
	/**
	 * Task identifier
	 */
	id?: ID;
}

export interface ClearProxyOptions<ID = any> extends ClearOptionsId<ID> {
	/**
	 * Proxy name
	 */
	name?: string;
}

export interface FullClearOptions<ID = any> extends ClearProxyOptions<ID> {
	name: string;
	reason?: ClearReason;
	promise?: boolean;
	replacedBy?: Task;
}

export interface Task<CTX extends object = Async> {
	id: unknown;
	obj: unknown;
	objName?: string;
	label?: Label;
	paused: boolean;
	muted: boolean;
	queue: Function[];
	onComplete: WrappedCb<CTX>[][];
	onClear: AsyncCb<CTX>[];
	clearFn?: ClearFn;
}

export type TaskCtx<CTX extends object = Async> = {
	type: string;
	link: Task<CTX>;
	replacedBy?: Task<CTX>;
	reason?: ClearReason;
} & AsyncOptions & ClearOptionsId<unknown>;

export interface AsyncCb<CTX extends object = Async> {
	(this: CTX, ctx: TaskCtx<CTX>): void;
}

export interface ClearFn<CTX extends object = Async> extends Function {
	(id: any, ctx: CTX): any;
}

export interface WrappedCb<CTX extends object = Async> extends Function {
	(this: CTX, ...args: any[]): any;
}

export type ProxyCb<
	A = unknown,
	R = unknown,
	CTX extends object = Async
> = A extends never ?
	((this: CTX) => R) : A extends unknown[] ?
		((this: CTX, ...args: A) => R) : ((this: CTX, e: A) => R) | Function;

export type IdleCb<
	R = unknown,
	CTX extends object = Async
> = ProxyCb<IdleDeadline, R, CTX>;

export interface AsyncCbOptions<CTX extends object = Async> extends AsyncOptions {
	/**
	 * If true, then the namespace will be marked as promisified
	 * @default `false`
	 */
	promise?: boolean;

	/**
	 * Handler for clearing (it is called after clearing of a task)
	 */
	onClear?: CanArray<AsyncCb<CTX>>;

	/**
	 * Handler for merging (it is called after merging of a task with another task (label + join:true))
	 */
	onMerge?: CanArray<AsyncCb<CTX>>;
}

export interface AsyncCbOptionsSingle<CTX extends object = Async> extends AsyncCbOptions<CTX> {
	/**
	 * If false, then the proxy will support multiple callings
	 * @default `true`
	 */
	single?: boolean;
}

export interface AsyncProxyOptions<CTX extends object = Async> extends AsyncCbOptionsSingle<CTX> {
	/**
	 * Proxy name
	 */
	name?: string;
}

export interface AsyncPromiseOptions extends AsyncOptions {
	/**
	 * Proxy name
	 */
	name?: string;

	/**
	 * Name of the destructor method
	 */
	destructor?: string;
}

export interface AsyncRequestOptions extends AsyncOptions {
	/**
	 * Name of the destructor method
	 */
	destructor?: string;
}

export interface AsyncRequestIdleCallbackOptions<CTX extends object = Async> extends AsyncCbOptions<CTX> {
	/**
	 * Timeout value for the native requestIdleCallback function
	 */
	timeout?: number;
}

export interface AsyncIdleOptions extends AsyncOptions {
	/**
	 * Timeout value for the native requestIdleCallback function
	 */
	timeout?: number;
}

export interface AsyncWaitOptions extends AsyncOptions {
	/**
	 * Delay value in milliseconds
	 */
	delay?: number;
}

export interface AsyncOnOptions<CTX extends object = Async> extends AsyncCbOptionsSingle<CTX> {
	/**
	 * Additional options for the emitter
	 */
	options?: Dictionary;
}

export interface AsyncOnceOptions<T extends object = Async> extends AsyncCbOptions<T> {
	/**
	 * Additional options for the emitter
	 */
	options?: Dictionary;
}

export interface AsyncPromisifyOnceOptions<
	E = unknown,
	R = unknown,
	CTX extends object = Async
> extends AsyncOptions {
	/**
	 * Event handler (the result will be provided as a promise result)
	 */
	handler?: ProxyCb<E, R, CTX>;

	/**
	 * Additional options for the emitter
	 */
	options?: Dictionary;
}

export interface AsyncWorkerOptions<CTX extends object = Async> extends AsyncProxyOptions<CTX> {
	/**
	 * Name of the destructor method
	 */
	destructor?: string;
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

export interface EventLike<E extends EventEmitterLikeP = EventEmitterLikeP> {
	/**
	 * Event emitter
	 */
	emitter: E;

	/**
	 * Event name
	 */
	event: string;

	/**
	 * Event handler
	 */
	handler: ProxyCb;

	/**
	 * Additional arguments for the emitter
	 */
	args: unknown[];
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

export interface CancelablePromise<T = unknown> extends Promise<T> {
	abort?: Function;
	cancel?: Function;
}

export interface LocalCache {
	labels: Dictionary<Label>;
	links: Map<object, Task>;
}

export interface GlobalCache {
	root: LocalCache;
	groups: Dictionary<LocalCache>;
}
