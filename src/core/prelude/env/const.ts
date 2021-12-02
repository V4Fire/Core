/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import { toString } from '~/core/prelude/types/const';

/**
 * Event emitter to broadcast environment events
 */
export const
	emitter = new EventEmitter({maxListeners: 100, newListener: false});

/**
 * @deprecated
 * @see [[emitter]]
 */
export const
	event = emitter;

/**
 * Link to the global object
 */
export const
	// eslint-disable-next-line no-new-func
	GLOBAL = Function('return this')();

if (typeof globalThis === 'undefined') {
	GLOBAL.globalThis = GLOBAL;
}

/**
 * True if the current runtime has window object
 */
// eslint-disable-next-line no-restricted-globals
export const HAS_WINDOW: boolean = typeof window === 'object';

/**
 * True if the current runtime is looks like Node.js
 */
export const IS_NODE: boolean = (() => {
	try {
		// eslint-disable-next-line prefer-destructuring
		const process = globalThis['process'];
		return typeof process === 'object' && toString.call(process) === '[object process]';

	} catch {
		return false;
	}
})();
