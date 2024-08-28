/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Event } from '../../../core/async/interface';
/**
 * Returns true if the specified value is looks like an event object
 * @param value
 */
export declare function isEvent(value: unknown): value is Event;
