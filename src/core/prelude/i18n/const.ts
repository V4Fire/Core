/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import { Locale } from 'core/prelude/i18n/interface';

export const
	/**
	 * The event emitter for broadcasting localization events
	 */
	emitter = new EventEmitter({maxListeners: 100, newListener: false}),

	/** @deprecated */
	event = emitter;

/**
 * System language
 */
export const locale = <Locale>{
	value: '',
	isDefined: false,
	isInitialized: Promise.resolve()
};
