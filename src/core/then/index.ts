/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { deprecated } from 'core/meta/deprecation';
import * as i from 'core/then/interface';
export * from 'core/then/interface';

export default class Then<T = unknown> implements PromiseLike<T> {
	/**
	 * The promise that will be never resolved
	 */
	static readonly never: Promise<never> = new Promise(() => undefined);

	/**
	 * Returns true if the specified value is similar to a promise
	 * @param obj
	 */
	static isThenable(obj: unknown): obj is PromiseLike<unknown> {
		if (obj instanceof Object) {
			return Object.isFunction((<Dictionary>obj).then);
		}

		return false;
	}

	/**
	 * Creates a new resolved Then promise for the specified value.
	 * If the resolved value is a function, it will be executed.
	 * The result of the call will be provided as a value of the promise.
	 *
	 * @param value
	 * @param [parent] - parent promise
	 */
	static resolveAndCall<T = unknown>(value: i.ExecutableValue<T>, parent?: Then): Then<T>;
	static resolveAndCall(): Then<void>;
	static resolveAndCall<T = unknown>(value?: i.ExecutableValue<T>, parent?: Then): Then<T> {
		return Then.resolve(value, parent).then((obj) => Object.isFunction(obj) ? (<Function>obj)() : obj);
	}

	/**
	 * @deprecated
	 * @see Then.resolveAndCall
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
	static resolve(): Then<void>;
	static resolve<T = unknown>(value?: i.Value<T>, parent?: Then): Then<T> {
		if (value instanceof Then) {
			if (parent) {
				parent.catch((err) => value.abort(err));
			}

			return value;
		}

		return new Then((res, rej) => {
			if (Then.isThenable(value)) {
				value.then(res, rej);

			} else {
				res(value);
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
		return new Then((res, rej) => rej(reason), parent);
	}

	/**
	 * Creates a Then promise that is resolved with an array of results when all of the provided promises
	 * resolve, or rejected when any promise is rejected
	 *
	 * @param values
	 * @param [parent] - parent promise
	 */
	static all<T extends Iterable<i.Value>>(
		values: T,
		parent?: Then
	): Then<(T extends Iterable<i.Value<infer V>> ? V : unknown)[]> {
		return new Then((res, rej, onAbort) => {
			const
				promises = <Then[]>[],
				resolved = <any[]>[];

			Object.forEach(values, (el) => {
				promises.push(Then.resolve(el));
			});

			if (!promises.length) {
				res(resolved);
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
							res(resolved);
						}
					},

					rej
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
		return new Then<any>((res, rej, onAbort) => {
			const
				promises = <Then[]>[];

			Object.forEach(values, (el) => {
				promises.push(Then.resolve(el));
			});

			if (!promises.length) {
				res();
				return;
			}

			onAbort((reason) => {
				for (let i = 0; i < promises.length; i++) {
					promises[i].abort(reason);
				}
			});

			for (let i = 0; i < promises.length; i++) {
				promises[i].then(res, rej);
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
	 * The number of pending child promises
	 */
	protected pendingChildren: number = 0;

	/**
	 * A value of the current promise state
	 */
	protected state: i.State = i.State.pending;

	/**
	 * If true, then the promise was aborted
	 */
	protected aborted: boolean = false;

	/**
	 * An internal native promise instance
	 */
	protected promise: Promise<T>;

	/**
	 * A handler for resolving of the native promise
	 */
	protected onResolve!: i.ResolveHandler<T>;

	/**
	 * A handler for rejecting of the native promise
	 */
	protected onReject!: i.RejectHandler;

	/**
	 * A handler for rejecting of the native promise
	 */
	protected onAbort!: i.RejectHandler;

	/**
	 * @param executor - executor function
	 * @param [parent] - parent promise
	 */
	constructor(executor: i.Executor<T>, parent?: Then) {
		this.promise = new Promise((res, rej) => {
			const resolve = this.onResolve = (val) => {
				if (!this.isPending) {
					return;
				}

				this.state = i.State.fulfilled;
				res(val);
			};

			const reject = this.onReject = (err) => {
				if (!this.isPending) {
					return;
				}

				this.state = i.State.rejected;
				rej(err);
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
				this.call(executor, [resolve, reject, setOnAbort], reject);
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
		onFulfill?: Nullable<i.ThenFulfillHandler<T>>,
		onReject?: Nullable<i.ThenRejectHandler<T>>,
		onAbort?: Nullable<i.RejectHandler>
	): Then<T>;

	then<R>(
		onFulfill: Nullable<i.ThenFulfillHandler<T>>,
		onReject: i.ThenRejectHandler<R>,
		onAbort?: Nullable<i.RejectHandler>
	): Then<T | R>;

	then<V>(
		onFulfill: i.ThenFulfillHandler<T, V>,
		onReject?: Nullable<i.ThenRejectHandler<V>>,
		onAbort?: Nullable<i.RejectHandler>
	): Then<V>;

	then<V, R>(
		onFulfill: i.ThenFulfillHandler<T, V>,
		onReject: i.ThenRejectHandler<R>,
		onAbort?: Nullable<i.RejectHandler>
	): Then<V | R>;

	then(
		onFulfill: Nullable<i.ThenFulfillHandler<any>>,
		onReject: Nullable<i.ThenRejectHandler<any>>,
		onAbort: Nullable<i.RejectHandler>
	): Then<any> {
		this.pendingChildren++;
		return new Then((res, rej, abort) => {
			let
				resolve,
				reject;

			if (Object.isFunction(onFulfill)) {
				resolve = (val) => {
					this.call(onFulfill, [val], rej, res);
				};

			} else {
				resolve = res;
			}

			if (Object.isFunction(onReject)) {
				reject = (err) => {
					this.call(onReject, [err], rej, res);
				};

			} else {
				reject = rej;
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
					reject(reason);
				}
			});

			this.promise.then(resolve, reject);
		});
	}

	/**
	 * Attaches a callback for only the rejection of the promise
	 * @param [onReject]
	 */
	catch(onReject?: Nullable<i.ThenRejectHandler<T>>): Then<T>;
	catch<R>(onReject: i.ThenRejectHandler<R>): Then<R>;
	catch(onReject?: i.ThenRejectHandler<any>): Then<any> {
		return new Then((res, rej, onAbort) => {
			let
				reject;

			if (Object.isFunction(onReject)) {
				reject = (err) => {
					this.call(onReject, [err], rej, res);
				};

			} else {
				reject = rej;
			}

			const
				that = this;

			onAbort(/** @this {Then} */ function (this: Then, reason: unknown): void {
				this.aborted = true;

				if (!that.abort(reason)) {
					reject(reason);
				}
			});

			this.promise.then(res, reject);
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
		fn: Function,
		args: A[] = [],
		onError?: i.RejectHandler,
		onValue?: (value: V) => void
	): void {
		const
			loopback = () => undefined,
			reject = onError || loopback,
			resolve = onValue || loopback;

		try {
			const
				v = fn(...args);

			if (Object.isPromise(v)) {
				v.then(<any>resolve, reject);

			} else {
				resolve(v);
			}

		} catch (err) {
			reject(err);
		}
	}
}
