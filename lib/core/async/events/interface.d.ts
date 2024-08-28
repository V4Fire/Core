/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type Async from '../../../core/async';
import type { IdObject, ProxyCb, AsyncOptions, AsyncCbOptions, AsyncCbOptionsSingle } from '../../../core/async/core';
export declare type EventId = CanArray<IdObject>;
export declare type EmitLikeEvents = 'emit' | 'fire' | 'dispatch' | 'dispatchEvent';
/**
 * Something that looks like an event emitter
 */
export interface EventEmitterLike {
    on?: Function;
    addListener?: Function;
    addEventListener?: Function;
    once?: Function;
    off?: Function;
    removeListener?: Function;
    removeEventListener?: Function;
    emit?: Function;
    fire?: Function;
    dispatch?: Function;
    dispatchEvent?: Function;
}
/**
 * Extended type of event emitter
 */
export declare type EventEmitterLikeP = ((event: string, handler: Function) => CanUndef<Function>) | EventEmitterLike;
export interface AsyncOnOptions<CTX extends object = Async> extends AsyncCbOptionsSingle<CTX> {
    /**
     * Additional options for the emitter
     */
    options?: Dictionary;
}
export interface AsyncOnceOptions<T extends object = Async> extends AsyncCbOptions<T> {
    /**
     * Additional options for the emitter
     */
    options?: Dictionary;
}
export interface AsyncPromisifyOnceOptions<E = unknown, R = unknown, CTX extends object = Async> extends AsyncOptions {
    /**
     * Event handler (the result of invoking is provided to a promise)
     */
    handler?: ProxyCb<E, R, CTX>;
    /**
     * Additional options for the emitter
     */
    options?: Dictionary;
}
/**
 * Event object
 */
export interface Event<E extends EventEmitterLikeP = EventEmitterLikeP> {
    /**
     * Event emitter
     */
    emitter: E;
    /**
     * Event name
     */
    event: string;
    /**
     * Event handler
     */
    handler: ProxyCb;
    /**
     * Additional arguments for the emitter
     */
    args: unknown[];
}
