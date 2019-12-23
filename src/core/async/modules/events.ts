/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as i from 'core/async/interface';
import Super from 'core/async/modules/timers';
export * from 'core/async/modules/timers';

/**
 * Returns true if the specified value is looks like an event object
 * @param value
 */
export function isEvent(value: unknown): value is i.EventLike {
	return Object.isObject(value) && Object.isString((<any>value).event);
}

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * Wraps an event from the specified event emitter
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param handler - event handler
	 * @param [args] - additional arguments for the emitter
	 */
	on<E = unknown, R = unknown>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		handler: i.ProxyCb<E, R, CTX>,
		...args: unknown[]
	): Nullable<i.EventId>;

	/**
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param handler - event handler
	 * @param opts - options for the operation:
	 *   *) [options] - additional options for the emitter
	 *   *) [join] - if true, then all competitive tasks (with the same labels) will be joined to the first task
	 *   *) [label] - label of the task (previous task with the same label will be canceled)
	 *   *) [group] - group name of the task
	 *   *) [single] - if true, then after first invocation the event listener will be removed
	 *   *) [onClear] - handler for clearing (it is called after clearing of the task)
	 *   *) [onMerge] - handler for merging (it is called after merging of the task with another task (label + join:true))
	 *
	 * @param [args] - additional arguments for the emitter
	 */
	on<E = unknown, R = unknown>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		handler: i.ProxyCb<E, R, CTX>,
		opts: i.AsyncOnOptions<CTX>,
		...args: unknown[]
	): Nullable<i.EventId>;

	on<E, R>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		handler: i.ProxyCb<E, R, CTX>,
		opts: i.AsyncOnOptions<CTX> | unknown[],
		...args: unknown[]
	): Nullable<i.EventId> {
		let
			p: i.AsyncOnOptions<CTX>;

		if (opts !== undefined && !Object.isObject(opts)) {
			args.unshift(opts);
			p = {};

		} else {
			p = opts;
		}

		p = {...p};
		events = Object.isArray(events) ? events : events.split(/\s+/);

		if (p.options) {
			p.single = p.options.once = 'single' in p ? p.single : p.options.once;
			args.unshift(p.options);
			p.options = undefined;
		}

		const
			that = this,
			links: object[] = [],
			multEvent = events.length > 1;

		for (let i = 0; i < events.length; i++) {
			const
				event = events[i];

			const link = this.registerTask<object>({
				...p,
				name: this.namespaces.eventListener,
				obj: handler,
				wrapper(cb: Function): unknown {
					const handler = function (this: unknown): unknown {
						if (Object.isFunction(emitter) || p.single && (multEvent || !emitter.once)) {
							if (multEvent) {
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

					const fn = Object.isFunction(emitter) ?
						emitter : p.single && emitter.once || emitter.addEventListener || emitter.addListener || emitter.on;

					if (Object.isFunction(fn)) {
						fn.call(emitter, event, handler, ...args);

					} else {
						throw new ReferenceError('Add event listener function for the event emitter is not defined');
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
				group: p.group || event
			});

			if (link) {
				links.push(link);
			}
		}

		return events.length <= 1 ? links[0] || null : links;
	}

	/**
	 * Wraps an event from the specified event emitter.
	 * The event will be listen only once.
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param handler - event handler
	 * @param [args] - additional arguments for the emitter
	 */
	once<E = unknown, R = unknown>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		handler: i.ProxyCb<E, R, CTX>,
		...args: unknown[]
	): Nullable<i.EventId>;

	/**
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param handler - event handler
	 * @param opts - options for the operation:
	 *   *) [options] - additional options for the emitter
	 *   *) [join] - if true, then all competitive tasks (with the same labels) will be joined to the first task
	 *   *) [label] - label of the task (previous task with the same label will be canceled)
	 *   *) [group] - group name of the task
	 *   *) [onClear] - handler for clearing (it is called after clearing of the task)
	 *   *) [onMerge] - handler for merging (it is called after merging of the task with another task (label + join:true))
	 *
	 * @param [args] - additional arguments for the emitter
	 */
	once<E = unknown, R = unknown>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		handler: i.ProxyCb<E, R, CTX>,
		opts: i.AsyncOnceOptions<CTX>,
		...args: unknown[]
	): Nullable<i.EventId>;

	once<E, R>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		handler: i.ProxyCb<E, R, CTX>,
		opts: i.AsyncOnceOptions<CTX> | unknown[],
		...args: unknown[]
	): Nullable<i.EventId> {
		let
			p: i.AsyncOnceOptions<CTX>;

		if (opts !== undefined && !Object.isObject(opts)) {
			args.unshift(opts);
			p = {};

		} else {
			p = opts;
		}

		return this.on(emitter, events, handler, {...p, single: true}, ...args);
	}

	/**
	 * Returns a promise that will be resolved after the specified event
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param opts - options for the operation:
	 *   *) [options] - additional options for the emitter
	 *   *) [join] - strategy for joining competitive tasks (with same labels):
	 *       *) true - all tasks will be joined to the first;
	 *       *) 'replace' - all tasks will be joined (replaced) to the last.
	 *
	 *   *) [label] - label of the task (previous task with the same label will be canceled)
	 *   *) [group] - group name of the task
	 *   *) [handler] - event handler (the result will be provided as a promise result)
	 *
	 * @param [args] - additional arguments for the emitter
	 */
	promisifyOnce<R = unknown, E = unknown>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		opts: i.AsyncPromisifyOnceOptions<E, R, CTX>,
		...args: unknown[]
	): Promise<R>;

	/**
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param [args] - additional arguments for the emitter
	 */
	promisifyOnce<R = unknown>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		...args: unknown[]
	): Promise<R>;

	promisifyOnce<R, E>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		opts: any,
		...args: unknown[]
	): Promise<R> {
		let
			p: i.AsyncPromisifyOnceOptions<E, R, CTX>;

		if (opts !== undefined && !Object.isObject(opts)) {
			args.unshift(opts);
			p = {};

		} else {
			p = opts;
		}

		return new Promise((resolve, reject) => {
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
	off(id?: i.EventId): this;

	/**
	 * Removes the specified event listener or a group of listeners
	 *
	 * @param opts - options for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label of the task
	 *   *) [group] - group name of the task
	 */
	off(opts: i.ClearOptionsId<i.EventId>): this;
	off(task?: i.EventId | i.ClearOptionsId<i.EventId>): this {
		return this.clearEventListener(task);
	}

	/**
	 * Removes the specified event listener
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	clearEventListener(id?: i.EventId): this;

	/**
	 * Removes the specified event listener or a group of listeners
	 *
	 * @param opts - options for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label of the task
	 *   *) [group] - group name of the task
	 */
	clearEventListener(opts: i.ClearOptionsId<i.EventId>): this;
	clearEventListener(task?: i.EventId | i.ClearOptionsId<i.EventId>): this {
		if (Object.isArray(task)) {
			for (let i = 0; i < task.length; i++) {
				this.clearEventListener(<i.EventId>task[i]);
			}

			return this;
		}

		return this.cancelTask(isEvent(task) ? {id: task} : task, this.namespaces.eventListener);
	}

	/**
	 * Mutes the specified event listener
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	muteEventListener(id?: i.EventId): this;

	/**
	 * Mutes the specified event listener or a group of listeners
	 *
	 * @param opts - options for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label of the task
	 *   *) [group] - group name of the task
	 */
	muteEventListener(opts: i.ClearOptionsId<i.EventId>): this;
	muteEventListener(task?: i.EventId | i.ClearOptionsId<i.EventId>): this {
		return this.markEvent('muted', task);
	}

	/**
	 * Unmutes the specified event listener
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unmuteEventListener(id?: i.EventId): this;

	/**
	 * Unmutes the specified event listener or a group of listeners
	 *
	 * @param opts - options for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label of the task
	 *   *) [group] - group name of the task
	 */
	unmuteEventListener(opts: i.ClearOptionsId<i.EventId>): this;
	unmuteEventListener(task?: i.EventId | i.ClearOptionsId<i.EventId>): this {
		return this.markEvent('!muted', task);
	}

	/**
	 * Suspends the specified event listener
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	suspendEventListener(id?: i.EventId): this;

	/**
	 * Suspends the specified event listener or a group of listeners
	 *
	 * @param opts - options for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label of the task
	 *   *) [group] - group name of the task
	 */
	suspendEventListener(opts: i.ClearOptionsId<i.EventId>): this;
	suspendEventListener(task?: i.EventId | i.ClearOptionsId<i.EventId>): this {
		return this.markEvent('paused', task);
	}

	/**
	 * Unsuspends the specified event listener
	 * @param [id] - operation id (if not specified, then the operation will be applied for all registered tasks)
	 */
	unsuspendEventListener(id?: i.EventId): this;

	/**
	 * Unsuspends the specified event listener or a group of listeners
	 *
	 * @param opts - options for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label of the task
	 *   *) [group] - group name of the task
	 */
	unsuspendEventListener(opts: i.ClearOptionsId<i.EventId>): this;
	unsuspendEventListener(p: i.EventId | i.ClearOptionsId<i.EventId>): this {
		return this.markEvent('!paused', p);
	}

	/**
	 * Removes an event handler from the specified emitter
	 *
	 * @param event - event object:
	 *   *) event - event name
	 *   *) emitter - event emitter
	 *   *) handler - event handler
	 *   *) args - additional arguments for the emitter
	 */
	eventListenerDestructor(event: i.EventLike): void {
		const
			e = event.emitter,
			fn = Object.isFunction(e) ? e : e.removeEventListener || e.removeListener || e.off;

		if (fn && Object.isFunction(fn)) {
			fn.call(e, event.event, event.handler);

		} else {
			throw new ReferenceError('A function for removing the event is not defined');
		}
	}

	/**
	 * Marks an event task by the specified label
	 *
	 * @param field
	 * @param [id] - operation id (if not specified, the operation will be extended for all promise namespaces)
	 */
	protected markEvent(field: string, id?: i.EventId): this;

	/**
	 * Marks an event task or a group of tasks by the specified label
	 *
	 * @param field
	 * @param opts - additional options:
	 *   *) [id] - operation id
	 *   *) [label] - label of the task
	 *   *) [group] - group name of the task
	 */
	protected markEvent(field: string, opts: i.ClearOptionsId<i.EventId>): this;
	protected markEvent(field: string, task: i.EventId | i.ClearOptionsId<i.EventId>): this {
		if (Object.isArray(task)) {
			for (let i = 0; i < task.length; i++) {
				this.markEvent(field, <i.EventId>task[i]);
			}

			return this;
		}

		return this.markTask(field, isEvent(task) ? {id: task} : task, this.namespaces.eventListener);
	}
}
