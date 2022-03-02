/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface ControllablePromise<T = unknown> extends Promise<T> {
	resolve(value?: T | PromiseLike<T>, ...args: any[]): this;
	reject(reason: any, ...args: any[]): this;
}

export interface ControllablePromiseResolveHandler<T = unknown> {
	(value?: T | PromiseLike<T>, ...args: any[]): AnyToIgnore;
}

export interface ControllablePromiseRejectHandler {
	(reason?: unknown, ...args: any[]): AnyToIgnore;
}

export interface CreateControllablePromiseOptions<T = unknown> {
	/**
	 * Promise constructor
	 * @default `Promise`
	 */
	type?: PromiseConstructor;

	/**
	 * Promise constructor executor
	 *
	 * @param resolve
	 * @param reject
	 * @param args
	 */
	executor?(
		resolve: ControllablePromiseResolveHandler<T>,
		reject: ControllablePromiseRejectHandler,
		...args: any[]
	): AnyToIgnore;
}
