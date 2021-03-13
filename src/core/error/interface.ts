/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type ErrorCtor<E extends Error> = new (...args: any[]) => E;

export interface ErrorDetailsExtractor<E extends Error> {
	target: ErrorCtor<E>;

	extract(error: E): unknown;
}
