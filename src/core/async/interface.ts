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
	 * Label of a task (the previous task with the same label will be canceled)
	 */
	label?: Label;

	/**
	 * Group name of a task
	 */
	group?: Group;

	/**
	 * Strategy to join competitive tasks (with the same labels):
	 *   1. `true` - all tasks are joined to the first;
	 *   1. `'replace'` - all tasks are joined (replaced) to the last (only for promises).
	 */
	join?: Join;
}

export type FullAsyncOptions<CTX extends object = Async> =
	{
		/**
		 * Namespace of the task
		 *
		 * @example
		 * ```typescript
		 * setImmediate(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *
		 *     // This operation has a namespace from this.namespaces.immediate
		 *     name: this.namespaces.immediate,
		 *
		 *     obj: cb,
		 *     clearFn: clearImmediate,
		 *     wrapper: setImmediate,
		 *     linkByWrapper: true
		 *   });
		 * }
		 * ```
		 */
		name: string;

		/**
		 * Object to wrap with Async
		 *
		 * @example
		 * ```typescript
		 * setImmediate(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *     name: this.namespaces.immediate,
		 *
		 *     // We need to pack cb with setImmediate
		 *     obj: cb,
		 *
		 *     clearFn: clearImmediate,
		 *     wrapper: setImmediate,
		 *     linkByWrapper: true
		 *   });
		 * }
		 * ```
		 */
		obj: object & {name?: string};

		/**
		 * True, if the task can fire multiple times
		 *
		 * @example
		 * ```typescript
		 * setInterval(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *     name: this.namespaces.interval,
		 *     obj: cb,
		 *     clearFn: clearInterval,
		 *     wrapper: setInterval,
		 *     linkByWrapper: true,
		 *
		 *     // setInterval doesn't stop automatically
		 *     periodic: true
		 *   });
		 * }
		 * ```
		 */
		periodic?: boolean;

		/**
		 * If true, then the passed object can be executed as a function if it possible
		 */
		callable?: boolean;

		/**
		 * @deprecated
		 * @see [[FullAsyncOptions.needCall]]
		 */
		needCall?: boolean;

		/**
		 * Function that wraps the original object
		 *
		 * @example
		 * ```typescript
		 * setImmediate(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *     name: this.namespaces.immediate,
		 *     obj: cb,
		 *     clearFn: clearImmediate,
		 *
		 *     // Wrap cb by using setImmediate
		 *     wrapper: setImmediate,
		 *
		 *     linkByWrapper: true
		 *   });
		 * }
		 * ```
		 */
		wrapper?: WrappedCb<CTX>;

		/**
		 * Additional arguments to a task wrapper
		 *
		 * @example
		 * ```typescript
		 * setInterval(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *     name: this.namespaces.interval,
		 *     obj: cb,
		 *     clearFn: clearInterval,
		 *     wrapper: setInterval,
		 *     linkByWrapper: true,
		 *     periodic: true,
		 *
		 *     // We need to provide a timeout value
		 *     args: [timeout]
		 *   });
		 * }
		 * ```
		 */
		args?: CanArray<unknown>;

		/**
		 * If true, then a value that returns the wrapper will be interpreted as the unique operation identifier
		 *
		 * @example
		 * ```typescript
		 * setImmediate(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *     name: this.namespaces.immediate,
		 *     obj: cb,
		 *     clearFn: clearImmediate,
		 *     wrapper: setImmediate,
		 *
		 *     // setImmediate returns the unique identifier
		 *     linkByWrapper: true
		 *   });
		 * }
		 * ```
		 */
		linkByWrapper?: boolean;

		/**
		 * Function to clear the operation
		 *
		 * @example
		 * ```typescript
		 * setImmediate(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *     name: this.namespaces.immediate,
		 *     obj: cb,
		 *
		 *     // Clear the operation
		 *     clearFn: clearImmediate,
		 *
		 *     wrapper: setImmediate,
		 *     linkByWrapper: true
		 *   });
		 * }
		 * ```
		 */
		clearFn?: ClearFn<CTX>;
	} &

	AsyncProxyOptions<CTX> &

	(
		AsyncPromiseOptions |
		AsyncWorkerOptions<CTX> |
		AsyncPromisifyOnceOptions<unknown, unknown, CTX>
	);

/**
 * Reason why a task can be killed (cleared)
 */
export type ClearReason =
	'id' |
	'label' |
	'collision' |
	'group' |
	'rgxp' |
	'all';

export interface ClearOptions {
	/**
	 * Label of the task to clear
	 */
	label?: Label;

	/**
	 * Group name of the task to clear
	 */
	group?: Group | RegExp;

	/**
	 * If true, then a cleanup handler of the task is prevented
	 */
	preventDefault?: boolean;
}

export interface ClearOptionsId<ID = any> extends ClearOptions {
	/**
	 * Identifier of the task to clear
	 */
	id?: ID;
}

export interface ClearProxyOptions<ID = any> extends ClearOptionsId<ID> {
	/**
	 * Namespace of the proxy to clear
	 */
	name?: string;
}

export interface FullClearOptions<ID = any> extends ClearProxyOptions<ID> {
	/**
	 * Namespace of the task to clear
	 */
	name: string;

	/**
	 * Reason to clear the task
	 */
	reason?: ClearReason;

	/**
	 * If true, the operation was registered as a promise
	 */
	promise?: boolean;

	/**
	 * Link to a task that replaces the current
	 */
	replacedBy?: Task;
}

/**
 * Registered task object
 */
export interface Task<CTX extends object = Async> {
	/**
	 * Task unique identifier
	 */
	id: unknown;

	/**
	 * Raw task object
	 */
	obj: unknown;

	/**
	 * Name of the raw task object
	 */
	objName?: string;

	/**
	 * Group name the task
	 */
	group?: string;

	/**
	 * Label of the task
	 */
	label?: Label;

	/**
	 * True if the task is paused
	 */
	paused: boolean;

	/**
	 * True if the task is muted
	 */
	muted: boolean;

	/**
	 * Queue of pending handlers
	 * (if the task is paused)
	 */
	queue: Function[];

	/**
	 * List of complete handlers:
	 *
	 * [0] - onFulfilled
	 * [1] - onRejected
	 */
	onComplete: WrappedCb<CTX>[][];

	/**
	 * List of clear handlers
	 */
	onClear: AsyncCb<CTX>[];

	/**
	 * Unregisters the task
	 */
	unregister: Function;

	/**
	 * Function to clear the task
	 */
	clearFn?: ClearFn;
}

/**
 * Context of a task
 */
export type TaskCtx<CTX extends object = Async> = {
	/**
	 * Task type
	 */
	type: string;

	/**
	 * Link to the registered task
	 */
	link: Task<CTX>;

	/**
	 * Link to a new task that replaces the current
	 */
	replacedBy?: Task<CTX>;

	/**
	 * Reason to clear the task
	 */
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
	 * If true, then a task namespace is marked as promisified
	 * @default `false`
	 */
	promise?: boolean;

	/**
	 * Handler/s of task clearing
	 */
	onClear?: CanArray<AsyncCb<CTX>>;

	/**
	 * Handler/s of task merging: the task should merge to another task with the same label and with "join: true" strategy
	 */
	onMerge?: CanArray<AsyncCb<CTX>>;
}

export interface AsyncCbOptionsSingle<CTX extends object = Async> extends AsyncCbOptions<CTX> {
	/**
	 * If false, then the proxy supports multiple callings
	 * @default `true`
	 */
	single?: boolean;
}

export interface AsyncProxyOptions<CTX extends object = Async> extends AsyncCbOptionsSingle<CTX> {
	/**
	 * Namespace of the proxy
	 */
	name?: string;

	/**
	 * Function to clear memory of the proxy
	 */
	clearFn?: ClearFn<CTX>;
}

export interface AsyncPromiseOptions extends AsyncOptions {
	/**
	 * Namespace of the proxy
	 */
	name?: string;

	/**
	 * Name of a destructor method
	 */
	destructor?: string;
}

export interface AsyncRequestOptions extends AsyncOptions {
	/**
	 * Name of a destructor method
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
	 * Event handler (the result of invoking is provided to a promise)
	 */
	handler?: ProxyCb<E, R, CTX>;

	/**
	 * Additional options for the emitter
	 */
	options?: Dictionary;
}

export interface AsyncWorkerOptions<CTX extends object = Async> extends AsyncProxyOptions<CTX> {
	/**
	 * Name of a destructor method
	 */
	destructor?: string;
}

/**
 * Something that looks like a worker
 */
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

/**
 * Extended type of a worker
 */
export type WorkerLikeP = Function | WorkerLike;

/**
 * Promise that supports canceling
 */
export interface CancelablePromise<T = unknown> extends Promise<T> {
	abort?: Function;
	cancel?: Function;
}

/**
 * Something that looks like an event emitter
 */
export interface EventEmitterLike {
	on?: Function;
	addListener?: Function;
	addEventListener?: Function;
	once?: Function;
	off?: Function;
	removeListener?: Function;
	removeEventListener?: Function;
}

/**
 * Extended type of an event emitter
 */
export type EventEmitterLikeP = Function | EventEmitterLike;

/**
 * Event object
 */
export interface Event<E extends EventEmitterLikeP = EventEmitterLikeP> {
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

export interface LocalCache {
	labels: Record<Label, unknown>;
	links: Map<object, Task<any>>;
}

export interface GlobalCache {
	root: LocalCache;
	groups: Dictionary<LocalCache>;
}
