/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/event/README.md]]
 * @packageDocumentation
 */

import SyncPromise from 'core/promise/sync';
import { deprecate } from 'core/meta/deprecation';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

/**
 * Returns a promise that will be resolved after emitting of all events from the specified emitter
 *
 * @param emitter
 * @param events
 */
export function resolveAfterEvents(emitter: EventEmitter, ...events: string[]): SyncPromise<void> {
	return new SyncPromise((resolve) => {
		const
			res = {};

		for (let i = 0; i < events.length; i++) {
			const
				ev = events[i];

			res[ev] = false;
			emitter.once(ev, () => {
				res[ev] = true;

				if (events.every((e: string) => res[e])) {
					resolve();
				}
			});
		}
	});
}

/**
 * Returns a promise that will be resolved after the DOMContentLoaded event
 */
export function resolveAfterDOMLoaded(): SyncPromise<void> {
	return new SyncPromise((resolve) => {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', resolve);

		} else {
			resolve();
		}
	});
}

/**
 * Wraps a callback function into a new function that never calls the target until all specified flags are resolved.
 * The function returns a new function that takes a string flag and resolves it.
 * After all flags are resolved, the last function invokes the target function.
 *
 * @param cb
 * @param flags
 */
export function createsAsyncSemaphore<T>(cb: () => T, ...flags: string[]): (flag: string) => CanUndef<T> {
	const
		flagsStatus = Object.createDict();

	let
		ready = false;

	return (flag) => {
		if (ready || flagsStatus[flag]) {
			return;
		}

		flagsStatus[flag] = true;

		for (let i = 0; i < flags.length; i++) {
			if (!flagsStatus[flags[i]]) {
				return;
			}
		}

		ready = true;

		const
			res = cb();

		if (Object.isPromise(res)) {
			res.catch(stderr);
		}

		return res;
	};
}

/**
 * @deprecated
 * @see [[createsAsyncSemaphore]]
 */
export const onEverythingReady = deprecate(
	{
		renamedTo: 'createsAsyncSemaphore'
	},

	function onEverythingReady(cb: () => unknown, ...flags: string[]): (flag: string) => void {
		return createsAsyncSemaphore(cb, ...flags);
	}
);

/**
 * @deprecated
 * @see [[resolveAfterEvents]]
 */
export const afterEvents = deprecate(
	{
		alternative: 'resolveAfterEvents'
	},

	function afterEvents(emitter: EventEmitter, cb: Function | string, ...events: string[]): SyncPromise<void> {
		const
			promise = resolveAfterEvents(emitter, ...(<string[]>[]).concat(Object.isString(cb) ? cb : [], events));

		if (Object.isFunction(cb)) {
			promise.then(cb);
		}

		return promise;
	}
);

/**
 * @deprecated
 * @see [[resolveAfterDOMLoaded]]
 */
export const afterDOMLoaded = deprecate(
	{
		alternative: 'resolveAfterDOMLoaded'
	},

	function afterDOMLoaded(cb?: Function): SyncPromise<void> {
		const
			promise = resolveAfterDOMLoaded();

		if (cb) {
			promise.then(cb);
		}

		return promise;
	}
);

/**
 * Creates a synchronous promise wrapper for the specified value
 *
 * @deprecated
 * @see [[SyncPromise]]
 * @param resolveValue
 * @param rejectValue
 */
export const createSyncPromise = deprecate(
	{
		alternative: {
			name: 'SyncPromise',
			source: 'core/promise/sync'
		}
	},

	function createSyncPromise<R = unknown>(resolveValue?: R, rejectValue?: unknown): SyncPromise<R> {
		if (rejectValue !== undefined) {
			return SyncPromise.reject(rejectValue);
		}

		return SyncPromise.resolve<any>(resolveValue);
	}
);
