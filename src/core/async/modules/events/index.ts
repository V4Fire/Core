/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/async/modules/events/README.md]]
 * @packageDocumentation
 */

import SyncPromise from 'core/promise/sync';

import Super, {

	IdObject,
	ProxyCb,

	StrictClearOptionsId

} from 'core/async/modules/timers';

import { isEvent } from 'core/async/modules/events/helpers';

import type {

	Event,
	EventId,

	EventEmitterLike,
	EventEmitterLikeP,

	AsyncOnOptions,
	AsyncOnceOptions,
	AsyncPromisifyOnceOptions

} from 'core/async/interface';

export * from 'core/async/modules/timers';
export * from 'core/async/modules/events/helpers';

export * from 'core/async/interface';

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
	on<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		...args: unknown[]
	): Nullable<EventId>;

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
	on<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		opts: AsyncOnOptions<CTX>,
		...args: unknown[]
	): Nullable<EventId>;

	on<E, R>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		opts?: AsyncOnOptions<CTX> | unknown[],
		...args: unknown[]
	): Nullable<EventId> {
		let
			p: AsyncOnOptions<CTX>;

		if (Object.isArray(opts)) {
			args.unshift(opts);
			p = {};

		} else {
			p = opts ?? {};
		}

		p = {...p};
		events = Object.isArray(events) ? events : events.split(/\s+/);

		if (p.options) {
			args.unshift(p.options);
			p.options = undefined;
		}

		const
			that = this,
			links: IdObject[] = [],
			multipleEvent = events.length > 1;

		for (let i = 0; i < events.length; i++) {
			const
				event = events[i];

			const link = this.registerTask<IdObject>({
				...p,

				name: this.namespaces.eventListener,
				obj: handler,

				group: p.group ?? event,
				periodic: !p.single,
				linkByWrapper: true,

				clearFn: this.eventListenerDestructor
					.bind(this),

				wrapper(cb: AnyFunction): unknown {
					if (Object.isFunction(emitter)) {
						const
							originalEmitter = emitter;

						// eslint-disable-next-line func-name-matching
						emitter = function wrappedEmitter(this: unknown): CanUndef<Function> {
							const
								// eslint-disable-next-line prefer-rest-params
								res = originalEmitter.apply(this, arguments);

							if (Object.isFunction(res)) {
								Object.set(wrappedEmitter, 'off', res);
							}

							return res;
						};
					}

					const on = Object.isSimpleFunction(emitter) ?
						emitter :

						p.single && emitter.once ||
						emitter.addEventListener ||
						emitter.addListener ||
						emitter.on;

					if (Object.isFunction(on)) {
						on.call(emitter, event, handler, ...args);

					} else {
						throw new ReferenceError('A method to attach events is not defined');
					}

					return {
						event,
						emitter,
						handler,
						args
					};

					function handler(this: unknown, ...handlerArgs: unknown[]): unknown {
						if (p.single && (multipleEvent || !emitter.once)) {
							if (multipleEvent) {
								that.clearEventListener(links);

							} else {
								that.eventListenerDestructor({emitter, event, handler, args});
							}
						}

						const
							res = cb.apply(this, handlerArgs);

						if (Object.isPromise(res)) {
							res.catch(stderr);
						}

						return res;
					}
				}
			});

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (link != null) {
				links.push(link);
			}
		}

		return events.length <= 1 ? links[0] ?? null : links;
	}

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
	once<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		...args: unknown[]
	): Nullable<EventId>;

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
	once<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		opts: AsyncOnceOptions<CTX>,
		...args: unknown[]
	): Nullable<EventId>;

	once<E, R>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		opts?: AsyncOnceOptions<CTX> | unknown[],
		...args: unknown[]
	): Nullable<EventId> {
		let
			p: AsyncOnceOptions<CTX>;

		if (Object.isArray(opts)) {
			args.unshift(opts);
			p = {};

		} else {
			p = opts ?? {};
		}

		return this.on(emitter, events, handler, {...p, single: true}, ...args);
	}

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
	promisifyOnce<R = unknown, E = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		opts: AsyncPromisifyOnceOptions<E, R, CTX>,
		...args: unknown[]
	): Promise<R>;

	/**
	 * Returns a promise that is resolved after emitting the specified event.
	 * If the emitter is a function, it is interpreted as the function to attach events.
	 * Notice, if you don't provide a group for the operation, it will be taken from the event name.
	 *
	 * @param emitter - event emitter
	 * @param events - event or list of events (can also specify multiple events with a space)
	 * @param [args] - additional arguments for the emitter
	 */
	promisifyOnce<R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		...args: unknown[]
	): Promise<R>;

	promisifyOnce<R, E>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		opts?: AsyncPromisifyOnceOptions<E, R, CTX> | unknown[],
		...args: unknown[]
	): Promise<R> {
		let
			p: AsyncPromisifyOnceOptions<E, R, CTX>;

		if (Object.isArray(opts)) {
			args.unshift(opts);
			p = {};

		} else {
			p = opts ?? {};
		}

		return new SyncPromise((resolve, reject) => {
			const handler = (e) => {
				if (Object.isFunction(p.handler)) {
					return resolve(p.handler.call(this.ctx, e));
				}

				resolve(e);
			};

			this.once(emitter, events, handler, {
				...p,
				promise: true,
				onClear: this.onPromiseClear(handler, reject),
				onMerge: this.onPromiseMerge(handler, reject)
			}, ...args);
		});
	}

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

	off(task?: EventId | StrictClearOptionsId<EventId>): this {
		return this.clearEventListener(Object.cast(task));
	}

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
	clearEventListener(task?: EventId | StrictClearOptionsId<EventId>): this {
		if (Object.isArray(task)) {
			for (let i = 0; i < task.length; i++) {
				this.clearEventListener(<EventId>task[i]);
			}

			return this;
		}

		return this.cancelTask(isEvent(task) ? {id: task} : task, this.namespaces.eventListener);
	}

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
	muteEventListener(task?: EventId | StrictClearOptionsId<EventId>): this {
		return this.markEvent('muted', Object.cast(task));
	}

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
	unmuteEventListener(task?: EventId | StrictClearOptionsId<EventId>): this {
		return this.markEvent('!muted', Object.cast(task));
	}

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
	suspendEventListener(task?: EventId | StrictClearOptionsId<EventId>): this {
		return this.markEvent('paused', Object.cast(task));
	}

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
	unsuspendEventListener(p?: EventId | StrictClearOptionsId<EventId>): this {
		return this.markEvent('!paused', Object.cast(p));
	}

	/**
	 * Removes the passed event listener from the specified emitter
	 * @param event - event object
	 */
	eventListenerDestructor(event: Event): void {
		const
			emitter = <EventEmitterLike>event.emitter,
			off = emitter.removeEventListener ?? emitter.removeListener ?? emitter.off;

		if (Object.isFunction(off)) {
			off.call(emitter, event.event, event.handler);

		} else if (!Object.isFunction(emitter)) {
			throw new ReferenceError('A function to remove the event is not defined');
		}
	}

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
	protected markEvent(label: string, task?: EventId | StrictClearOptionsId<EventId>): this {
		if (Object.isArray(task)) {
			for (let i = 0; i < task.length; i++) {
				this.markEvent(label, <EventId>task[i]);
			}

			return this;
		}

		return this.markTask(label, isEvent(task) ? {id: task} : task, this.namespaces.eventListener);
	}
}
