/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface ThrottleOptions {
	/**
	 * Delay to wait in milliseconds
	 * @default `250`
	 */
	delay?: number;

	/**
	 * If true, then all rest invokes that caught in the sleep span are ignored
	 * @default `false`
	 */
	single?: boolean;
}
