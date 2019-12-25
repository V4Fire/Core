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
	 * The event emitter for broadcasting session events
	 */
	emitter = new EventEmitter({maxListeners: 100, newListener: false}),

	/** @deprecated */
	event = emitter;
