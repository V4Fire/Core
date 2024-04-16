/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import Super, { ProxyCb, StrictClearOptionsId } from '../../../../core/async/modules/timers';
import type { Event, EventId, EventEmitterLikeP, AsyncOnOptions, AsyncOnceOptions, AsyncPromisifyOnceOptions } from '../../../../core/async/interface';
export * from '../../../../core/async/modules/timers';
export * from '../../../../core/async/modules/events/helpers';
export * from '../../../../core/async/interface';
export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
    /**
     * Attaches an event listener from the specified event emitter.
     * If the emitter is a function, it is interpreted as the function to attach events.
     * Notice, if you don't provide a group for the operation, it will be taken from the event name.
     *
     * @param emitter - event emitter
     * @param events - event or list of events (can also specify multiple events by using spaces)
     * @param handler - event handler
     * @param [args] - additional arguments for the emitter
     */
    on<E = unknown, R = unknown>(emitter: EventEmitterLikeP, events: CanArray<string>, handler: ProxyCb<E, R, CTX>, ...args: unknown[]): Nullable<EventId>;
    /**
     * Attaches an event listener from the specified event emitter.
     * If the emitter is a function, it is interpreted as the function to attach events.
     * Notice, if you don't provide a group for the operation, it will be taken from the event name.
     *
     * @param emitter - event emitter
     * @param events - event or list of events (can also specify multiple events by using spaces)
     * @param handler - event handler
     * @param opts - options for the operation
     * @param [args] - additional arguments for the emitter
     */
    on<E = unknown, R = unknown>(emitter: EventEmitterLikeP, events: CanArray<string>, handler: ProxyCb<E, R, CTX>, opts: AsyncOnOptions<CTX>, ...args: unknown[]): Nullable<EventId>;
    /**
     * Attaches an event listener from the specified event emitter, but the event is listened only once.
     * If the emitter is a function, it is interpreted as the function to attach events.
     * Notice, if you don't provide a group for the operation, it will be taken from the event name.
     *
     * @param emitter - event emitter
     * @param events - event or list of events (can also specify multiple events by using spaces)
     * @param handler - event handler
     * @param [args] - additional arguments for the emitter
     */
    once<E = unknown, R = unknown>(emitter: EventEmitterLikeP, events: CanArray<string>, handler: ProxyCb<E, R, CTX>, ...args: unknown[]): Nullable<EventId>;
    /**
     * Attaches an event listener from the specified event emitter, but the event is listened only once.
     * If the emitter is a function, it is interpreted as the function to attach events.
     * Notice, if you don't provide a group for the operation, it will be taken from the event name.
     *
     * @param emitter - event emitter
     * @param events - event or list of events (can also specify multiple events with a space)
     * @param handler - event handler
     * @param opts - options for the operation
     * @param [args] - additional arguments for the emitter
     */
    once<E = unknown, R = unknown>(emitter: EventEmitterLikeP, events: CanArray<string>, handler: ProxyCb<E, R, CTX>, opts: AsyncOnceOptions<CTX>, ...args: unknown[]): Nullable<EventId>;
    /**
     * Returns a promise that is resolved after emitting the specified event.
     * If the emitter is a function, it is interpreted as the function to attach events.
     * Notice, if you don't provide a group for the operation, it will be taken from the event name.
     *
     * @param emitter - event emitter
     * @param events - event or list of events (can also specify multiple events with a space)
     * @param opts - options for the operation
     * @param [args] - additional arguments for the emitter
     */
    promisifyOnce<R = unknown, E = unknown>(emitter: EventEmitterLikeP, events: CanArray<string>, opts: AsyncPromisifyOnceOptions<E, R, CTX>, ...args: unknown[]): Promise<R>;
    /**
     * Returns a promise that is resolved after emitting the specified event.
     * If the emitter is a function, it is interpreted as the function to attach events.
     * Notice, if you don't provide a group for the operation, it will be taken from the event name.
     *
     * @param emitter - event emitter
     * @param events - event or list of events (can also specify multiple events with a space)
     * @param [args] - additional arguments for the emitter
     */
    promisifyOnce<R = unknown>(emitter: EventEmitterLikeP, events: CanArray<string>, ...args: unknown[]): Promise<R>;
    /**
     * Removes the specified event listener
     *
     * @alias
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    off(id?: EventId): this;
    /**
     * Removes the specified event listener or a group of listeners.
     * Notice, you can't remove event listeners by a label without providing a group.
     *
     * @alias
     * @param opts - options for the operation
     */
    off(opts: StrictClearOptionsId<EventId>): this;
    /**
     * Removes the specified event listener
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    clearEventListener(id?: EventId): this;
    /**
     * Removes the specified event listener or a group of listeners.
     * Notice, you can't remove event listeners by a label without providing a group.
     *
     * @param opts - options for the operation
     */
    clearEventListener(opts: StrictClearOptionsId<EventId>): this;
    /**
     * Mutes the specified event listener
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    muteEventListener(id?: EventId): this;
    /**
     * Mutes the specified event listener or a group of listeners.
     * Notice, you can't mute event listeners by a label without providing a group.
     *
     * @param opts - options for the operation
     */
    muteEventListener(opts: StrictClearOptionsId<EventId>): this;
    /**
     * Unmutes the specified event listener
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    unmuteEventListener(id?: EventId): this;
    /**
     * Unmutes the specified event listener or a group of listeners.
     * Notice, you can't unmute event listeners by a label without providing a group.
     *
     * @param opts - options for the operation
     */
    unmuteEventListener(opts: StrictClearOptionsId<EventId>): this;
    /**
     * Suspends the specified event listener
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    suspendEventListener(id?: EventId): this;
    /**
     * Suspends the specified event listener or a group of listeners.
     * Notice, you can't suspend event listeners by a label without providing a group.
     *
     * @param opts - options for the operation
     */
    suspendEventListener(opts: StrictClearOptionsId<EventId>): this;
    /**
     * Unsuspends the specified event listener
     * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
     */
    unsuspendEventListener(id?: EventId): this;
    /**
     * Unsuspends the specified event listener or a group of listeners.
     * Notice, you can't unsuspend event listeners by a label without providing a group.
     *
     * @param opts - options for the operation
     */
    unsuspendEventListener(opts: StrictClearOptionsId<EventId>): this;
    /**
     * Removes the passed event listener from the specified emitter
     * @param event - event object
     */
    eventListenerDestructor(event: Event): void;
    /**
     * Marks an event task with the specified label
     *
     * @param label
     * @param [id] - operation id (if not specified, the operation will be extended for all promise namespaces)
     */
    protected markEvent(label: string, id?: EventId): this;
    /**
     * Marks an event task or group of tasks with the specified label
     *
     * @param label
     * @param opts - additional options
     */
    protected markEvent(label: string, opts: StrictClearOptionsId<EventId>): this;
}
