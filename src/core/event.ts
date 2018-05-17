/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

/**
 * Returns a promise that will be resolved after the specified events
 *
 * @param emitter - event emitter
 * @param events
 */
export function afterEvents(emitter: EventEmitter, ...events: string[]): Promise<void> {
	return new Promise((resolve) => {
		$C(events).to({}).reduce((res, ev) => {
			res[ev] = false;

			emitter.once(ev, () => {
				res[ev] = true;

				if (events.every((e) => res[e])) {
					resolve();
				}
			});

			return res;
		});
	});
}

/**
 * Executes the specified function after DOMContentLoaded
 * @param cb
 */
export function whenDomLoaded(cb: () => void): void {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', cb);

	} else {
		cb();
	}
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

		if ($C(flags).every((name) => flagsStatus[name])) {
			ready = true;
			cb();
		}
	};
}
