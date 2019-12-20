/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { createSyncPromise } from 'core/event';

import * as i from 'core/async/interface';
import Super from 'core/async/modules/proxy';
export * from 'core/async/modules/proxy';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
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
	setImmediate(fn: Function, params?: i.AsyncCbOptions<CTX>): Nullable<i.TimerId> {
		const
			// tslint:disable-next-line
			wrapper = globalThis['setImmediate'],

			// tslint:disable-next-line
			clearFn = globalThis['clearImmediate'];

		return this.registerTask({
			...params,
			name: this.namespaces.immediate,
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
	clearImmediate(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearImmediate(params: i.ClearOptionsId<i.TimerId>): this;
	clearImmediate(p: any): this {
		return this.cancelTask(p, this.namespaces.immediate);
	}

	/**
	 * Mutes a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteImmediate(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteImmediate(params: i.ClearOptionsId<i.TimerId>): this;
	muteImmediate(p: any): this {
		return this.markTask('muted', p, this.namespaces.immediate);
	}

	/**
	 * Unmutes a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all handlers)
	 */
	unmuteImmediate(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteImmediate(params: i.ClearOptionsId<i.TimerId>): this;
	unmuteImmediate(p: any): this {
		return this.markTask('!muted', p, this.namespaces.immediate);
	}

	/**
	 * Suspends a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendImmediate(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendImmediate(params: i.ClearOptionsId<i.TimerId>): this;
	suspendImmediate(p: any): this {
		return this.markTask('paused', p, this.namespaces.immediate);
	}

	/**
	 * Unsuspends a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendImmediate(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendImmediate(params: i.ClearOptionsId<i.TimerId>): this;
	unsuspendImmediate(p: any): this {
		return this.markTask('!paused', p, this.namespaces.immediate);
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
	setInterval(fn: Function, interval: number, params?: i.AsyncCbOptions<CTX>): Nullable<i.TimerId> {
		return this.registerTask({
			...params,
			name: this.namespaces.interval,
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
	clearInterval(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearInterval(params: i.ClearOptionsId<i.TimerId>): this;
	clearInterval(p: any): this {
		return this.cancelTask(p, this.namespaces.interval);
	}

	/**
	 * Mutes a setInterval operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteInterval(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteInterval(params: i.ClearOptionsId<i.TimerId>): this;
	muteInterval(p: any): this {
		return this.markTask('!muted', p, this.namespaces.interval);
	}

	/**
	 * Unmutes a setInterval operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteInterval(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteInterval(params: i.ClearOptionsId<i.TimerId>): this;
	unmuteInterval(p: any): this {
		return this.markTask('!muted', p, this.namespaces.interval);
	}

	/**
	 * Suspends a setInterval operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendInterval(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendInterval(params: i.ClearOptionsId<i.TimerId>): this;
	suspendInterval(p: any): this {
		return this.markTask('paused', p, this.namespaces.interval);
	}

	/**
	 * Unsuspends a setImmediate operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendInterval(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendInterval(params: i.ClearOptionsId<i.TimerId>): this;
	unsuspendInterval(p: any): this {
		return this.markTask('!paused', p, this.namespaces.interval);
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
	setTimeout(fn: Function, timer: number, params?: i.AsyncCbOptions<CTX>): Nullable<i.TimerId> {
		return this.registerTask({
			...params,
			name: this.namespaces.timeout,
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
	clearTimeout(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearTimeout(params: i.ClearOptionsId<i.TimerId>): this;
	clearTimeout(p: any): this {
		return this.cancelTask(p, this.namespaces.timeout);
	}

	/**
	 * Mutes a setTimeout operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteTimeout(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteTimeout(params: i.ClearOptionsId<i.TimerId>): this;
	muteTimeout(p: any): this {
		return this.markTask('muted', p, this.namespaces.timeout);
	}

	/**
	 * Unmutes a setTimeout operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteTimeout(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteTimeout(params: i.ClearOptionsId<i.TimerId>): this;
	unmuteTimeout(p: any): this {
		return this.markTask('!muted', p, this.namespaces.timeout);
	}

	/**
	 * Suspends a setTimeout operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendTimeout(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendTimeout(params: i.ClearOptionsId<i.TimerId>): this;
	suspendTimeout(p: any): this {
		return this.markTask('paused', p, this.namespaces.timeout);
	}

	/**
	 * Unsuspends a setTimeout operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendTimeout(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendTimeout(params: i.ClearOptionsId<i.TimerId>): this;
	unsuspendTimeout(p: any): this {
		return this.markTask('!paused', p, this.namespaces.timeout);
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
		fn: i.IdleCb<R, CTX>,
		params?: i.AsyncCreateIdleOptions<CTX>
	): Nullable<i.TimerId> {
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
			...params && Object.reject(params, 'timeout'),
			name: this.namespaces.idleCallback,
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
	cancelIdleCallback(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	cancelIdleCallback(params: i.ClearOptionsId<i.TimerId>): this;
	cancelIdleCallback(p: any): this {
		return this.clearIdleCallback(p);
	}

	/**
	 * Wrapper for cancelIdleCallback
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	clearIdleCallback(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearIdleCallback(params: i.ClearOptionsId<i.TimerId>): this;
	clearIdleCallback(p: any): this {
		return this.cancelTask(p, this.namespaces.idleCallback);
	}

	/**
	 * Mutes a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteIdleCallback(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteIdleCallback(params: i.ClearOptionsId<i.TimerId>): this;
	muteIdleCallback(p: any): this {
		return this.markTask('muted', p, this.namespaces.idleCallback);
	}

	/**
	 * Unmutes a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteIdleCallback(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteIdleCallback(params: i.ClearOptionsId<i.TimerId>): this;
	unmuteIdleCallback(p: any): this {
		return this.markTask('!muted', p, this.namespaces.idleCallback);
	}

	/**
	 * Suspends a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendIdleCallback(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendIdleCallback(params: i.ClearOptionsId<i.TimerId>): this;
	suspendIdleCallback(p: any): this {
		return this.markTask('paused', p, this.namespaces.idleCallback);
	}

	/**
	 * Unsuspends a requestIdleCallback operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendIdleCallback(id?: i.TimerId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendIdleCallback(params: i.ClearOptionsId<i.TimerId>): this;
	unsuspendIdleCallback(p: any): this {
		return this.markTask('!paused', p, this.namespaces.idleCallback);
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
	sleep(timer: number, params?: i.AsyncOptions): Promise<void> {
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
	nextTick(params?: i.AsyncOptions): Promise<void> {
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
	idle(params?: i.AsyncIdleOptions): Promise<IdleDeadline> {
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
	wait(fn: Function, params?: i.AsyncWaitOptions): Promise<boolean> {
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
}
