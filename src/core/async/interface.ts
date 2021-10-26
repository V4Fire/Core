/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Async from 'core/async';

import type {

	Task,

	MarkReason,
	ClearReason,

	BoundFn,
	ClearFn,

	AsyncProxyOptions,
	ClearProxyOptions

} from 'core/async/modules/base/interface';

import type {

	AsyncWorkerOptions,
	AsyncPromiseOptions

} from 'core/async/modules/proxy/interface';

import type { AsyncPromisifyOnceOptions } from 'core/async/modules/events/interface';

export * from 'core/async/modules/base/interface';
export * from 'core/async/modules/events/interface';
export * from 'core/async/modules/proxy/interface';
export * from 'core/async/modules/timers/interface';
export * from 'core/async/modules/wrappers/interface';

export enum Namespaces {
	proxy,
	proxyPromise,
	promise,
	iterable,
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
		wrapper?: BoundFn<CTX>;

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

export interface FullClearOptions<ID = any> extends ClearProxyOptions<ID> {
	/**
	 * Namespace of the task to clear
	 */
	name: string;

	/**
	 * Reason to clear or mark the task
	 */
	reason?: MarkReason | ClearReason;

	/**
	 * If true, the operation was registered as a promise
	 */
	promise?: boolean;

	/**
	 * Link to a task that replaces the current
	 */
	replacedBy?: Task;
}
