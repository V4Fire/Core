/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import { toString } from 'core/prelude/types/const';

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
export const GLOBAL =
	typeof globalThis === 'object' && isGlobal(globalThis) && globalThis ||
	typeof window === 'object' && isGlobal(window) && window ||
	typeof global === 'object' && isGlobal(global) && global ||
	typeof self === 'object' && isGlobal(self) && self ||

	(function getGlobalUnstrict(this: unknown) {
		return this;
	}()) ||

	// eslint-disable-next-line no-new-func
	new Function('', 'return this')();

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

export const IS_SSR = Boolean(typeof SSR !== 'undefined' && SSR);

/**
 * Checks if the provided value is a global object by confirming the presence of Math,
 * known to exist in any global JS environment
 *
 * @param obj
 */
function isGlobal(obj: any) {
	return Boolean(obj) && obj.Math === Math;
}
