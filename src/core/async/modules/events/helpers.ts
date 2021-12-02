/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Event } from '@src/core/async/interface';

/**
 * Returns true if the specified value is looks like an event object
 * @param value
 */
export function isEvent(value: unknown): value is Event {
	return Object.isPlainObject(value) && Object.isString(value.event);
}
