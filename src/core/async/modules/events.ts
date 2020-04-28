/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import SyncPromise from 'core/promise/sync';
import Super, { isEvent } from 'core/async/modules/timers';

import {

	AsyncOnOptions,
	AsyncOnceOptions,
	AsyncPromisifyOnceOptions,

	EventId,
	ClearOptionsId,

	ProxyCb,
	Event,
	EventEmitterLikeP

} from 'core/async/interface';

export * from 'core/async/modules/timers';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * Wraps an event from the specified event emitter.
	 * If the emitter is a function, it is interpreted as a function to attach events.
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events by using spaces)
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
	 * Wraps an event from the specified event emitter.
	 * If the emitter is a function, it is interpreted as a function to attach events.
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events by using spaces)
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

		if (opts !== undefined && !Object.isPlainObject(opts)) {
			args.unshift(opts);
			p = {};

		} else {
			p = opts || {};
		}

		p = {...p};
		events = Object.isArray(events) ? events : events.split(/\s+/);

		if (p.options) {
			args.unshift(p.options);
			p.options = undefined;
		}

		const
			that = this,
			links: object[] = [],
			multipleEvent = events.length > 1;

		for (let i = 0; i < events.length; i++) {
			const
				event = events[i];

			const link = this.registerTask<object>({
				...p,
				name: this.namespaces.eventListener,
				obj: handler,
				wrapper(cb: AnyFunction): unknown {
					const handler = function (this: unknown): unknown {
						if (Object.isFunction(emitter) || p.single && (multipleEvent || !emitter.once)) {
							if (multipleEvent) {
								that.clearEventListener(links);

							} else {
								that.eventListenerDestructor({emitter, event, handler, args});
							}
						}

						const
							res = cb.apply(this, arguments);

						if (Object.isPromise(res)) {
							res.catch(stderr);
						}

						return res;
					};

					const fn = Object.isSimpleFunction(emitter) ?
						emitter : p.single && emitter.once || emitter.addEventListener || emitter.addListener || emitter.on;

					if (Object.isFunction(fn)) {
						fn.call(emitter, event, handler, ...args);

					} else {
						throw new ReferenceError('A method to attach events is not defined');
					}

					return {
						event,
						emitter,
						handler,
						args
					};
				},

				clearFn: this.eventListenerDestructor,
				linkByWrapper: true,
				periodic: !p.single,
				group: p.group ?? event
			});

			if (link) {
				links.push(link);
			}
		}

		return events.length <= 1 ? links[0] || null : links;
	}

	/**
	 * Wraps an event from the specified event emitter.
	 * The event is listened only once.
	 * If the emitter is a function, it is interpreted as a function to attach events.
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events by using spaces)
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
	 * Wraps an event from the specified event emitter.
	 * The event is listened only once.
	 * If the emitter is a function, it is interpreted as a function to attach events.
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
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

		if (opts !== undefined && !Object.isPlainObject(opts)) {
			args.unshift(opts);
			p = {};

		} else {
			p = opts || {};
		}

		return this.on(emitter, events, handler, {...p, single: true}, ...args);
	}

	/**
	 * Returns a promise that is resolved after emitting the specified event.
	 * If the emitter is a function, it is interpreted as a function to attach events.
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param opts - options for the operation
	 * @param [args] - additional arguments for the emitter
	 */
	promisifyOnce<R = unknown, E = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		opts: AsyncPromisifyOnceOptions<E, R, CTX>,
		...args: unknown[]
	): SyncPromise<R>;

	/**
	 * Returns a promise that is resolved after emitting the specified event.
	 * If the emitter is a function, it is interpreted as a function to attach events.
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param [args] - additional arguments for the emitter
	 */
	promisifyOnce<R = unknown>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		...args: unknown[]
	): SyncPromise<R>;

	promisifyOnce<R, E>(
		emitter: EventEmitterLikeP,
		events: CanArray<string>,
		opts?: AsyncPromisifyOnceOptions<E, R, CTX> | unknown[],
		...args: unknown[]
	): SyncPromise<R> {
		let
			p: AsyncPromisifyOnceOptions<E, R, CTX>;

		if (opts !== undefined && !Object.isPlainObject(opts)) {
			args.unshift(opts);
			p = {};

		} else {
			p = opts || {};
		}

		return new SyncPromise((resolve, reject) => {
			const handler = (e) => {
				if (p && Object.isFunction(p.handler)) {
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
	 * Removes the specified event listener or a group of listeners
	 * @param opts - options for the operation
	 */
	off(opts: ClearOptionsId<EventId>): this;
	off(task?: EventId | ClearOptionsId<EventId>): this {
		return this.clearEventListener(task);
	}

	/**
	 * Removes the specified event listener
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearEventListener(id?: EventId): this;

	/**
	 * Removes the specified event listener or a group of listeners
	 * @param opts - options for the operation
	 */
	clearEventListener(opts: ClearOptionsId<EventId>): this;
	clearEventListener(task?: EventId | ClearOptionsId<EventId>): this {
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
	 * Mutes the specified event listener or a group of listeners
	 * @param opts - options for the operation
	 */
	muteEventListener(opts: ClearOptionsId<EventId>): this;
	muteEventListener(task?: EventId | ClearOptionsId<EventId>): this {
		return this.markEvent('muted', task);
	}

	/**
	 * Unmutes the specified event listener
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unmuteEventListener(id?: EventId): this;

	/**
	 * Unmutes the specified event listener or a group of listeners
	 * @param opts - options for the operation
	 */
	unmuteEventListener(opts: ClearOptionsId<EventId>): this;
	unmuteEventListener(task?: EventId | ClearOptionsId<EventId>): this {
		return this.markEvent('!muted', task);
	}

	/**
	 * Suspends the specified event listener
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendEventListener(id?: EventId): this;

	/**
	 * Suspends the specified event listener or a group of listeners
	 * @param opts - options for the operation
	 */
	suspendEventListener(opts: ClearOptionsId<EventId>): this;
	suspendEventListener(task?: EventId | ClearOptionsId<EventId>): this {
		return this.markEvent('paused', task);
	}

	/**
	 * Unsuspends the specified event listener
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendEventListener(id?: EventId): this;

	/**
	 * Unsuspends the specified event listener or a group of listeners
	 * @param opts - options for the operation
	 */
	unsuspendEventListener(opts: ClearOptionsId<EventId>): this;
	unsuspendEventListener(p: EventId | ClearOptionsId<EventId>): this {
		return this.markEvent('!paused', p);
	}

	/**
	 * Removes an event handler from the specified emitter
	 * @param event - event object
	 */
	eventListenerDestructor(event: Event): void {
		const
			e = event.emitter,
			fn = Object.isSimpleFunction(e) ? e : e.removeEventListener || e.removeListener || e.off;

		if (fn && Object.isFunction(fn)) {
			fn.call(e, event.event, event.handler);

		} else {
			throw new ReferenceError('A function to remove the event is not defined');
		}
	}

	/**
	 * Marks an event task by the specified label
	 *
	 * @param field
	 * @param [id] - operation id (if not specified, the operation will be extended for all promise namespaces)
	 */
	protected markEvent(field: string, id?: EventId): this;

	/**
	 * Marks an event task or group of tasks by the specified label
	 *
	 * @param field
	 * @param opts - additional options
	 */
	protected markEvent(field: string, opts: ClearOptionsId<EventId>): this;
	protected markEvent(field: string, task: EventId | ClearOptionsId<EventId>): this {
		if (Object.isArray(task)) {
			for (let i = 0; i < task.length; i++) {
				this.markEvent(field, <EventId>task[i]);
			}

			return this;
		}

		return this.markTask(field, isEvent(task) ? {id: task} : task, this.namespaces.eventListener);
	}
}
