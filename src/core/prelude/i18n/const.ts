/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import type { Locale, StringLiteralPluralizeForms } from 'core/prelude/i18n/interface';

/**
 * Event emitter to broadcast localization events
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
 * System language
 */
export const locale: Locale = {
	value: undefined,
	isDefined: false,
	isInitialized: Promise.resolve()
};

/**
 * Dictionary to map literal form to number
 */
export const pluralizeMap: {[key in StringLiteralPluralizeForms]: number} = {
	none: 0,
	one: 1,
	some: 2,
	many: 5
};
