/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import {

	Value,
	State,
	Executor,

	ResolveHandler,
	RejectHandler,
	FinallyHandler,

	ConstrRejectHandler,
	ConstrResolveHandler

} from 'core/prelude/structures/sync-promise/interface';

export * from 'core/prelude/structures/sync-promise/interface';

/**
 * Class is similar to the native promise class but works synchronously
 */
export default class SyncPromise<T = unknown> implements Promise<T> {
	/**
	 * Creates a new resolved promise for the specified value
	 * @param value
	 */
	static resolve<T = unknown>(value: Value<T>): SyncPromise<T>;

	/**
	 * Creates a new resolved promise
	 */
	static resolve(): SyncPromise<void>;
	static resolve<T = unknown>(value?: Value<T>): SyncPromise<T> {
		const
			Constr = Object.isTruly(this) ? this : SyncPromise;

		if (value instanceof Constr) {
			return value;
		}

		return new Constr((resolve, reject) => {
			if (Object.isPromiseLike(value)) {
				value.then(resolve, reject);

			} else {
				resolve(value);
			}
		});
	}

	/**
	 * Creates a new rejected promise with the specified reason
	 * @param [reason]
	 */
	static reject<T = never>(reason?: unknown): SyncPromise<T> {
		const Constr = Object.isTruly(this) ? this : SyncPromise;
		return new Constr((_, reject) => reject(reason));
	}

	/**
	 * Creates a promise that is resolved with an array of results when all the provided promises
	 * are resolved, or rejected when any promise is rejected
	 *
	 * @param values
	 */
	static all<T1, T2, T3, T4, T5>(
		values: [Value<T1>, Value<T2>, Value<T3>, Value<T4>, Value<T5>]
	): SyncPromise<[T1, T2, T3, T4, T5]>;

	static all<T1, T2, T3, T4>(
		values: [Value<T1>, Value<T2>, Value<T3>, Value<T4>]
	): SyncPromise<[T1, T2, T3, T4]>;

	static all<T1, T2, T3>(
		values: [Value<T1>, Value<T2>, Value<T3>]
	): SyncPromise<[T1, T2, T3]>;

	static all<T1, T2>(
		values: [Value<T1>, Value<T2>]
	): SyncPromise<[T1, T2]>;

	static all<T1>(
		values: [Value<T1>]
	): SyncPromise<[T1]>;

	static all<T extends Iterable<Value>>(
		values: T
	): SyncPromise<Array<T extends Iterable<Value<infer V>> ? V : unknown>>;

	static all<T extends Iterable<Value>>(
		values: T
	): SyncPromise<Array<T extends Iterable<Value<infer V>> ? V : unknown>> {
		return new SyncPromise((resolve, reject) => {
			const
				promises = <SyncPromise[]>[],
				resolved = <unknown[]>[];

			Object.forEach(values, (el) => {
				promises.push(SyncPromise.resolve(el));
			});

			if (promises.length === 0) {
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
	static race<T extends Iterable<Value>>(
		values: T
	): SyncPromise<T extends Iterable<Value<infer V>> ? V : unknown> {
		return new SyncPromise((resolve, reject) => {
			const
				promises = <SyncPromise[]>[];

			Object.forEach(values, (el) => {
				promises.push(SyncPromise.resolve(el));
			});

			if (promises.length === 0) {
				resolve();
				return;
			}

			for (let i = 0; i < promises.length; i++) {
				promises[i].then(resolve, reject);
			}
		});
	}

	/** @override */
	readonly [Symbol.toStringTag]: 'Promise';

	/**
	 * Returns true if the current promise is pending
	 */
	get isPending(): boolean {
		return this.state === State.pending;
	}

	/**
	 * Value of the current promise state
	 */
	protected state: State = State.pending;

	/**
	 * Value of the promise
	 */
	protected value: unknown;

	/**
	 * List of handler for the "finally" operation
	 */
	protected finallyHandlers: FinallyHandler[] = [];

	/**
	 * List of handler for the "resolve" operation
	 */
	protected resolveHandlers: ConstrResolveHandler[] = [];

	/**
	 * List of handler for the "reject" operation
	 */
	protected rejectHandlers: ConstrRejectHandler[] = [];

	constructor(executor: Executor) {
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
			this.state = State.fulfilled;

			this.resolveHandlers.forEach((fn) => fn(this.value));
			this.finallyHandlers.forEach((fn) => fn());

			clear();
		};

		const reject = (err) => {
			if (!this.isPending) {
				return;
			}

			this.value = err;
			this.state = State.rejected;

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
		onFulfill?: Nullable<ResolveHandler<T>>,
		onReject?: Nullable<RejectHandler<T>>
	): SyncPromise<T>;

	then<R>(
		onFulfill: Nullable<ResolveHandler<T>>,
		onReject: RejectHandler<R>
	): SyncPromise<T | R>;

	then<V>(
		onFulfill: ResolveHandler<T, V>,
		onReject?: Nullable<RejectHandler<V>>
	): SyncPromise<V>;

	then<V, R>(
		onFulfill: ResolveHandler<T, V>,
		onReject: RejectHandler<R>
	): SyncPromise<V | R>;

	then(
		onFulfill: Nullable<ResolveHandler>,
		onReject: Nullable<RejectHandler>
	): SyncPromise {
		return new SyncPromise((resolve, reject) => {
			const
				resolveWrapper = (v) => this.call(onFulfill ?? resolve, [v], reject, resolve),
				rejectWrapper = (v) => this.call(onReject ?? reject, [v], reject, resolve);

			if (this.isPending) {
				this.resolveHandlers.push(resolveWrapper);
				this.rejectHandlers.push(rejectWrapper);

			} else {
				(this.state === State.fulfilled ? resolveWrapper : rejectWrapper)(this.value);
			}
		});
	}

	/**
	 * Attaches a callback for only the rejection of the promise
	 * @param [onReject]
	 */
	catch(onReject?: Nullable<RejectHandler<T>>): SyncPromise<T>;
	catch<R>(onReject: RejectHandler<R>): SyncPromise<R>;
	catch(onReject?: RejectHandler): SyncPromise {
		return new SyncPromise((resolve, reject) => {
			const
				rejectWrapper = (v) => this.call(onReject ?? reject, [v], reject, resolve);

			if (this.isPending) {
				this.rejectHandlers.push(rejectWrapper);

			} else if (this.state === State.rejected) {
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
	finally(cb?: Nullable<FinallyHandler>): SyncPromise<T> {
		return new SyncPromise((resolve, reject) => {
			if (this.isPending) {
				if (cb) {
					this.finallyHandlers.push(cb);
				}

				this.resolveHandlers.push(resolve);
				this.rejectHandlers.push(reject);

			} else {
				(this.state === State.fulfilled ? resolve : reject)(this.value);

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
	 * @param args - arguments of the function
	 * @param [onError] - error handler
	 * @param [onValue] - success handler
	 */
	protected call<A = unknown, V = unknown>(
		fn: Nullable<Function>,
		args: A[] = [],
		onError?: ConstrRejectHandler,
		onValue?: AnyOneArgFunction<V>
	): void {
		const
			loopback = () => undefined,
			reject = onError ?? loopback,
			resolve = onValue ?? loopback;

		try {
			const
				v = fn ? fn(...args) : undefined;

			if (Object.isPromiseLike(v)) {
				(<PromiseLike<V>>v).then(resolve, reject);

			} else {
				resolve(v);
			}

		} catch (err) {
			reject(err);
		}
	}
}
