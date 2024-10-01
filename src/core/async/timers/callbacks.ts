/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Super from 'core/async/timers/timers';

import { PrimitiveNamespaces } from 'core/async/const';

import type {

	TimerId,
	IdleCb,
	ClearOptionsId,

	AnimationFrameCb,

	AsyncRequestIdleCallbackOptions,
	AsyncRequestAnimationFrameOptions

} from 'core/async/interface';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * A wrapper for `globalThis.requestIdleCallback`
	 *
	 * @param cb - the callback function
	 * @param [opts] - additional options for the operation
	 */
	requestIdleCallback<R = unknown>(
		cb: IdleCb<R, CTX>,
		opts?: AsyncRequestIdleCallbackOptions<CTX>
	): Nullable<TimerId> {
		let
			wrapper: AnyFunction,
			clear: AnyFunction;

		if (typeof requestIdleCallback !== 'function') {
			wrapper = (fn: IdleRequestCallback) => setTimeout(() => fn({timeRemaining: () => 0, didTimeout: true}), 50);
			clear = clearTimeout;

		} else {
			wrapper = requestIdleCallback;
			clear = cancelIdleCallback;
		}

		return this.registerTask({
			...opts && Object.reject(opts, 'timeout'),

			task: cb,
			namespace: PrimitiveNamespaces.idleCallback,

			wrapper,
			clear,

			linkByWrapper: true,
			args: opts != null ? {timeout: opts.timeout} : undefined
		});
	}

	/**
	 * A wrapper for `globalThis.cancelIdleCallback`
	 *
	 * @alias
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	cancelIdleCallback(id?: TimerId): this;

	/**
	 * Clears the specified `requestIdleCallback` timer or a group of timers
	 *
	 * @alias
	 * @param opts - options for the operation
	 */
	cancelIdleCallback(opts: ClearOptionsId<TimerId>): this;
	cancelIdleCallback(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.clearIdleCallback(Object.cast(task));
	}

	/**
	 * A wrapper for `globalThis.cancelIdleCallback`
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	clearIdleCallback(id?: TimerId): this;

	/**
	 * Clears the specified `requestIdleCallback` timer or a group of timers
	 * @param opts - options for the operation
	 */
	clearIdleCallback(opts: ClearOptionsId<TimerId>): this;
	clearIdleCallback(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.cancelTask(task, PrimitiveNamespaces.idleCallback);
	}

	/**
	 * Mutes the specified `requestIdleCallback` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	muteIdleCallback(id?: TimerId): this;

	/**
	 * Mutes the specified `requestIdleCallback` timer or a group of timers
	 * @param opts - options for the operation
	 */
	muteIdleCallback(opts: ClearOptionsId<TimerId>): this;
	muteIdleCallback(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('muted', task, PrimitiveNamespaces.idleCallback);
	}

	/**
	 * Unmutes the specified `requestIdleCallback` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	unmuteIdleCallback(id?: TimerId): this;

	/**
	 * Unmutes the specified `requestIdleCallback` timer or a group of timers
	 * @param opts - options for the operation
	 */
	unmuteIdleCallback(opts: ClearOptionsId<TimerId>): this;
	unmuteIdleCallback(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!muted', task, PrimitiveNamespaces.idleCallback);
	}

	/**
	 * Suspends the specified `requestIdleCallback` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	suspendIdleCallback(id?: TimerId): this;

	/**
	 * Suspends the specified `requestIdleCallback` timer or a group of timers
	 * @param opts - options for the operation
	 */
	suspendIdleCallback(opts: ClearOptionsId<TimerId>): this;
	suspendIdleCallback(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('paused', task, PrimitiveNamespaces.idleCallback);
	}

	/**
	 * Unsuspends the specified `requestIdleCallback` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	unsuspendIdleCallback(id?: TimerId): this;

	/**
	 * Unsuspends the specified `requestIdleCallback` timer or a group of timers
	 * @param opts - options for the operation
	 */
	unsuspendIdleCallback(opts: ClearOptionsId<TimerId>): this;
	unsuspendIdleCallback(task?: TimerId | ClearOptionsId<TimerId>): this {
		return this.markTask('!paused', task, PrimitiveNamespaces.idleCallback);
	}

	/**
	 * A wrapper for `globalThis.requestAnimationFrame`
	 *
	 * @param cb - the callback function
	 * @param [elem] - a link for the DOM element
	 */
	requestAnimationFrame<T = unknown>(cb: AnimationFrameCb<T, CTX>, elem?: Element): Nullable<number>;

	/**
	 * A wrapper for `globalThis.requestAnimationFrame`
	 *
	 * @param cb - the callback function
	 * @param opts - additional options for the operation
	 */
	requestAnimationFrame<T = unknown>(
		cb: AnimationFrameCb<T, CTX>,
		opts: AsyncRequestAnimationFrameOptions<CTX>
	): Nullable<number>;

	requestAnimationFrame<T>(
		cb: AnimationFrameCb<T, CTX>,
		p?: Element | AsyncRequestAnimationFrameOptions<CTX>
	): Nullable<number> {
		if (Object.isDictionary(p)) {
			return this.registerTask({
				...p,

				task: cb,
				namespace: PrimitiveNamespaces.animationFrame,

				wrapper: requestAnimationFrame,
				clear: cancelAnimationFrame,

				linkByWrapper: true,
				args: p.element
			});
		}

		return this.registerTask({
			task: cb,
			namespace: PrimitiveNamespaces.animationFrame,

			wrapper: requestAnimationFrame,
			clear: cancelAnimationFrame,

			linkByWrapper: true,
			args: p
		});
	}

	/**
	 * A wrapper for `globalThis.cancelAnimationFrame`
	 *
	 * @alias
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	cancelAnimationFrame(id?: number): this;

	/**
	 * Clears the specified `requestAnimationFrame` timer or a group of timers
	 * @param opts - options for the operation
	 */
	cancelAnimationFrame(opts: ClearOptionsId<number>): this;
	cancelAnimationFrame(task?: number | ClearOptionsId<number>): this {
		return this.clearAnimationFrame(Object.cast(task));
	}

	/**
	 * A wrapper for `globalThis.cancelAnimationFrame`
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	clearAnimationFrame(id?: number): this;

	/**
	 * Clears the specified `requestAnimationFrame` timer or a group of timers
	 * @param opts - options for the operation
	 */
	clearAnimationFrame(opts: ClearOptionsId<number>): this;
	clearAnimationFrame(task?: number | ClearOptionsId<number>): this {
		return this.cancelTask(task, PrimitiveNamespaces.animationFrame);
	}

	/**
	 * Mutes the specified `requestAnimationFrame` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	muteAnimationFrame(id?: number): this;

	/**
	 * Mutes the specified `requestAnimationFrame` timer or a group of timers
	 * @param opts - options for the operation
	 */
	muteAnimationFrame(opts: ClearOptionsId<number>): this;
	muteAnimationFrame(task?: number | ClearOptionsId<number>): this {
		return this.markTask('muted', task, PrimitiveNamespaces.animationFrame);
	}

	/**
	 * Unmutes the specified `requestAnimationFrame` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	unmuteAnimationFrame(id?: number): this;

	/**
	 * Unmutes the specified `requestAnimationFrame` timer or a group of timers
	 * @param opts - options for the operation
	 */
	unmuteAnimationFrame(opts: ClearOptionsId<number>): this;
	unmuteAnimationFrame(task?: number | ClearOptionsId<number>): this {
		return this.markTask('!muted', task, PrimitiveNamespaces.animationFrame);
	}

	/**
	 * Suspends the specified `requestAnimationFrame` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	suspendAnimationFrame(id?: number): this;

	/**
	 * Suspends the specified `requestAnimationFrame` timer or a group of timers
	 * @param opts - options for the operation
	 */
	suspendAnimationFrame(opts: ClearOptionsId<number>): this;
	suspendAnimationFrame(task?: number | ClearOptionsId<number>): this {
		return this.markTask('paused', task, PrimitiveNamespaces.animationFrame);
	}

	/**
	 * Unsuspends the specified `requestAnimationFrame` timer
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	unsuspendAnimationFrame(id?: number): this;

	/**
	 * Unsuspends the specified `requestAnimationFrame` timer or a group of timers
	 * @param opts - options for the operation
	 */
	unsuspendAnimationFrame(opts: ClearOptionsId<number>): this;
	unsuspendAnimationFrame(task?: number | ClearOptionsId<number>): this {
		return this.markTask('!paused', task, PrimitiveNamespaces.animationFrame);
	}
}
