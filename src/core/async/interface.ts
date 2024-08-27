/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Async from 'core/async';

import type { Namespaces } from 'core/async/const';

import type {

	Task,

	MarkReason,
	ClearReason,

	BoundFn,
	ClearFn,

	AsyncProxyOptions,
	ClearProxyOptions

} from 'core/async/core/interface';

import type {

	AsyncWorkerOptions,
	AsyncPromiseOptions

} from 'core/async/proxy/interface';

import type { AsyncPromisifyOnceOptions } from 'core/async/events/interface';

export * from 'core/async/core/interface';
export * from 'core/async/events/interface';
export * from 'core/async/proxy/interface';
export * from 'core/async/timers/interface';
export * from 'core/async/wrappers/interface';

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
		 *     name: Namespaces.immediate,
		 *
		 *     obj: cb,
		 *     clearFn: clearImmediate,
		 *     wrapper: setImmediate,
		 *     linkByWrapper: true
		 *   });
		 * }
		 * ```
		 */
		namespace: Namespaces;

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
		task: object & {name?: string};

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
		 * If true, then the passed object can be executed as a function if it is possible
		 */
		callable?: boolean;

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
	namespace: Namespaces;

	/**
	 * Reason to clear or mark the task
	 */
	reason?: MarkReason | ClearReason;

	/**
	 * If true, the operation was registered as a promise
	 */
	promise?: Namespaces;

	/**
	 * Link to a task that replaces the current
	 */
	replacedBy?: Task;
}
