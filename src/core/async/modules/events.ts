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
	 * Wrapper for an event emitter add listener
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
	 * @param params - parameters for the operation:
	 *   *) [options] - additional options for addEventListener
	 *   *) [join] - if true, then competitive tasks (with same labels) will be joined to the first
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [single] - if true, then after first invocation the event listener will be removed
	 *   *) [onClear] - clear handler
	 *   *) [onMerge] - merge handler (join: true)
	 *
	 * @param [args] - additional arguments for the emitter
	 */
	on<E = unknown, R = unknown>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		handler: i.ProxyCb<E, R, CTX>,
		params: i.AsyncOnOptions<CTX>,
		...args: unknown[]
	): Nullable<i.EventId>;

	on<E, R>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		cb: i.ProxyCb<E, R, CTX>,
		p: any,
		...args: unknown[]
	): Nullable<i.EventId> {
		if (p !== undefined && !Object.isObject(p)) {
			args.unshift(p);
			p = undefined;
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
				obj: cb,
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
	 * Wrapper for an event emitter once
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
	 * @param params - parameters for the operation:
	 *   *) [options] - additional options for addEventListener
	 *   *) [join] - if true, then competitive tasks (with same labels) will be joined to the first
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [onClear] - clear handler
	 *   *) [onMerge] - merge handler (join: true)
	 *
	 * @param [args] - additional arguments for the emitter
	 */
	once<E = unknown, R = unknown>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		handler: i.ProxyCb<E, R, CTX>,
		params: i.AsyncOnceOptions<CTX>,
		...args: unknown[]
	): Nullable<i.EventId>;

	once<E, R>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		handler: i.ProxyCb<E, R, CTX>,
		p: any,
		...args: unknown[]
	): Nullable<i.EventId> {
		if (p !== undefined && !Object.isObject(p)) {
			args.unshift(p);
			p = undefined;
		}

		return this.on(emitter, events, handler, {...p, single: true}, ...args);
	}

	/**
	 * Promise for once
	 *
	 * @param emitter - event emitter
	 * @param events - event or a list of events (can also specify multiple events with a space)
	 * @param params - parameters for the operation:
	 *   *) [options] - additional options for addEventListener
	 *   *) [join] - strategy for joining competitive tasks (with same labels):
	 *       *) true - all tasks will be joined to the first;
	 *       *) 'replace' - all tasks will be joined (replaced) to the last.
	 *
	 *   *) [label] - label for the task (previous task with the same label will be canceled)
	 *   *) [group] - group name for the task
	 *   *) [handler] - event handler (the result will be provided as a promise result)
	 *
	 * @param [args] - additional arguments for the emitter
	 */
	promisifyOnce<R = unknown, E = unknown>(
		emitter: i.EventEmitterLikeP,
		events: CanArray<string>,
		params: i.AsyncPromisifyOnceOptions<E, R, CTX>,
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
		p: any,
		...args: unknown[]
	): Promise<R> {
		if (p !== undefined && !Object.isObject(p)) {
			args.unshift(p);
			p = undefined;
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
	 * Wrapper for an event emitter remove listener
	 *
	 * @alias
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	off(id?: i.EventId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	off(params: i.ClearOptionsId<i.EventId>): this;
	off(p: any): this {
		return this.clearEventListener(p);
	}

	/**
	 * Wrapper for an event emitter remove listener
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	clearEventListener(id?: i.EventId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	clearEventListener(params: i.ClearOptionsId<i.EventId>): this;
	clearEventListener(p: any): this {
		if (Object.isArray(p)) {
			for (let i = 0; i < p.length; i++) {
				this.clearEventListener(<i.EventId>p[i]);
			}

			return this;
		}

		return this.cancelTask(isEvent(p) ? {id: p} : p, this.namespaces.eventListener);
	}

	/**
	 * Mutes an event operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	muteEventListener(id?: i.EventId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	muteEventListener(params: i.ClearOptionsId<i.EventId>): this;
	muteEventListener(p: any): this {
		return this.markEvent('muted', p);
	}

	/**
	 * Unmutes an event operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unmuteEventListener(id?: i.EventId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unmuteEventListener(params: i.ClearOptionsId<i.EventId>): this;
	unmuteEventListener(p: any): this {
		return this.markEvent('!muted', p);
	}

	/**
	 * Suspends an event operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	suspendEventListener(id?: i.EventId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	suspendEventListener(params: i.ClearOptionsId<i.EventId>): this;
	suspendEventListener(p: any): this {
		return this.markEvent('paused', p);
	}

	/**
	 * Unsuspends an event operation
	 * @param [id] - operation id (if not defined will be get all operations)
	 */
	unsuspendEventListener(id?: i.EventId): this;

	/**
	 * @param params - parameters for the operation:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	unsuspendEventListener(params: i.ClearOptionsId<i.EventId>): this;
	unsuspendEventListener(p: any): this {
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
	 * Marks an event task (or a group of tasks) by the specified label
	 *
	 * @param field
	 * @param [id] - operation id (if not specified, the operation will be extended for all promise namespaces)
	 */
	protected markEvent(field: string, id?: i.EventId): this;

	/**
	 * @param field
	 * @param params - additional options:
	 *   *) [id] - operation id
	 *   *) [label] - label for the task
	 *   *) [group] - group name for the task
	 */
	protected markEvent(field: string, params: i.ClearOptionsId<i.EventId>): this;
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
