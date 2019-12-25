/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/promise/sync';
import { deprecate } from 'core/meta/deprecation';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

/**
 * Returns a promise that will be resolved after emitting all events from the specified emitter
 * (optionally can takes a callback function, that is invoked immediately after the event)
 *
 * @param emitter
 * @param cb
 * @param events
 */
export function afterEvents(emitter: EventEmitter, cb: Function, ...events: string[]): Promise<void>;

/**
 * @param emitter
 * @param events
 */
export function afterEvents(emitter: EventEmitter, ...events: string[]): Promise<void>;
export function afterEvents(emitter: EventEmitter, cb: Function | string, ...events: string[]): Promise<void> {
	if (Object.isString(cb)) {
		events.unshift(cb);
	}

	return new Promise((resolve) => {
		const
			res = {};

		for (let i = 0; i < events.length; i++) {
			const
				ev = events[i];

			res[ev] = false;
			emitter.once(ev, () => {
				res[ev] = true;

				if (events.every((e: string) => res[e])) {
					if (Object.isFunction(cb)) {
						cb();
					}

					resolve();
				}
			});
		}
	});
}

/**
 * Returns a promise that will be resolved after DOMContentLoaded
 * (optionally can takes a callback function, that is invoked immediately after the event)
 *
 * @param [cb]
 */
export function afterDOMLoaded(cb?: Function): Promise<void> {
	return new Promise((resolve) => {
		const exec = () => {
			cb && cb();
			resolve();
		};

		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', exec);

		} else {
			exec();
		}
	});
}

/**
 * Returns a function that takes a string flag value and resolves it.
 * After all flags will be resolved, the last function executes the specified callback.
 *
 * @param cb
 * @param flags
 */
export function onEverythingReady(cb: () => unknown, ...flags: string[]): (flag: string) => void {
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
	};
}

/**
 * Creates a synchronous promise wrapper for the specified value
 *
 * @deprecated
 * @see SyncPromise
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
