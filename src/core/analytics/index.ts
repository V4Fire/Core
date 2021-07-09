/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/analytics/README.md]]
 * @packageDocumentation
 */

import engine from 'core/analytics/engines';

export * from 'core/analytics/interface';

/**
 * Sends an analytic event with the specified details
 *
 * @param event - event name
 * @param [details] - event details
 * @param [engine] - engine to send the event
 */
export function send(...args: unknown[]): void {
	engine(...args);
}
