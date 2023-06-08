/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/analytics/README.md]]
 */

import engine from 'core/analytics/engines';

export * from 'core/analytics/interface';

/**
 * Sends the specified analytic event
 */
export function send(...args: unknown[]): void {
	engine(...args);
}
