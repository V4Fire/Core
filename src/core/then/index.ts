/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/then/README.md]]
 * @packageDocumentation
 */

import { deprecated } from 'core/meta/deprecation';
import * as i from 'core/then/interface';
export * from 'core/then/interface';

/**
 * Class for wrapping promise-like objects and adds to them some extra functionality,
 * such as possibility of cancelation, etc.
 *
 * @typeparam T - promise resolved value
 */
export default class Then<T = unknown> implements PromiseLike<T> {
	/**
	 * Promise which is never resolved
	 */
	static readonly never: Promise<never> = new Promise(() => undefined);

	/**
	 * Returns true if the specified value is looks like a promise
	 *
	 * @deprecated
	 * @see [[ObjectConstructor.isPromiseLike]]
	 * @param obj
	 */
	@deprecated({alternative: {name: 'Object.isPromiseLike', source: 'core/prelude/types'}})
	static isThenable(obj: unknown): obj is PromiseLike<unknown> {
		return Object.isPromiseLike(obj);
	}

	/**
	 * Creates a new resolved Then promise for the specified value.
	 * If the resolved value is a function, it will be invoked.
	 * The result of the invoking will be provided as a value of the promise.
	 *
	 * @param value
	 * @param [parent] - parent promise
	 */
	static resolveAndCall<T = unknown>(value: i.ExecutableValue<T>, parent?: Then): Then<T>;

	/**
	 * Creates a new resolved Then promise
	 */
	static resolveAndCall(): Then<void>;
	static resolveAndCall<T = unknown>(value?: i.ExecutableValue<T>, parent?: Then): Then<T> {
		return Then.resolve(value, parent).then<T>((obj) => Object.isFunction(obj) ? obj() : obj);
	}

	/**
	 * @deprecated
	 * @see [[Then.resolveAndCall]]
	 */
	@deprecated({renamedTo: 'resolveAndCall'})
	static immediate<T = unknown>(value: i.ExecutableValue<T>, parent?: Then): Then<T> {
		return this.resolveAndCall(value, parent);
	}

	/**
	 * Creates a new resolved Then promise for the specified value
	 *
	 * @param value
	 * @param [parent] - parent promise
	 */
	static resolve<T = unknown>(value: i.Value<T>, parent?: Then): Then<T>;

	/**
	 * Creates a new resolved Then promise
	 */
	static resolve(): Then<void>;
	static resolve<T = unknown>(value?: i.Value<T>, parent?: Then): Then<T> {
		if (value instanceof Then) {
			if (parent) {
				parent.catch((err) => value.abort(err));
			}

			return value;
		}

		return new Then((resolve, reject) => {
			if (Object.isPromiseLike(value)) {
				value.then(resolve, reject);

			} else {
				resolve(value);
			}

		}, parent);
	}

	/**
	 * Creates a new rejected Then promise for the specified reason
	 *
	 * @param [reason]
	 * @param [parent] - parent promise
	 */
	static reject<T = never>(reason?: unknown, parent?: Then): Then<T> {
		return new Then((_, reject) => reject(reason), parent);
	}

	/**
	 * Creates a Then promise that is resolved with an array of results when all of the provided promises
	 * are resolved, or rejected when any promise is rejected
	 *
	 * @param values
	 * @param [parent] - parent promise
	 */
	// @ts-ignore
	static all<T1, T2, T3, T4, T5>(
		values: [i.Value<T1>, i.Value<T2>, i.Value<T3>, i.Value<T4>, i.Value<T5>],
		parent?: Then
	): Then<[T1, T2, T3, T4, T5]>;

	static all<T1, T2, T3, T4>(
		values: [i.Value<T1>, i.Value<T2>, i.Value<T3>, i.Value<T4>],
		parent?: Then
	): Then<[T1, T2, T3, T4]>;

	static all<T1, T2, T3>(
		values: [i.Value<T1>, i.Value<T2>, i.Value<T3>],
		parent?: Then
	): Then<[T1, T2, T3]>;

	static all<T1, T2>(
		values: [i.Value<T1>, i.Value<T2>],
		parent?: Then
	): Then<[T1, T2]>;

	static all<T1>(
		values: [i.Value<T1>],
		parent?: Then
	): Then<[T1]>;

	static all<T extends Iterable<i.Value>>(
		values: T,
		parent?: Then
	): Then<(T extends Iterable<i.Value<infer V>> ? V : unknown)[]>;

	static all<T extends Iterable<i.Value>>(
		values: T,
		parent?: Then
	): Then<(T extends Iterable<i.Value<infer V>> ? V : unknown)[]> {
		return new Then((resolve, reject, onAbort) => {
			const
				promises = <Then[]>[],
				resolved = <any[]>[];

			Object.forEach(values, (el) => {
				promises.push(Then.resolve(el));
			});

			if (!promises.length) {
				resolve(resolved);
				return;
			}

			onAbort((reason) => {
				for (let i = 0; i < promises.length; i++) {
					promises[i].abort(reason);
				}
			});

			let
				counter = 0;

			for (let i = 0; i < promises.length; i++) {
				promises[i].then(
					(val) => {
						resolved[i] = val;

						if (++counter === promises.length) {
							resolve(resolved);
						}
					},

					reject
				);
			}

		}, parent);
	}

	/**
	 * Creates a Then promise that is resolved or rejected when any of the provided promises are resolved or rejected
	 *
	 * @param values
	 * @param [parent] - parent promise
	 */
	static race<T extends Iterable<i.Value>>(
		values: T,
		parent?: Then
	): Then<T extends Iterable<i.Value<infer V>> ? V : unknown> {
		return new Then<any>((resolve, reject, onAbort) => {
			const
				promises = <Then[]>[];

			Object.forEach(values, (el) => {
				promises.push(Then.resolve(el));
			});

			if (!promises.length) {
				resolve();
				return;
			}

			onAbort((reason) => {
				for (let i = 0; i < promises.length; i++) {
					promises[i].abort(reason);
				}
			});

			for (let i = 0; i < promises.length; i++) {
				promises[i].then(resolve, reject);
			}

		}, parent);
	}

	/**
	 * Returns true if the current promise is pending
	 */
	get isPending(): boolean {
		return this.state === i.State.pending;
	}

	/**
	 * Number of pending child promises
	 */
	protected pendingChildren: number = 0;

	/**
	 * Value of the current promise state
	 */
	protected state: i.State = i.State.pending;

	/**
	 * If true, then the promise was aborted
	 */
	protected aborted: boolean = false;

	/**
	 * Internal native promise instance
	 */
	protected promise: Promise<T>;

	/**
	 * Handler for resolving of the native promise
	 */
	protected onResolve!: i.ConstrResolveHandler<T>;

	/**
	 * Handler for rejecting of the native promise
	 */
	protected onReject!: i.ConstrRejectHandler;

	/**
	 * Handler for rejecting on abort of the native promise
	 */
	protected onAbort!: i.ConstrRejectHandler;

	/**
	 * @param executor - executor function
	 * @param [parent] - parent promise
	 */
	constructor(executor: i.Executor<T>, parent?: Then) {
		this.promise = new Promise((resolve, reject) => {
			const resolveWrapper = this.onResolve = (val) => {
				if (!this.isPending) {
					return;
				}

				this.state = i.State.fulfilled;
				resolve(val);
			};

			const rejectWrapper = this.onReject = (err) => {
				if (!this.isPending) {
					return;
				}

				this.state = i.State.rejected;
				reject(err);
			};

			let
				setOnAbort;

			if (parent) {
				const abortParent = this.onAbort = (reason) => {
					parent.abort(reason);
				};

				parent.catch((err) => {
					this.abort(err);
				});

				setOnAbort = (cb) => {
					this.onAbort = (r) => {
						abortParent(r);
						cb.call(this, r);
					};
				};

			} else {
				setOnAbort = (cb) => {
					this.onAbort = Object.assign(cb.bind(this), {cb});
				};
			}

			if (this.isPending && (!parent || parent.state !== i.State.rejected)) {
				this.call(executor, [resolveWrapper, rejectWrapper, setOnAbort], rejectWrapper);
			}
		});
	}

	/**
	 * Attaches callbacks for the resolution and/or rejection of the promise
	 *
	 * @param [onFulfill]
	 * @param [onReject]
	 * @param [onAbort]
	 */
	then(
		onFulfill?: Nullable<i.ResolveHandler<T>>,
		onReject?: Nullable<i.RejectHandler<T>>,
		onAbort?: Nullable<i.ConstrRejectHandler>
	): Then<T>;

	then<R>(
		onFulfill: Nullable<i.ResolveHandler<T>>,
		onReject: i.RejectHandler<R>,
		onAbort?: Nullable<i.ConstrRejectHandler>
	): Then<T | R>;

	then<V>(
		onFulfill: i.ResolveHandler<T, V>,
		onReject?: Nullable<i.RejectHandler<V>>,
		onAbort?: Nullable<i.ConstrRejectHandler>
	): Then<V>;

	then<V, R>(
		onFulfill: i.ResolveHandler<T, V>,
		onReject: i.RejectHandler<R>,
		onAbort?: Nullable<i.ConstrRejectHandler>
	): Then<V | R>;

	then(
		onFulfill: Nullable<i.ResolveHandler<any>>,
		onReject: Nullable<i.RejectHandler<any>>,
		onAbort: Nullable<i.ConstrRejectHandler>
	): Then<any> {
		this.pendingChildren++;
		return new Then((resolve, reject, abort) => {
			let
				resolveWrapper,
				rejectWrapper;

			if (Object.isFunction(onFulfill)) {
				resolveWrapper = (val) => {
					this.call(onFulfill, [val], reject, resolve);
				};

			} else {
				resolveWrapper = resolve;
			}

			if (Object.isFunction(onReject)) {
				rejectWrapper = (err) => {
					this.call(onReject, [err], reject, resolve);
				};

			} else {
				rejectWrapper = reject;
			}

			const
				that = this;

			abort(/** @this {Then} */ function (this: Then, reason: unknown): void {
				if (Object.isFunction(onAbort)) {
					try {
						onAbort(reason);

					} catch {}
				}

				this.aborted = true;

				if (!that.abort(reason)) {
					rejectWrapper(reason);
				}
			});

			this.promise.then(resolveWrapper, rejectWrapper);
		});
	}

	/**
	 * Attaches a callback for only the rejection of the promise
	 * @param [onReject]
	 */
	catch(onReject?: Nullable<i.RejectHandler<T>>): Then<T>;
	catch<R>(onReject: i.RejectHandler<R>): Then<R>;
	catch(onReject?: i.RejectHandler<any>): Then<any> {
		return new Then((resolve, reject, onAbort) => {
			let
				rejectWrapper;

			if (Object.isFunction(onReject)) {
				rejectWrapper = (err) => {
					this.call(onReject, [err], reject, resolve);
				};

			} else {
				rejectWrapper = reject;
			}

			const
				that = this;

			onAbort(/** @this {Then} */ function (this: Then, reason: unknown): void {
				this.aborted = true;

				if (!that.abort(reason)) {
					rejectWrapper(reason);
				}
			});

			this.promise.then(resolve, rejectWrapper);
		});
	}

	/**
	 * Attaches a callback that is invoked when the promise is settled (fulfilled or rejected).
	 * The resolved value cannot be modified from the callback.
	 *
	 * @param [cb]
	 */
	finally(cb?: Nullable<i.FinallyHandler>): Then<T> {
		return new Then((resolve, reject, onAbort) => {
			const
				that = this;

			onAbort(/** @this {Then} */ function (this: Then, reason: unknown): void {
				this.aborted = true;

				if (!that.abort(reason)) {
					reject(reason);
				}
			});

			this.promise.finally(() => cb && cb()).then(resolve, reject);
		});
	}

	/**
	 * Aborts the current promise (the promise will be rejected)
	 * @param [reason] - abort reason
	 */
	abort(reason?: unknown): boolean {
		if (!this.isPending || this.aborted) {
			return false;
		}

		if (this.pendingChildren) {
			this.pendingChildren--;
		}

		if (!this.pendingChildren) {
			this.call(this.onAbort, [reason]);

			if (!this.aborted) {
				this.onReject(reason);
				this.aborted = true;
			}

			return true;
		}

		return false;
	}

	/**
	 * Executes a function with the specified parameters
	 *
	 * @param fn
	 * @param args - arguments
	 * @param [onError] - error handler
	 * @param [onValue] - success handler
	 */
	protected call<A = unknown, V = unknown>(
		fn: Nullable<Function>,
		args: A[] = [],
		onError?: i.ConstrRejectHandler,
		onValue?: (value: V) => void
	): void {
		const
			loopback = () => undefined,
			reject = onError || loopback,
			resolve = onValue || loopback;

		try {
			const
				v = fn ? fn(...args) : undefined;

			if (Object.isPromiseLike(v)) {
				v.then(<any>resolve, reject);

			} else {
				resolve(v);
			}

		} catch (err) {
			reject(err);
		}
	}
}
