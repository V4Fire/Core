/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Engine to send analytic events
 */
export interface AnalyticEngine {
	(...args: AnyArgs): any;
}
