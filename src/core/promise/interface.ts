/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type ControllablePromise<P extends PromiseLike<any> = Promise<unknown>> = P & {
	/**
	 * True if the current promise is pending
	 */
	readonly isPending: boolean;

	/**
	 * Resolves the promise with the specified value
	 *
	 * @param value
	 * @param [args] - extra arguments to pass
	 */
	resolve(value?: PromiseType<P> | PromiseLike<PromiseType<P>>, ...args: any[]): P;

	/**
	 * Rejects the promise with the specified value
	 *
	 * @param reason
	 * @param [args] - extra arguments to pass
	 */
	reject(reason: any, ...args: any[]): P;
};

export interface ControllablePromiseResolveHandler<T = unknown> {
	(value?: T | PromiseLike<T>, ...args: any[]): void;
}

export interface ControllablePromiseRejectHandler {
	(reason?: unknown, ...args: any[]): void;
}

export interface ControllablePromiseExecutor<T = unknown> {
	(
		resolve: ControllablePromiseResolveHandler<T>,
		reject: ControllablePromiseRejectHandler,
		...args: any[]
	): void;
}

export interface ControllablePromiseConstructor<T = unknown> {
	new(executor: ControllablePromiseExecutor<T>, ...args: any[]): PromiseLike<T>;
}

export interface CreateControllablePromiseOptions<T extends ControllablePromiseConstructor> {
	/**
	 * Promise constructor
	 * @default `Promise`
	 */
	type?: T;

	/**
	 * Promise constructor executor
	 *
	 * @param resolve
	 * @param reject
	 * @param args
	 */
	executor?(
		resolve: ControllablePromiseResolveHandler,
		reject: ControllablePromiseRejectHandler,
		...args: any[]
	): void;

	/**
	 * Extra arguments to pass to the promise constructor
	 */
	args?: Iterable<any>;
}
