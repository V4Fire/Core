/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export enum State {
	pending,
	fulfilled,
	rejected
}

export type Value<T = unknown> = CanPromiseLike<T>;
export type ExecutableValue<T = unknown> = (() => T) | Value<T>;

export interface ConstrResolveHandler<T = unknown> {
	(value?: Value<T>): void;
}

export interface ConstrRejectHandler {
	(reason?: unknown): void;
}

export interface ConstrAbortHandler {
	(cb: ConstrRejectHandler): void;
}

export interface Executor<T = unknown> {
	(
		resolve: ConstrResolveHandler<T>,
		reject: ConstrRejectHandler,
		onAbort: ConstrAbortHandler
	): void;
}

export type ResolveHandler<V = unknown, R = V> = Function | ((value: V) => Value<R>);
export type RejectHandler<T = unknown> = ResolveHandler<unknown, T>;
