/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/promise/abortable/README.md]]
 * @packageDocumentation
 */

import { deprecated } from 'core/functools';

import {

	Value,
	ExecutableValue,
	State,
	Executor,

	ResolveHandler,
	RejectHandler,
	FinallyHandler,

	ConstrFulfillHandler,
	ConstrRejectHandler

} from 'core/promise/abortable/interface';

export * from 'core/promise/abortable/interface';

/**
 * Class wraps promise-like objects and adds to them some extra functionality,
 * such as possibility of cancellation, etc.
 *
 * @typeparam T - promise resolved value
 */
export default class AbortablePromise<T = unknown> implements Promise<T> {
	/**
	 * The promise that is never resolved
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
	 * Creates a new resolved AbortablePromise promise for the specified value.
	 * If the resolved value is a function, it will be invoked.
	 * The result of the invoking will be provided as a value of the promise.
	 *
	 * @param value
	 * @param [parent] - parent promise
	 */
	static resolveAndCall<T = unknown>(value: ExecutableValue<T>, parent?: AbortablePromise): AbortablePromise<T>;

	/**
	 * Creates a new resolved AbortablePromise promise
	 */
	static resolveAndCall(): AbortablePromise<void>;
	static resolveAndCall<T = unknown>(value?: ExecutableValue<T>, parent?: AbortablePromise): AbortablePromise<T> {
		return AbortablePromise.resolve(value, parent).then<T>((obj) => Object.isFunction(obj) ? obj() : obj);
	}

	/**
	 * @deprecated
	 * @see [[AbortablePromise.resolveAndCall]]
	 */
	@deprecated({renamedTo: 'resolveAndCall'})
	static immediate<T = unknown>(value: ExecutableValue<T>, parent?: AbortablePromise): AbortablePromise<T> {
		return this.resolveAndCall(value, parent);
	}

	/**
	 * Creates a new resolved AbortablePromise promise for the specified value
	 *
	 * @param value
	 * @param [parent] - parent promise
	 */
	static resolve<T = unknown>(value: Value<T>, parent?: AbortablePromise): AbortablePromise<T>;

	/**
	 * Creates a new resolved AbortablePromise promise
	 */
	static resolve(): AbortablePromise<void>;
	static resolve<T = unknown>(value?: Value<T>, parent?: AbortablePromise): AbortablePromise<T> {
		if (value instanceof AbortablePromise) {
			if (parent) {
				parent.catch((err) => value.abort(err));
			}

			return value;
		}

		return new AbortablePromise((resolve, reject) => {
			if (Object.isPromiseLike(value)) {
				value.then(resolve, reject);

			} else {
				resolve(value);
			}

		}, parent);
	}

	/**
	 * Creates a new rejected AbortablePromise promise for the specified reason
	 *
	 * @param [reason]
	 * @param [parent] - parent promise
	 */
	static reject<T = never>(reason?: unknown, parent?: AbortablePromise): AbortablePromise<T> {
		return new AbortablePromise((_, reject) => reject(reason), parent);
	}

	/**
	 * Creates a AbortablePromise promise that is resolved with an array of results when all the provided promises
	 * are resolved, or rejected when any promise is rejected
	 *
	 * @param values
	 * @param [parent] - parent promise
	 */
	// @ts-ignore (invalid implementation)
	static all<T1, T2, T3, T4, T5>(
		values: [Value<T1>, Value<T2>, Value<T3>, Value<T4>, Value<T5>],
		parent?: AbortablePromise
	): AbortablePromise<[T1, T2, T3, T4, T5]>;

	static all<T1, T2, T3, T4>(
		values: [Value<T1>, Value<T2>, Value<T3>, Value<T4>],
		parent?: AbortablePromise
	): AbortablePromise<[T1, T2, T3, T4]>;

	static all<T1, T2, T3>(
		values: [Value<T1>, Value<T2>, Value<T3>],
		parent?: AbortablePromise
	): AbortablePromise<[T1, T2, T3]>;

	static all<T1, T2>(
		values: [Value<T1>, Value<T2>],
		parent?: AbortablePromise
	): AbortablePromise<[T1, T2]>;

	static all<T1>(
		values: [Value<T1>],
		parent?: AbortablePromise
	): AbortablePromise<[T1]>;

	static all<T extends Iterable<Value>>(
		values: T,
		parent?: AbortablePromise
	): AbortablePromise<Array<T extends Iterable<Value<infer V>> ? V : unknown>>;

	static all<T extends Iterable<Value>>(
		values: T,
		parent?: AbortablePromise
	): AbortablePromise<Array<T extends Iterable<Value<infer V>> ? V : unknown>> {
		return new AbortablePromise((resolve, reject, onAbort) => {
			const
				promises = <AbortablePromise[]>[],
				resolved = <any[]>[];

			for (const el of values) {
				promises.push(AbortablePromise.resolve(el));
			}

			if (promises.length === 0) {
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
	 * Creates a promise that is resolved with an array of results when all the provided promises
	 * are resolved or rejected
	 *
	 * @param values
	 * @param [parent] - parent promise
	 */
	// @ts-ignore (invalid implementation)
	static allSettled<T1, T2, T3, T4, T5>(
		values: [Value<T1>, Value<T2>, Value<T3>, Value<T4>, Value<T5>],
		parent?: AbortablePromise
	): AbortablePromise<[
		PromiseSettledResult<T1>,
		PromiseSettledResult<T2>,
		PromiseSettledResult<T3>,
		PromiseSettledResult<T4>,
		PromiseSettledResult<T5>
	]>;

	static allSettled<T1, T2, T3, T4>(
		values: [Value<T1>, Value<T2>, Value<T3>, Value<T4>],
		parent?: AbortablePromise
	): AbortablePromise<[
		PromiseSettledResult<T1>,
		PromiseSettledResult<T2>,
		PromiseSettledResult<T3>,
		PromiseSettledResult<T4>
	]>;

	static allSettled<T1, T2, T3>(
		values: [Value<T1>, Value<T2>, Value<T3>],
		parent?: AbortablePromise
	): AbortablePromise<[
		PromiseSettledResult<T1>,
		PromiseSettledResult<T2>,
		PromiseSettledResult<T3>
	]>;

	static allSettled<T1, T2>(
		values: [Value<T1>, Value<T2>],
		parent?: AbortablePromise
	): AbortablePromise<[
		PromiseSettledResult<T1>,
		PromiseSettledResult<T2>
	]>;

	static allSettled<T1>(
		values: [Value<T1>],
		parent?: AbortablePromise
	): AbortablePromise<[PromiseSettledResult<T1>]>;

	static allSettled<T extends Iterable<Value>>(
		values: T,
		parent?: AbortablePromise
	): AbortablePromise<
		Array<T extends Iterable<Value<infer V>> ? PromiseSettledResult<V> : PromiseSettledResult<unknown>>
	>;

	static allSettled<T extends Iterable<Value>>(
		values: T,
		parent?: AbortablePromise
	): AbortablePromise<
		Array<T extends Iterable<Value<infer V>> ? PromiseSettledResult<V> : PromiseSettledResult<unknown>>
	> {
		return new AbortablePromise((resolve, _, onAbort) => {
			const
				promises = <AbortablePromise[]>[],
				resolved = <any[]>[];

			for (const el of values) {
				promises.push(AbortablePromise.resolve(el));
			}

			if (promises.length === 0) {
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
					(value) => {
						resolved[i] = {
							status: 'fulfilled',
							value
						};

						if (++counter === promises.length) {
							resolve(resolved);
						}
					},

					(reason) => {
						resolved[i] = {
							status: 'rejected',
							reason
						};

						if (++counter === promises.length) {
							resolve(resolved);
						}
					}
				);
			}

		}, parent);
	}

	/**
	 * Creates an abortable promise that is resolved or rejected when any of the provided promises are resolved or
	 * rejected
	 *
	 * @param values
	 * @param [parent] - parent promise
	 */
	static race<T extends Iterable<Value>>(
		values: T,
		parent?: AbortablePromise
	): AbortablePromise<T extends Iterable<Value<infer V>> ? V : unknown> {
		return new AbortablePromise((resolve, reject, onAbort) => {
			const
				promises = <AbortablePromise[]>[];

			for (const el of values) {
				promises.push(AbortablePromise.resolve(el));
			}

			if (promises.length === 0) {
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
	 * Creates a promise that is resolved when any of the provided promises are resolved or
	 * rejected if the provided all promises are rejected
	 *
	 * @param values
	 * @param [parent] - parent promise
	 */
	static any<T extends Iterable<Value>>(
		values: T,
		parent?: AbortablePromise
	): AbortablePromise<T extends Iterable<Value<infer V>> ? V : unknown> {
		return new AbortablePromise((resolve, reject, onAbort) => {
			const
				promises = <AbortablePromise[]>[];

			for (const el of values) {
				promises.push(AbortablePromise.resolve(el));
			}

			if (promises.length === 0) {
				resolve();
				return;
			}

			onAbort((reason) => {
				for (let i = 0; i < promises.length; i++) {
					promises[i].abort(reason);
				}
			});

			const
				errors = <Error[]>[];

			for (let i = 0; i < promises.length; i++) {
				promises[i].then(resolve, onReject);
			}

			function onReject(err: Error): void {
				errors.push(err);

				if (errors.length === promises.length) {
					reject(new AggregateError(errors, 'No Promise in Promise.any was resolved'));
				}
			}
		}, parent);
	}

	/** @override */
	readonly [Symbol.toStringTag]: 'Promise';

	/**
	 * True if the current promise is pending
	 */
	get isPending(): boolean {
		return this.state === State.pending;
	}

	/**
	 * Number of pending child promises
	 */
	protected pendingChildren: number = 0;

	/**
	 * Value of the current promise state
	 */
	protected state: State = State.pending;

	/**
	 * If true, then the promise was aborted
	 */
	protected aborted: boolean = false;

	/**
	 * Internal native promise instance
	 */
	protected promise: Promise<T>;

	/**
	 * Handler of the native promise fulfilling
	 */
	protected onFulfill!: ConstrFulfillHandler<T>;

	/**
	 * Handler of the native promise rejection
	 */
	protected onReject!: ConstrRejectHandler;

	/**
	 * Handler of the native promise rejection that was raised by a reason of abort
	 */
	protected onAbort!: ConstrRejectHandler;

	/**
	 * @param executor - executor function
	 * @param [parent] - parent promise
	 */
	constructor(executor: Executor<T>, parent?: AbortablePromise) {
		this.promise = new Promise((resolve, reject) => {
			const resolveWrapper = (val) => {
				if (!this.isPending) {
					return;
				}

				this.state = State.fulfilled;
				resolve(val);
			};

			const rejectWrapper = (err) => {
				if (!this.isPending) {
					return;
				}

				this.state = State.rejected;
				reject(err);
			};

			this.onFulfill = resolveWrapper;
			this.onReject = rejectWrapper;

			let
				setOnAbort;

			if (parent) {
				const abortParent = (reason) => {
					parent.abort(reason);
				};

				this.onAbort = abortParent;

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

			if (this.isPending && (!parent || parent.state !== State.rejected)) {
				this.call(executor, [resolveWrapper, rejectWrapper, setOnAbort], rejectWrapper);
			}
		});
	}

	/**
	 * Attaches callbacks for the resolution and/or rejection of the promise
	 *
	 * @param [onFulfilled]
	 * @param [onRejected]
	 * @param [onAbort]
	 */
	then(
		onFulfilled?: Nullable<ResolveHandler<T>>,
		onRejected?: Nullable<RejectHandler<T>>,
		onAbort?: Nullable<ConstrRejectHandler>
	): AbortablePromise<T>;

	then<R>(
		onFulfilled: Nullable<ResolveHandler<T>>,
		onRejected: RejectHandler<R>,
		onAbort?: Nullable<ConstrRejectHandler>
	): AbortablePromise<T | R>;

	then<V>(
		onFulfilled: ResolveHandler<T, V>,
		onRejected?: Nullable<RejectHandler<V>>,
		onAbort?: Nullable<ConstrRejectHandler>
	): AbortablePromise<V>;

	then<V, R>(
		onFulfilled: ResolveHandler<T, V>,
		onRejected: RejectHandler<R>,
		onAbort?: Nullable<ConstrRejectHandler>
	): AbortablePromise<V | R>;

	then(
		onFulfilled: Nullable<ResolveHandler>,
		onRejected: Nullable<RejectHandler>,
		onAbort: Nullable<ConstrRejectHandler>
	): AbortablePromise<any> {
		this.pendingChildren++;
		return new AbortablePromise((resolve, reject, abort) => {
			let
				resolveWrapper,
				rejectWrapper;

			if (Object.isFunction(onFulfilled)) {
				resolveWrapper = (val) => {
					this.call(onFulfilled, [val], reject, resolve);
				};

			} else {
				resolveWrapper = resolve;
			}

			if (Object.isFunction(onRejected)) {
				rejectWrapper = (err) => {
					this.call(onRejected, [err], reject, resolve);
				};

			} else {
				rejectWrapper = reject;
			}

			const
				that = this;

			abort(function abortHandler(this: AbortablePromise, reason: unknown): void {
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
	 * @param [onRejected]
	 */
	catch(onRejected?: Nullable<RejectHandler<T>>): AbortablePromise<T>;
	catch<R>(onRejected: RejectHandler<R>): AbortablePromise<R>;
	catch(onRejected?: RejectHandler): AbortablePromise<any> {
		return new AbortablePromise((resolve, reject, onAbort) => {
			let
				rejectWrapper;

			if (Object.isFunction(onRejected)) {
				rejectWrapper = (err) => {
					this.call(onRejected, [err], reject, resolve);
				};

			} else {
				rejectWrapper = reject;
			}

			const
				that = this;

			onAbort(function abortHandler(this: AbortablePromise, reason: unknown): void {
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
	finally(cb?: Nullable<FinallyHandler>): AbortablePromise<T> {
		return new AbortablePromise((resolve, reject, onAbort) => {
			const
				that = this;

			onAbort(function abortHandler(this: AbortablePromise, reason: unknown): void {
				this.aborted = true;

				if (!that.abort(reason)) {
					reject(reason);
				}
			});

			this.promise.finally(() => cb?.()).then(resolve, reject);
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

		if (this.pendingChildren > 0) {
			this.pendingChildren--;
		}

		if (this.pendingChildren === 0) {
			this.call(this.onAbort, [reason]);

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
	 * @param args - arguments for the function
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
