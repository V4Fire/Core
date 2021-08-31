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

import { deprecated } from 'core/functools';

import {

	Value,
	ExecutableValue,
	State,
	Executor,

	ResolveHandler,
	RejectHandler,
	FinallyHandler,

	ConstrResolveHandler,
	ConstrRejectHandler

} from 'core/then/interface';

export * from 'core/then/interface';

/**
 * Class wraps promise-like objects and adds to them some extra functionality,
 * such as possibility of cancellation, etc.
 *
 * @typeparam T - promise resolved value
 */
export default class Then<T = unknown> implements Promise<T> {
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
	 * Creates a new resolved Then promise for the specified value.
	 * If the resolved value is a function, it will be invoked.
	 * The result of the invoking will be provided as a value of the promise.
	 *
	 * @param value
	 * @param [parent] - parent promise
	 */
	static resolveAndCall<T = unknown>(value: ExecutableValue<T>, parent?: Then): Then<T>;

	/**
	 * Creates a new resolved Then promise
	 */
	static resolveAndCall(): Then<void>;
	static resolveAndCall<T = unknown>(value?: ExecutableValue<T>, parent?: Then): Then<T> {
		return Then.resolve(value, parent).then<T>((obj) => Object.isFunction(obj) ? obj() : obj);
	}

	/**
	 * @deprecated
	 * @see [[Then.resolveAndCall]]
	 */
	@deprecated({renamedTo: 'resolveAndCall'})
	static immediate<T = unknown>(value: ExecutableValue<T>, parent?: Then): Then<T> {
		return this.resolveAndCall(value, parent);
	}

	/**
	 * Creates a new resolved Then promise for the specified value
	 *
	 * @param value
	 * @param [parent] - parent promise
	 */
	static resolve<T = unknown>(value: Value<T>, parent?: Then): Then<T>;

	/**
	 * Creates a new resolved Then promise
	 */
	static resolve(): Then<void>;
	static resolve<T = unknown>(value?: Value<T>, parent?: Then): Then<T> {
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
	 * Creates a Then promise that is resolved with an array of results when all the provided promises
	 * are resolved, or rejected when any promise is rejected
	 *
	 * @param values
	 * @param [parent] - parent promise
	 */
	// @ts-ignore (invalid implementation)
	static all<T1, T2, T3, T4, T5>(
		values: [Value<T1>, Value<T2>, Value<T3>, Value<T4>, Value<T5>],
		parent?: Then
	): Then<[T1, T2, T3, T4, T5]>;

	static all<T1, T2, T3, T4>(
		values: [Value<T1>, Value<T2>, Value<T3>, Value<T4>],
		parent?: Then
	): Then<[T1, T2, T3, T4]>;

	static all<T1, T2, T3>(
		values: [Value<T1>, Value<T2>, Value<T3>],
		parent?: Then
	): Then<[T1, T2, T3]>;

	static all<T1, T2>(
		values: [Value<T1>, Value<T2>],
		parent?: Then
	): Then<[T1, T2]>;

	static all<T1>(
		values: [Value<T1>],
		parent?: Then
	): Then<[T1]>;

	static all<T extends Iterable<Value>>(
		values: T,
		parent?: Then
	): Then<Array<T extends Iterable<Value<infer V>> ? V : unknown>>;

	static all<T extends Iterable<Value>>(
		values: T,
		parent?: Then
	): Then<Array<T extends Iterable<Value<infer V>> ? V : unknown>> {
		return new Then((resolve, reject, onAbort) => {
			const
				promises = <Then[]>[],
				resolved = <any[]>[];

			for (const el of values) {
				promises.push(Then.resolve(el));
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
		parent?: Then
	): Then<[
		PromiseSettledResult<T1>,
		PromiseSettledResult<T2>,
		PromiseSettledResult<T3>,
		PromiseSettledResult<T4>,
		PromiseSettledResult<T5>
	]>;

	static allSettled<T1, T2, T3, T4>(
		values: [Value<T1>, Value<T2>, Value<T3>, Value<T4>],
		parent?: Then
	): Then<[
		PromiseSettledResult<T1>,
		PromiseSettledResult<T2>,
		PromiseSettledResult<T3>,
		PromiseSettledResult<T4>
	]>;

	static allSettled<T1, T2, T3>(
		values: [Value<T1>, Value<T2>, Value<T3>],
		parent?: Then
	): Then<[
		PromiseSettledResult<T1>,
		PromiseSettledResult<T2>,
		PromiseSettledResult<T3>
	]>;

	static allSettled<T1, T2>(
		values: [Value<T1>, Value<T2>],
		parent?: Then
	): Then<[
		PromiseSettledResult<T1>,
		PromiseSettledResult<T2>
	]>;

	static allSettled<T1>(
		values: [Value<T1>],
		parent?: Then
	): Then<[PromiseSettledResult<T1>]>;

	static allSettled<T extends Iterable<Value>>(
		values: T,
		parent?: Then
	): Then<Array<T extends Iterable<Value<infer V>> ? PromiseSettledResult<V> : PromiseSettledResult<unknown>>>;

	static allSettled<T extends Iterable<Value>>(
		values: T,
		parent?: Then
	): Then<Array<T extends Iterable<Value<infer V>> ? PromiseSettledResult<V> : PromiseSettledResult<unknown>>> {
		return new Then((resolve, _, onAbort) => {
			const
				promises = <Then[]>[],
				resolved = <any[]>[];

			for (const el of values) {
				promises.push(Then.resolve(el));
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
	 * Creates a Then promise that is resolved or rejected when any of the provided promises are resolved or rejected
	 *
	 * @param values
	 * @param [parent] - parent promise
	 */
	static race<T extends Iterable<Value>>(
		values: T,
		parent?: Then
	): Then<T extends Iterable<Value<infer V>> ? V : unknown> {
		return new Then((resolve, reject, onAbort) => {
			const
				promises = <Then[]>[];

			for (const el of values) {
				promises.push(Then.resolve(el));
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
	 * Handler of the native promise resolving
	 */
	protected onResolve!: ConstrResolveHandler<T>;

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
	constructor(executor: Executor<T>, parent?: Then) {
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

			this.onResolve = resolveWrapper;
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
	 * @param [onFulfill]
	 * @param [onReject]
	 * @param [onAbort]
	 */
	then(
		onFulfill?: Nullable<ResolveHandler<T>>,
		onReject?: Nullable<RejectHandler<T>>,
		onAbort?: Nullable<ConstrRejectHandler>
	): Then<T>;

	then<R>(
		onFulfill: Nullable<ResolveHandler<T>>,
		onReject: RejectHandler<R>,
		onAbort?: Nullable<ConstrRejectHandler>
	): Then<T | R>;

	then<V>(
		onFulfill: ResolveHandler<T, V>,
		onReject?: Nullable<RejectHandler<V>>,
		onAbort?: Nullable<ConstrRejectHandler>
	): Then<V>;

	then<V, R>(
		onFulfill: ResolveHandler<T, V>,
		onReject: RejectHandler<R>,
		onAbort?: Nullable<ConstrRejectHandler>
	): Then<V | R>;

	then(
		onFulfill: Nullable<ResolveHandler>,
		onReject: Nullable<RejectHandler>,
		onAbort: Nullable<ConstrRejectHandler>
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

			abort(function abortHandler(this: Then, reason: unknown): void {
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
	catch(onReject?: Nullable<RejectHandler<T>>): Then<T>;
	catch<R>(onReject: RejectHandler<R>): Then<R>;
	catch(onReject?: RejectHandler): Then<any> {
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

			onAbort(function abortHandler(this: Then, reason: unknown): void {
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
	finally(cb?: Nullable<FinallyHandler>): Then<T> {
		return new Then((resolve, reject, onAbort) => {
			const
				that = this;

			onAbort(function abortHandler(this: Then, reason: unknown): void {
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
