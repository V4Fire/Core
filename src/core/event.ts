/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';

/**
 * Returns a promise that will be resolved after the specified events
 *
 * @param emitter - event emitter
 * @param events
 */
export function afterEvents(emitter: EventEmitter, ...events: string[]): Promise<void> {
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
					resolve();
				}
			});
		}
	});
}

/**
 * Executes the specified function after DOMContentLoaded and returns a promise
 * @param [cb]
 */
export function whenDomLoaded(cb?: () => void): Promise<void> {
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
 * Returns a function that will execute the specified callback after resolving of all flags
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
		if (ready) {
			return;
		}

		flagsStatus[flag] = true;

		for (let i = 0; i < flags.length; i++) {
			if (!flagsStatus[flags[i]]) {
				return;
			}
		}

		ready = true;
		cb();
	};
}
