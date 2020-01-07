/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';

export const
	/**
	 * The event emitter for broadcasting environment events
	 */
	emitter = new EventEmitter({maxListeners: 100, newListener: false}),

	/** @deprecated */
	event = emitter;

/**
 * Link to the global object
 */
export const
	GLOBAL = Function('return this')();

if (typeof globalThis === 'undefined') {
	GLOBAL.globalThis = GLOBAL;
}

/**
 * True if the current runtime has window object
 */
export const HAS_WINDOW: boolean = typeof window === 'object';

/**
 * True if the current runtime is looks like node.js
 */
export const IS_NODE: boolean = (() => {
	try {
		const
			// tslint:disable-next-line
			process = globalThis['process'];

		// @ts-ignore
		return typeof process === 'object' && {}.toString.call(process) === '[object process]';

	} catch {
		return false;
	}
})();
