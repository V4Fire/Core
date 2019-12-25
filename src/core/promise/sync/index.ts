/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as i from 'core/promise/sync/interface';
export * from 'core/promise/sync/interface';

export default class SyncPromise<T = unknown> implements PromiseLike<T> {
	/**
	 * Creates a new resolved promise for the specified value
	 * @param value
	 */
	static resolve<T = unknown>(value: i.Value<T>): SyncPromise<T>;
	static resolve(): SyncPromise<void>;
	static resolve<T = unknown>(value?: i.Value<T>): SyncPromise<T> {
		if (value instanceof SyncPromise) {
			return value;
		}

		return new SyncPromise((resolve, reject) => {
			if (Object.isPromiseLike(value)) {
				value.then(resolve, reject);

			} else {
				resolve(value);
			}
		});
	}

	/**
	 * Creates a new rejected promise for the specified reason
	 * @param [reason]
	 */
	static reject<T = never>(reason?: unknown): SyncPromise<T> {
		return new SyncPromise((_, reject) => reject(reason));
	}

	/**
	 * Creates a promise that is resolved with an array of results when all of the provided promises
	 * resolve, or rejected when any promise is rejected
	 *
	 * @param values
	 */
	static all<T1, T2, T3, T4, T5>(
		values: [i.Value<T1>, i.Value<T2>, i.Value<T3>, i.Value<T4>, i.Value<T5>]
	): SyncPromise<[T1, T2, T3, T4, T5]>;

	static all<T1, T2, T3, T4>(
		values: [i.Value<T1>, i.Value<T2>, i.Value<T3>, i.Value<T4>]
	): SyncPromise<[T1, T2, T3, T4]>;

	static all<T1, T2, T3>(
		values: [i.Value<T1>, i.Value<T2>, i.Value<T3>]
	): SyncPromise<[T1, T2, T3]>;

	static all<T1, T2>(
		values: [i.Value<T1>, i.Value<T2>]
	): SyncPromise<[T1, T2]>;

	static all<T1>(
		values: [i.Value<T1>]
	): SyncPromise<[T1]>;

	static all<T extends Iterable<i.Value>>(
		values: T
	): SyncPromise<(T extends Iterable<i.Value<infer V>> ? V : unknown)[]>;

	static all<T extends Iterable<i.Value>>(
		values: T
	): SyncPromise<(T extends Iterable<i.Value<infer V>> ? V : unknown)[]> {
		return new SyncPromise((resolve, reject) => {
			const
				promises = <SyncPromise[]>[],
				resolved = <any[]>[];

			Object.forEach(values, (el) => {
				promises.push(SyncPromise.resolve(el));
			});

			if (!promises.length) {
				resolve(resolved);
				return;
			}

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
		});
	}

	/**
	 * Creates a promise that is resolved or rejected when any of the provided promises are resolved or rejected
	 * @param values
	 */
	static race<T extends Iterable<i.Value>>(
		values: T
	): SyncPromise<T extends Iterable<i.Value<infer V>> ? V : unknown> {
		return new SyncPromise((resolve, reject) => {
			const
				promises = <SyncPromise[]>[];

			Object.forEach(values, (el) => {
				promises.push(SyncPromise.resolve(el));
			});

			if (!promises.length) {
				resolve();
				return;
			}

			for (let i = 0; i < promises.length; i++) {
				promises[i].then(resolve, reject);
			}
		});
	}

	/**
	 * Returns true if the current promise is pending
	 */
	get isPending(): boolean {
		return this.state === i.State.pending;
	}

	/**
	 * A value of the current promise state
	 */
	protected state: i.State = i.State.pending;

	/**
	 * A value of the promise
	 */
	protected value: unknown;

	/**
	 * The list of handler for the "finally" operation
	 */
	protected finallyHandlers: i.FinallyHandler[] = [];

	/**
	 * The list of handler for the "resolve" operation
	 */
	protected resolveHandlers: i.ConstrResolveHandler[] = [];

	/**
	 * The list of handler for the "reject" operation
	 */
	protected rejectHandlers: i.ConstrRejectHandler[] = [];

	constructor(executor: i.Executor) {
		const clear = () => {
			this.resolveHandlers = [];
			this.rejectHandlers = [];
			this.finallyHandlers = [];
		};

		const resolve = (value) => {
			if (!this.isPending) {
				return;
			}

			this.value = value;
			this.state = i.State.fulfilled;

			this.resolveHandlers.forEach((fn) => fn(this.value));
			this.finallyHandlers.forEach((fn) => fn());

			clear();
		};

		const reject = (err) => {
			if (!this.isPending) {
				return;
			}

			this.value = err;
			this.state = i.State.rejected;

			this.rejectHandlers.forEach((fn) => fn(this.value));
			this.finallyHandlers.forEach((fn) => fn());

			clear();
		};

		this.call(executor, [resolve, reject], reject);
	}

	/**
	 * Attaches callbacks for the resolution and/or rejection of the promise
	 *
	 * @param [onFulfill]
	 * @param [onReject]
	 */
	then(
		onFulfill?: Nullable<i.ResolveHandler<T>>,
		onReject?: Nullable<i.RejectHandler<T>>
	): SyncPromise<T>;

	then<R>(
		onFulfill: Nullable<i.ResolveHandler<T>>,
		onReject: i.RejectHandler<R>
	): SyncPromise<T | R>;

	then<V>(
		onFulfill: i.ResolveHandler<T, V>,
		onReject?: Nullable<i.RejectHandler<V>>
	): SyncPromise<V>;

	then<V, R>(
		onFulfill: i.ResolveHandler<T, V>,
		onReject: i.RejectHandler<R>
	): SyncPromise<V | R>;

	then(
		onFulfill: Nullable<i.ResolveHandler<any>>,
		onReject: Nullable<i.RejectHandler<any>>
	): SyncPromise<any> {
		return new SyncPromise((resolve, reject) => {
			const
				resolveWrapper = (v) => this.call(onFulfill || resolve, [v], reject, resolve),
				rejectWrapper = (v) => this.call(onReject || reject, [v], reject, resolve);

			if (this.isPending) {
				this.resolveHandlers.push(resolveWrapper);
				this.rejectHandlers.push(rejectWrapper);

			} else {
				(this.state === i.State.fulfilled ? resolveWrapper : rejectWrapper)(this.value);
			}
		});
	}

	/**
	 * Attaches a callback for only the rejection of the promise
	 * @param [onReject]
	 */
	catch(onReject?: Nullable<i.RejectHandler<T>>): SyncPromise<T>;
	catch<R>(onReject: i.RejectHandler<R>): SyncPromise<R>;
	catch(onReject?: i.RejectHandler<any>): SyncPromise<any> {
		return new SyncPromise((resolve, reject) => {
			const
				rejectWrapper = (v) => this.call(onReject || reject, [v], reject, resolve);

			if (this.isPending) {
				this.rejectHandlers.push(rejectWrapper);

			} else if (this.state === i.State.rejected) {
				rejectWrapper(this.value);
			}
		});
	}

	/**
	 * Attaches a callback that is invoked when the promise is settled (fulfilled or rejected).
	 * The resolved value cannot be modified from the callback.
	 *
	 * @param [cb]
	 */
	finally(cb?: Nullable<i.FinallyHandler>): SyncPromise<T> {
		return new SyncPromise((resolve, reject) => {
			if (this.isPending) {
				if (cb) {
					this.finallyHandlers.push(cb);
				}

				this.resolveHandlers.push(resolve);
				this.rejectHandlers.push(reject);

			} else {
				(this.state === i.State.fulfilled ? resolve : reject)(this.value);

				if (cb) {
					cb();
				}
			}
		});
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
