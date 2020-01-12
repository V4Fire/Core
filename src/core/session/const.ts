/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';

/**
 * Event emitter for broadcasting session events
 */
export const
	emitter = new EventEmitter({maxListeners: 100, newListener: false});

/**
 * @deprecated
 * @see [[emitter]]
 */
export const
	event = emitter;
