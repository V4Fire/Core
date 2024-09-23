/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import type { Locale, RegionStore } from 'core/prelude/i18n/interface';

/**
 * The event emitter to broadcast localization events
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
 * The default application language
 */
export const locale: Locale = {
	value: undefined,
	isDefault: false
};

/**
 * The default application region
 */
export const region: RegionStore = {
	value: undefined,
	isDefault: false
};
