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

export type Value<T = unknown> = PromiseLike<T> | T;
export type ExecutableValue<T = unknown> = (() => T) | Value<T>;

export interface ResolveHandler<T = unknown> {
	(value?: Value<T>): void;
}

export interface RejectHandler {
	(reason?: unknown): void;
}

export interface AbortHandler {
	(cb: RejectHandler): void;
}

export interface ThenFulfillHandler<V = unknown, R = V> {
	(value: V): Value<R>;
}

export type ThenRejectHandler<T = unknown> = ThenFulfillHandler<unknown, T>;

export interface Executor<T = unknown> {
	(resolve: ResolveHandler<T>, reject: RejectHandler, onAbort: AbortHandler): void;
}
