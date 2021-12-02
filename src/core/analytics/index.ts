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

import engine from '@src/core/analytics/engines';

export * from '@src/core/analytics/interface';

/**
 * Sends the specified analytic event
 */
export function send(...args: unknown[]): void {
	engine(...args);
}
