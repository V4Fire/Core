/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/async/timers/README.md]]
 * @packageDocumentation
 */

import SyncPromise from 'core/promise/sync';

import Super from 'core/async/timers/callbacks';

import { PromiseNamespaces } from 'core/async/const';

import type {

	AsyncCb,
	TimerId,

	AsyncOptions,
	AsyncIdleOptions,
	AsyncAnimationFrameOptions,
	AsyncWaitOptions

} from 'core/async/interface';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * Returns a promise that will be resolved after the specified timeout
	 *
	 * @param timeout
	 * @param [opts] - additional options for the operation
	 */
	sleep(timeout: number, opts?: AsyncOptions): Promise<void> {
		return new SyncPromise((resolve, reject) => {
			this.setTimeout(resolve, timeout, {
				...opts,
				promise: PromiseNamespaces.timeoutPromise,
				onClear: <AsyncCb<CTX>>this.onPromiseClear(resolve, reject),
				onMerge: <AsyncCb<CTX>>this.onPromiseMerge(resolve, reject)
			});
		});
	}

	/**
	 * Returns a promise that will be resolved on the next tick of the event loop
	 * @param [opts] - additional options for the operation
	 */
	nextTick(opts?: AsyncOptions): Promise<void> {
		return new SyncPromise((resolve, reject) => {
			this.setImmediate(resolve, {
				...opts,
				promise: PromiseNamespaces.immediatePromise,
				onClear: <AsyncCb<CTX>>this.onPromiseClear(resolve, reject),
				onMerge: <AsyncCb<CTX>>this.onPromiseMerge(resolve, reject)
			});
		});
	}

	/**
	 * Returns a promise that will be resolved on the process idle
	 * @param [opts] - additional options for the operation
	 */
	idle(opts?: AsyncIdleOptions): Promise<IdleDeadline> {
		return new SyncPromise((resolve, reject) => {
			this.requestIdleCallback(resolve, {
				...opts,
				promise: PromiseNamespaces.idleCallbackPromise,
				onClear: <AsyncCb<CTX>>this.onPromiseClear(resolve, reject),
				onMerge: <AsyncCb<CTX>>this.onPromiseMerge(resolve, reject)
			});
		});
	}

	/**
	 * Returns a promise that will be resolved on the next animation frame request
	 * @param [elem] - a link for the DOM element
	 */
	animationFrame(elem?: Element): SyncPromise<number>;

	/**
	 * Returns a promise that will be resolved on the next animation frame request
	 * @param opts - options for the operation
	 */
	animationFrame(opts: AsyncAnimationFrameOptions): SyncPromise<number>;
	animationFrame(p?: Element | AsyncAnimationFrameOptions): SyncPromise<number> {
		return new SyncPromise((resolve, reject) => {
			if (Object.isPlainObject(p)) {
				return this.requestAnimationFrame(resolve, {
					...p,
					promise: PromiseNamespaces.animationFramePromise,
					element: p.element,
					onClear: <AsyncCb<CTX>>this.onPromiseClear(resolve, reject)
				});
			}

			return this.requestAnimationFrame(resolve, {
				promise: PromiseNamespaces.animationFramePromise,
				element: p,
				onClear: <AsyncCb<CTX>>this.onPromiseClear(resolve, reject)
			});
		});
	}

	/**
	 * Returns a promise that will be resolved only when the specified function returns a positive value (== true)
	 *
	 * @param fn
	 * @param [opts] - additional options for the operation
	 */
	wait(fn: Function, opts?: AsyncWaitOptions): Promise<boolean> {
		if (Object.isTruly(fn())) {
			if (opts?.label != null) {
				this.clearPromise(opts);
			}

			return SyncPromise.resolve(true);
		}

		return new SyncPromise((resolve, reject) => {
			// eslint-disable-next-line prefer-const
			let id: Nullable<TimerId>;

			const cb = () => {
				if (Object.isTruly(fn())) {
					resolve(true);

					if (id != null) {
						this.clearInterval(id);
					}
				}
			};

			id = this.setInterval(cb, opts?.delay ?? 15, {
				...opts,
				promise: PromiseNamespaces.intervalPromise,
				onClear: <AsyncCb<CTX>>this.onPromiseClear(resolve, reject),
				onMerge: <AsyncCb<CTX>>this.onPromiseMerge(resolve, reject)
			});
		});
	}
}
