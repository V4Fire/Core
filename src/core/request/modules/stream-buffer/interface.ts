/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface ControllablePromise<T = unknown> extends Promise<T> {
	resolve(value?: T): void;
	reject(error: any): void;
}
