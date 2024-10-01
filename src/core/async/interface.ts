/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Async from 'core/async';

import type { PromiseNamespaces } from 'core/async/const';

import type {

	Task,
	TaskNamespaces,

	MarkReason,
	ClearReason,

	BoundFn,
	ClearFn,

	AsyncProxyOptions,
	ClearProxyOptions

} from 'core/async/core/interface';

import type { AsyncWorkerOptions, AsyncPromiseOptions } from 'core/async/proxy/interface';
import type { AsyncPromisifyOnceOptions } from 'core/async/events/interface';

export * from 'core/async/core/interface';
export * from 'core/async/events/interface';
export * from 'core/async/proxy/interface';
export * from 'core/async/timers/interface';
export * from 'core/async/wrappers/interface';

export type FullAsyncParams<CTX extends object = Async> =
	{
		/**
		 * The task namespace
		 *
		 * @example
		 * ```typescript
		 * setImmediate(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *
		 *     task: cb,
		 *     namespace: this.Namespaces.immediate,
		 *
		 *     wrapper: setImmediate,
		 *     clear: clearImmediate,
		 *
		 *     linkByWrapper: true
		 *   });
		 * }
		 * ```
		 */
		namespace: TaskNamespaces;

		/**
		 * The task object to wrap with Async
		 *
		 * @example
		 * ```typescript
		 * setImmediate(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *
		 *     // We need to pack `cb` with `setImmediate`
		 *     task: cb,
		 *     namespace: this.Namespaces.immediate,
		 *
		 *     wrapper: setImmediate,
		 *     clear: clearImmediate,
		 *
		 *     linkByWrapper: true
		 *   });
		 * }
		 * ```
		 */
		task: object & {name?: string};

		/**
		 * If set to true, the task can fire multiple times
		 *
		 * @example
		 * ```typescript
		 * setInterval(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *
		 *     task: cb,
		 *     namespace: this.Namespaces.interval,
		 *
		 *     wrapper: setInterval,
		 *     clear: clearInterval,
		 *
		 *     // `setInterval` doesn't stop automatically
		 *     periodic: true
		 *     linkByWrapper: true
		 *   });
		 * }
		 * ```
		 */
		periodic?: boolean;

		/**
		 * If set to true, the passed task can be executed as a function if possible
		 */
		callable?: boolean;

		/**
		 * A function that wraps the original task
		 *
		 * @example
		 * ```typescript
		 * setImmediate(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *
		 *     task: cb,
		 *     namespace: this.Namespaces.immediate,
		 *
		 *     // Wrap `cb` by using `setImmediate`
		 *     wrapper: setImmediate,
		 *     clear: clearImmediate,
		 *
		 *     linkByWrapper: true
		 *   });
		 * }
		 * ```
		 */
		wrapper?: BoundFn<CTX>;

		/**
		 * Additional arguments to the task wrapper
		 *
		 * @example
		 * ```typescript
		 * setInterval(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *
		 *     task: cb,
		 *     namespace: this.Namespaces.interval,
		 *
		 *     wrapper: setInterval,
		 *     clear: clearInterval,
		 *
		 *     linkByWrapper: true,
		 *     periodic: true,
		 *
		 *     // We need to provide the timeout value
		 *     args: [timeout]
		 *   });
		 * }
		 * ```
		 */
		args?: CanArray<unknown>;

		/**
		 * If set to true, a value that returns the wrapper will be interpreted as the unique operation identifier
		 *
		 * @example
		 * ```typescript
		 * setImmediate(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *
		 *     task: cb,
		 *     namespace: this.Namespaces.immediate,
		 *
		 *     wrapper: setImmediate,
		 *     clear: clearImmediate,
		 *
		 *     // `setImmediate` returns the unique identifier
		 *     linkByWrapper: true
		 *   });
		 * }
		 * ```
		 */
		linkByWrapper?: boolean;

		/**
		 * A function to clear the operation
		 *
		 * @example
		 * ```typescript
		 * setImmediate(cb: Function, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		 *   return this.registerTask({
		 *     ...opts,
		 *
		 *     task: cb,
		 *     namespace: this.Namespaces.immediate,
		 *
		 *     wrapper: setImmediate,
		 *
		 *     // Clear the operation
		 *     clear: clearImmediate,
		 *
		 *     linkByWrapper: true
		 *   });
		 * }
		 * ```
		 */
		clear?: ClearFn<CTX>;
	} &

	AsyncProxyOptions<CTX> &

	(
		AsyncPromiseOptions |
		AsyncWorkerOptions<CTX> |
		AsyncPromisifyOnceOptions<unknown, unknown, CTX>
	);

export interface FullClearParams<ID = any> extends ClearProxyOptions<ID> {
	/** @inheritDoc */
	namespace: TaskNamespaces;

	/**
	 * A reason to clear or mark the task
	 */
	reason?: MarkReason | ClearReason;

	/**
	 * The task namespace for operations when they are used as promisified
	 */
	promise?: PromiseNamespaces;

	/**
	 * A link to a new task that replaces the current one
	 */
	replacedBy?: Task;
}
