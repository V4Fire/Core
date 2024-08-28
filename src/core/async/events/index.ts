/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/async/events/README.md]]
 * @packageDocumentation
 */

import SyncPromise from 'core/promise/sync';

import Super from 'core/async/timers';

import { PromiseNamespaces, PrimitiveNamespaces } from 'core/async/const';
import { isEvent } from 'core/async/events/helpers';

import type {

	IdObject,
	EventId,
	StrictClearOptionsId,

	Event,
	Marker,

	ProxyCb,

	EventEmitterLike,
	EventEmitterLikeP,

	AsyncOnOptions,
	AsyncOnceOptions,
	AsyncPromisifyOnceOptions

} from 'core/async/interface';

export * from 'core/async/timers';
export * from 'core/async/events/helpers';

export * from 'core/async/interface';

const OFF = Symbol('off');

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * Attaches an event listener to the specified event emitter.
	 * If the emitter is a function, it is interpreted as the function to attach events to.
	 * Note that if you don't provide a group for the operation, it will be taken from the event name.
	 *
	 * @param emitter - the event emitter
	 * @param events - the event name or a list of events (can also specify multiple events by using spaces)
	 * @param handler - the event handler
	 * @param [args] - additional arguments for the emitter
	 */
	on<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		...args: unknown[]
	): Nullable<EventId>;

	/**
	 * Attaches an event listener to the specified event emitter.
	 * If the emitter is a function, it is interpreted as the function to attach events to.
	 * Note that if you don't provide a group for the operation, it will be taken from the event name.
	 *
	 * @param emitter - the event emitter
	 * @param events - the event name or a list of events (can also specify multiple events by using spaces)
	 * @param handler - the event handler
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
		let p: AsyncOnOptions<CTX>;

		if (Object.isArray(opts)) {
			args.unshift(opts);
			p = {};

		} else {
			p = opts ?? {};
		}

		p = {...p};

		if (Object.isString(events)) {
			events = events.includes(' ') ? events.split(/\s+/) : [events];
		}

		if (events.length === 0) {
			return null;
		}

		if (p.options) {
			args.unshift(p.options);
			p.options = undefined;
		}

		const
			that = this,
			originalEmitter = emitter;

		const
			ids: IdObject[] = new Array(events.length),
			hasMultipleEvent = events.length > 1;

		events.forEach((event, i) => {
			let emitter = originalEmitter;

			const id = this.registerTask<IdObject>({
				...p,

				task: handler,
				namespace: PrimitiveNamespaces.eventListener,
				group: p.group ?? event,

				periodic: !p.single,
				linkByWrapper: true,

				clear: this.eventListenerDestructor.bind(this),

				wrapper(cb: AnyFunction): unknown {
					if (Object.isFunction(originalEmitter)) {
						// eslint-disable-next-line func-name-matching
						emitter = function wrappedEmitter(this: unknown): CanUndef<Function> {
							// eslint-disable-next-line prefer-rest-params
							const destructor = originalEmitter.apply(this, arguments);

							if (Object.isFunction(destructor)) {
								Object.defineProperty(wrappedEmitter, OFF, {value: destructor});
							}

							return destructor;
						};
					}

					const on = Object.isSimpleFunction(emitter) ?
						emitter :

						p.single && emitter.once ||
						emitter.on ||
						emitter.addListener ||
						emitter.addEventListener;

					if (Object.isFunction(on)) {
						switch (args.length) {
							case 0:
								on.call(emitter, event, handler);
								break;

							default:
								on.call(emitter, event, handler, ...args);
						}

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
						if (p.single && (hasMultipleEvent || !emitter.once)) {
							if (hasMultipleEvent) {
								that.clearEventListener(ids);

							} else {
								that.eventListenerDestructor({emitter, event, handler, args});
							}
						}

						let cbRes: unknown;

						switch (handlerArgs.length) {
							case 0:
								cbRes = cb.call(this);
								break;

							case 1:
								cbRes = cb.call(this, handlerArgs[0]);
								break;

							case 2:
								cbRes = cb.call(this, handlerArgs[0], handlerArgs[1]);
								break;

							default:
								cbRes = cb.apply(this, handlerArgs);
						}

						if (Object.isPromise(cbRes)) {
							cbRes.catch(stderr);
						}

						return cbRes;
					}
				}
			});

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (id != null) {
				ids[i] = id;
			}
		});

		return hasMultipleEvent ? ids : ids[0] ?? null;
	}

	/**
	 * Attaches an event listener to the specified event emitter, but the event is listened to only once.
	 * If the emitter is a function, it is interpreted as the function to attach events to.
	 * Note that if you don't provide a group for the operation, it will be taken from the event name.
	 *
	 * @param emitter - the event emitter
	 * @param events - the event or list of events (can also specify multiple events by using spaces)
	 * @param handler - the event handler
	 * @param [args] - additional arguments for the emitter
	 */
	once<E = unknown, R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		...args: unknown[]
	): Nullable<EventId>;

	/**
	 * Attaches an event listener to the specified event emitter, but the event is listened to only once.
	 * If the emitter is a function, it is interpreted as the function to attach events to.
	 * Note that if you don't provide a group for the operation, it will be taken from the event name.
	 *
	 * @param emitter - the event emitter
	 * @param events - the event or list of events (can also specify multiple events by using spaces)
	 * @param handler - the event handler
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
		let p: AsyncOnceOptions<CTX>;

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
	 * If the emitter is a function, it is interpreted as the function to attach events to.
	 * Note that if you don't provide a group for the operation, it will be taken from the event name.
	 *
	 * @param emitter - the event emitter
	 * @param event - the event name
	 * @param opts - options for the operation
	 * @param [args] - additional arguments for the emitter
	 */
	promisifyOnce<R = unknown, E = unknown>(
		emitter: EventEmitterLikeP,
		event: string,
		opts: AsyncPromisifyOnceOptions<E, R, CTX>,
		...args: unknown[]
	): Promise<R>;

	/**
	 * Returns a promise that is resolved after emitting the specified event.
	 * If the emitter is a function, it is interpreted as the function to attach events to.
	 * Note that if you don't provide a group for the operation, it will be taken from the event name.
	 *
	 * @param emitter - the event emitter
	 * @param event - the event name
	 * @param [args] - additional arguments for the emitter
	 */
	promisifyOnce<R = unknown>(
		emitter: EventEmitterLikeP,
		event: string,
		...args: unknown[]
	): Promise<R>;

	promisifyOnce<R, E>(
		emitter: EventEmitterLikeP,
		event: string,
		opts?: AsyncPromisifyOnceOptions<E, R, CTX> | unknown[],
		...args: unknown[]
	): Promise<R> {
		let p: AsyncPromisifyOnceOptions<E, R, CTX>;

		if (Object.isArray(opts)) {
			args.unshift(opts);
			p = {};

		} else {
			p = opts ?? {};
		}

		return new SyncPromise((resolve, reject) => {
			const handler = (e: unknown) => {
				if (Object.isFunction(p.handler)) {
					return resolve(p.handler.call(this.ctx, e));
				}

				resolve(e);
			};

			this.once(emitter, [event], handler, {
				...p,
				promise: PromiseNamespaces.eventListenerPromise,
				onClear: this.onPromiseClear(handler, reject),
				onMerge: this.onPromiseMerge(handler, reject)
			}, ...args);
		});
	}

	/**
	 * Removes the specified event listener
	 *
	 * @alias
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	off(id?: EventId): this;

	/**
	 * Removes the specified event listener or a group of listeners.
	 * Note that you can't remove event listeners by label without providing a group.
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
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	clearEventListener(id?: EventId): this;

	/**
	 * Removes the specified event listener or a group of listeners.
	 * Note that you can't remove event listeners by label without providing a group.
	 *
	 * @param opts - options for the operation
	 */
	clearEventListener(opts: StrictClearOptionsId<EventId>): this;
	clearEventListener(task?: EventId | StrictClearOptionsId<EventId>): this {
		if (Object.isArray(task)) {
			task.forEach((task) => {
				this.clearEventListener(task);
			});

			return this;
		}

		return this.cancelTask(isEvent(task) ? {id: task} : task, PrimitiveNamespaces.eventListener);
	}

	/**
	 * Mutes the specified event listener
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	muteEventListener(id?: EventId): this;

	/**
	 * Mutes the specified event listener or a group of listeners.
	 * Notice, you can't mute event listeners by label without providing a group.
	 *
	 * @param opts - options for the operation
	 */
	muteEventListener(opts: StrictClearOptionsId<EventId>): this;
	muteEventListener(task?: EventId | StrictClearOptionsId<EventId>): this {
		return this.markEvent('muted', Object.cast(task));
	}

	/**
	 * Unmutes the specified event listener
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	unmuteEventListener(id?: EventId): this;

	/**
	 * Unmutes the specified event listener or a group of listeners.
	 * Notice, you can't unmute event listeners by label without providing a group.
	 *
	 * @param opts - options for the operation
	 */
	unmuteEventListener(opts: StrictClearOptionsId<EventId>): this;
	unmuteEventListener(task?: EventId | StrictClearOptionsId<EventId>): this {
		return this.markEvent('!muted', Object.cast(task));
	}

	/**
	 * Suspends the specified event listener
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	suspendEventListener(id?: EventId): this;

	/**
	 * Suspends the specified event listener or a group of listeners.
	 * Notice, you can't suspend event listeners by label without providing a group.
	 *
	 * @param opts - options for the operation
	 */
	suspendEventListener(opts: StrictClearOptionsId<EventId>): this;
	suspendEventListener(task?: EventId | StrictClearOptionsId<EventId>): this {
		return this.markEvent('paused', Object.cast(task));
	}

	/**
	 * Unsuspends the specified event listener
	 * @param [id] - the operation identifier (if not specified, the operation will be applied to all registered tasks)
	 */
	unsuspendEventListener(id?: EventId): this;

	/**
	 * Unsuspends the specified event listener or a group of listeners.
	 * Notice, you can't unsuspend event listeners by label without providing a group.
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
			off = emitter[OFF] ?? emitter.off ?? emitter.removeListener ?? emitter.removeEventListener;

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
	 * Marks an event task or group of tasks using the given marker
	 *
	 * @param marker
	 * @param opts - additional options
	 */
	protected markEvent(marker: Marker, opts: StrictClearOptionsId<EventId>): this;
	protected markEvent(marker: Marker, task?: EventId | StrictClearOptionsId<EventId>): this {
		if (Object.isArray(task)) {
			task.forEach((task) => {
				this.markEvent(marker, task);
			});

			return this;
		}

		return this.markTask(marker, isEvent(task) ? {id: task} : task, PrimitiveNamespaces.eventListener);
	}
}
