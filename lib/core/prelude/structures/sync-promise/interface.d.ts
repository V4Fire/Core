/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export declare enum State {
    pending = 0,
    fulfilled = 1,
    rejected = 2
}
export declare type Value<T = unknown> = CanPromiseLike<T>;
export interface ConstrResolveHandler<T = unknown> {
    (value?: Value<T>): void;
}
export interface ConstrRejectHandler {
    (reason?: unknown): void;
}
export interface Executor<T = unknown> {
    (resolve: ConstrResolveHandler<T>, reject: ConstrRejectHandler): void;
}
export declare type ResolveHandler<V = unknown, R = V> = Function | ((value: V) => Value<R>);
export declare type RejectHandler<T = unknown> = ResolveHandler<unknown, T>;
