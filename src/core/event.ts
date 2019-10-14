/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';

/**
 * Returns a promise that will be resolved after the specified events from an event emitter
 * (optionally can takes a callback function, that will be executed immediately after the event)
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
 * (optionally can takes a callback function, that will be executed immediately after the event)
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
export function onEverythingReady(cb: () => void, ...flags: string[]): (flag: string) => void {
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
 * @param resolveValue
 * @param rejectValue
 */
export function createSyncPromise<R = unknown>(resolveValue?: R, rejectValue?: unknown): Promise<R> {
	return <any>{
		then: (resolve, reject) => {
			try {
				if (rejectValue !== undefined) {
					return createSyncPromise(undefined, reject ? reject(rejectValue) : rejectValue);
				}

				return createSyncPromise(resolve ? resolve(resolveValue) : resolveValue);

			} catch (err) {
				return createSyncPromise(undefined, reject ? reject(err) : err);
			}
		},

		catch: (cb) => createSyncPromise(undefined, cb(rejectValue)),
		finally: (cb) => createSyncPromise(cb())
	};
}
