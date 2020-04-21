/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/promise/sync';
import Super from 'core/async/modules/proxy';

import {

	AsyncOptions,
	AsyncCbOptions,
	AsyncWaitOptions,
	AsyncRequestIdleCallbackOptions,
	AsyncIdleOptions,

	ClearOptionsId,
	TimerId,

	AsyncCb,
	IdleCb

} from 'core/async/interface';

export * from 'core/async/modules/proxy';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * Wrapper for global.setImmediate
	 *
	 * @param cb - callback function
	 * @param [opts] - additional options for the operation
	 */
	setImmediate(cb: AnyFunction, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		const
			// tslint:disable-next-line
			wrapper = globalThis['setImmediate'],

			// tslint:disable-next-line
			clearFn = globalThis['clearImmediate'];

		return this.registerTask({
			...opts,
			name: this.namespaces.immediate,
			obj: cb,
			clearFn,
			wrapper,
			linkByWrapper: true
		});
	}

	/**
	 * Wrapper for global.clearImmediate
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearImmediate(id?: TimerId): this;

	/**
	 * Clears the specified "setImmediate" timer or a group of timers
	 * @param opts - options for the operation
	 */
	clearImmediate(opts: ClearOptionsId<TimerId>): this;
	clearImmediate(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.cancelTask(task, this.namespaces.immediate);
	}

	/**
	 * Mutes the specified "setImmediate" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	muteImmediate(id?: TimerId): this;

	/**
	 * Mutes the specified "setImmediate" timer or a group of timers
	 * @param opts - options for the operation
	 */
	muteImmediate(opts: ClearOptionsId<TimerId>): this;
	muteImmediate(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('muted', task, this.namespaces.immediate);
	}

	/**
	 * Unmutes the specified "setImmediate" timer
	 * @param [id] - operation id (if not defined will be get all handlers)
	 */
	unmuteImmediate(id?: TimerId): this;

	/**
	 * Unmutes the specified "setImmediate" timer or a group of timers
	 *
	 * @param opts - options for the operation
	 */
	unmuteImmediate(opts: ClearOptionsId<TimerId>): this;
	unmuteImmediate(p: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!muted', p, this.namespaces.immediate);
	}

	/**
	 * Suspends the specified "setImmediate" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendImmediate(id?: TimerId): this;

	/**
	 * Suspends the specified "setImmediate" timer or a group of timers
	 * @param opts - options for the operation
	 */
	suspendImmediate(opts: ClearOptionsId<TimerId>): this;
	suspendImmediate(p: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('paused', p, this.namespaces.immediate);
	}

	/**
	 * Unsuspends the specified "setImmediate" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendImmediate(id?: TimerId): this;

	/**
	 * Unsuspends the specified "setImmediate" timer or a group of timers
	 * @param opts - options for the operation
	 */
	unsuspendImmediate(opts: ClearOptionsId<TimerId>): this;
	unsuspendImmediate(p: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!paused', p, this.namespaces.immediate);
	}

	/**
	 * Wrapper for global.setInterval
	 *
	 * @param cb - callback function
	 * @param timeout - timer value
	 * @param [opts] - additional options for the operation
	 */
	setInterval(cb: AnyFunction, timeout: number, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		return this.registerTask({
			...opts,
			name: this.namespaces.interval,
			obj: cb,
			clearFn: clearInterval,
			wrapper: setInterval,
			linkByWrapper: true,
			periodic: true,
			args: [timeout]
		});
	}

	/**
	 * Wrapper for global.clearInterval
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearInterval(id?: TimerId): this;

	/**
	 * Clears the specified "setInterval" timer or a group of timers
	 * @param opts - options for the operation
	 */
	clearInterval(opts: ClearOptionsId<TimerId>): this;
	clearInterval(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.cancelTask(task, this.namespaces.interval);
	}

	/**
	 * Mutes the specified "setInterval" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	muteInterval(id?: TimerId): this;

	/**
	 * Mutes the specified "setInterval" timer or a group of timers
	 * @param opts - options for the operation
	 */
	muteInterval(opts: ClearOptionsId<TimerId>): this;
	muteInterval(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!muted', task, this.namespaces.interval);
	}

	/**
	 * Unmutes the specified "setInterval" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unmuteInterval(id?: TimerId): this;

	/**
	 * Unmutes the specified "setInterval" timer or a group of timers
	 * @param opts - options for the operation
	 */
	unmuteInterval(opts: ClearOptionsId<TimerId>): this;
	unmuteInterval(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!muted', task, this.namespaces.interval);
	}

	/**
	 * Suspends the specified "setInterval" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendInterval(id?: TimerId): this;

	/**
	 * Suspends the specified "setInterval" timer or a group of timers
	 * @param opts - options for the operation
	 */
	suspendInterval(opts: ClearOptionsId<TimerId>): this;
	suspendInterval(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('paused', task, this.namespaces.interval);
	}

	/**
	 * Unsuspends the specified "setImmediate" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendInterval(id?: TimerId): this;

	/**
	 * Unsuspends the specified "setImmediate" timer or a group of timers
	 * @param opts - options for the operation
	 */
	unsuspendInterval(opts: ClearOptionsId<TimerId>): this;
	unsuspendInterval(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!paused', task, this.namespaces.interval);
	}

	/**
	 * Wrapper for global.setTimeout
	 *
	 * @param cb - callback function
	 * @param timeout - timeout value
	 * @param [opts] - additional options for the operation
	 */
	setTimeout(cb: AnyFunction, timeout: number, opts?: AsyncCbOptions<CTX>): Nullable<TimerId> {
		return this.registerTask({
			...opts,
			name: this.namespaces.timeout,
			obj: cb,
			clearFn: clearTimeout,
			wrapper: setTimeout,
			linkByWrapper: true,
			args: [timeout]
		});
	}

	/**
	 * Wrapper for global.clearTimeout
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearTimeout(id?: TimerId): this;

	/**
	 * Clears the specified "setTimeout" timer or a group of timers
	 * @param opts - options for the operation
	 */
	clearTimeout(opts: ClearOptionsId<TimerId>): this;
	clearTimeout(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.cancelTask(task, this.namespaces.timeout);
	}

	/**
	 * Mutes the specified "setTimeout" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	muteTimeout(id?: TimerId): this;

	/**
	 * Mutes the specified "setTimeout" timer or a group of timers
	 * @param opts - options for the operation
	 */
	muteTimeout(opts: ClearOptionsId<TimerId>): this;
	muteTimeout(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('muted', task, this.namespaces.timeout);
	}

	/**
	 * Unmutes the specified "setTimeout" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unmuteTimeout(id?: TimerId): this;

	/**
	 * Unmutes the specified "setTimeout" timer or a group of timers
	 * @param opts - options for the operation
	 */
	unmuteTimeout(opts: ClearOptionsId<TimerId>): this;
	unmuteTimeout(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!muted', task, this.namespaces.timeout);
	}

	/**
	 * Suspends the specified "setTimeout" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendTimeout(id?: TimerId): this;

	/**
	 * Suspends the specified "setTimeout" timer or a group of timers
	 * @param opts - options for the operation
	 */
	suspendTimeout(opts: ClearOptionsId<TimerId>): this;
	suspendTimeout(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('paused', task, this.namespaces.timeout);
	}

	/**
	 * Unsuspends the specified "setTimeout" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendTimeout(id?: TimerId): this;

	/**
	 * Unsuspends the specified "setTimeout" timer or a group of names
	 * @param opts - options for the operation
	 */
	unsuspendTimeout(opts: ClearOptionsId<TimerId>): this;
	unsuspendTimeout(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!paused', task, this.namespaces.timeout);
	}

	/**
	 * Wrapper for global.requestIdleCallback
	 *
	 * @param cb - callback function
	 * @param [opts] - additional options for the operation
	 */
	requestIdleCallback<R = unknown>(
		cb: IdleCb<R, CTX>,
		opts?: AsyncRequestIdleCallbackOptions<CTX>
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

		return this.registerTask({
			...opts && Object.reject(opts, 'timeout'),
			name: this.namespaces.idleCallback,
			obj: cb,
			clearFn,
			wrapper,
			linkByWrapper: true,
			args: opts && Object.select(opts, 'timeout')
		});
	}

	/**
	 * Wrapper for global.cancelIdleCallback
	 *
	 * @alias
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	cancelIdleCallback(id?: TimerId): this;

	/**
	 * Clears the specified "requestIdleCallback" timer or a group of timers
	 * @param opts - options for the operation
	 */
	cancelIdleCallback(opts: ClearOptionsId<TimerId>): this;
	cancelIdleCallback(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.clearIdleCallback(task);
	}

	/**
	 * Wrapper for global.cancelIdleCallback
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearIdleCallback(id?: TimerId): this;

	/**
	 * Clears the specified "requestIdleCallback" timer or a group of timers
	 * @param opts - options for the operation
	 */
	clearIdleCallback(opts: ClearOptionsId<TimerId>): this;
	clearIdleCallback(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.cancelTask(task, this.namespaces.idleCallback);
	}

	/**
	 * Mutes the specified "requestIdleCallback" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	muteIdleCallback(id?: TimerId): this;

	/**
	 * Mutes the specified "requestIdleCallback" timer or a group of timers
	 * @param opts - options for the operation
	 */
	muteIdleCallback(opts: ClearOptionsId<TimerId>): this;
	muteIdleCallback(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('muted', task, this.namespaces.idleCallback);
	}

	/**
	 * Unmutes the specified "requestIdleCallback" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unmuteIdleCallback(id?: TimerId): this;

	/**
	 * Unmutes the specified "requestIdleCallback" timer or a group of timers
	 * @param opts - options for the operation
	 */
	unmuteIdleCallback(opts: ClearOptionsId<TimerId>): this;
	unmuteIdleCallback(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!muted', task, this.namespaces.idleCallback);
	}

	/**
	 * Suspends the specified "requestIdleCallback" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendIdleCallback(id?: TimerId): this;

	/**
	 * Suspends the specified "requestIdleCallback" timer or a group of timers
	 * @param opts - options for the operation
	 */
	suspendIdleCallback(opts: ClearOptionsId<TimerId>): this;
	suspendIdleCallback(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('paused', task, this.namespaces.idleCallback);
	}

	/**
	 * Unsuspends the specified "requestIdleCallback" timer
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendIdleCallback(id?: TimerId): this;

	/**
	 * Unsuspends the specified "requestIdleCallback" timer or a group of timers
	 * @param opts - options for the operation
	 */
	unsuspendIdleCallback(opts: ClearOptionsId<TimerId>): this;
	unsuspendIdleCallback(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!paused', task, this.namespaces.idleCallback);
	}

	/**
	 * Returns a promise that will be resolved after the specified timeout
	 *
	 * @param timeout
	 * @param [opts] - additional options for the operation
	 */
	sleep(timeout: number, opts?: AsyncOptions): SyncPromise<void> {
		return new SyncPromise((resolve, reject) => {
			this.setTimeout(resolve, timeout, {
				...opts,
				promise: true,
				onClear: <AsyncCb<CTX>>this.onPromiseClear(resolve, reject),
				onMerge: <AsyncCb<CTX>>this.onPromiseMerge(resolve, reject)
			});
		});
	}

	/**
	 * Returns a promise that will be resolved on the next tick of the event loop
	 * @param [opts] - additional options for the operation
	 */
	nextTick(opts?: AsyncOptions): SyncPromise<void> {
		return new SyncPromise((resolve, reject) => {
			this.setImmediate(resolve, {
				...opts,
				promise: true,
				onClear: <AsyncCb<CTX>>this.onPromiseClear(resolve, reject),
				onMerge: <AsyncCb<CTX>>this.onPromiseMerge(resolve, reject)
			});
		});
	}

	/**
	 * Returns a promise that will be resolved on the process idle
	 * @param [opts] - additional options for the operation
	 */
	idle(opts?: AsyncIdleOptions): SyncPromise<IdleDeadline> {
		return new SyncPromise((resolve, reject) => {
			this.requestIdleCallback(resolve, {
				...opts,
				promise: true,
				onClear: <AsyncCb<CTX>>this.onPromiseClear(resolve, reject),
				onMerge: <AsyncCb<CTX>>this.onPromiseMerge(resolve, reject)
			});
		});
	}

	/**
	 * Returns a promise that will be resolved only when the specified function returns a positive value (== true)
	 *
	 * @param fn
	 * @param [opts] - additional options for the operation
	 */
	wait(fn: AnyFunction, opts?: AsyncWaitOptions): SyncPromise<boolean> {
		if (fn()) {
			if (opts?.label) {
				this.clearPromise(opts);
			}

			return SyncPromise.resolve(true);
		}

		return new SyncPromise((resolve, reject) => {
			let
				id;

			const cb = () => {
				if (fn()) {
					resolve(true);
					this.clearPromise(id);
				}
			};

			id = this.setInterval(cb, opts?.delay || 15, {
				...opts,
				promise: true,
				onClear: <AsyncCb<CTX>>this.onPromiseClear(resolve, reject),
				onMerge: <AsyncCb<CTX>>this.onPromiseMerge(resolve, reject)
			});
		});
	}
}
