/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');

export const enum State {
	pending,
	fulfilled,
	rejected
}

export type Value<T = any> = T | PromiseLike<T>;
export type ExecValue<T = any> = (() => T) | Value<T>;

export interface OnError {
	(reason?: any): void;
}

export interface Executor<T = any> {
	(
		resolve: (value?: Value<T>) => void,
		reject: (reason?: any) => void,
		onAbort: (cb: OnError) => void
	): void;
}

export default class Then<T = any> implements PromiseLike<T> {
	/**
	 * Promise that never will be resolved
	 */
	static readonly never: Promise<any> = new Promise(() => undefined);

	/**
	 * Returns true if the specified value is PromiseLike
	 * @param obj
	 */
	static isThenable(obj: any): obj is PromiseLike<any> {
		return Boolean(obj) && Object.isFunction(obj.then) && Object.isFunction(obj.catch);
	}

	/**
	 * Wraps the specified value with Then, that will be resolved after setImmediate
	 * @param [value] - if function, it will be executed
	 */
	static immediate<V>(value?: ExecValue<V>): Then<V> {
		return new Then((res, rej, onAbort) => {
			const id = setImmediate(() => {
				res(value && Object.isFunction(value) ? (<Function>value)() : value);
			});

			onAbort((r) => {
				clearImmediate(id);

				if (value instanceof Then) {
					value.bubblingAbort(r);
				}
			});
		});
	}

	/** @see {Promise.resolve} */
	static resolve<V>(value?: Value<V>): Then<V> {
		if (value instanceof Then) {
			return value;
		}

		return new Then((res, rej) => {
			if (Then.isThenable(value)) {
				value.then(res, rej);

			} else {
				res(value);
			}
		});
	}

	/** @see {Promise.reject} */
	static reject<V>(reason?: Value<V>): Then {
		return new Then((res, rej) => rej(reason));
	}

	/** @see {Promise.all} */
	// @ts-ignore
	static all<T1, T2, T3, T4>(values: [Value<T1>, Value<T2>, Value<T3>, Value<T4>]): Then<[T1, T2, T3, T4]>;
	static all<T1, T2, T3>(values: [Value<T1>, Value<T2>, Value<T3>]): Then<[T1, T2, T3]>;
	static all<T1, T2>(values: [Value<T1>, Value<T2>]): Then<[T1, T2]>;
	static all<T>(values: Iterable<Value<T>>): Then<T[]>;
	static all<T>(values: Iterable<Value<T>>): Then<T[]> {
		const
			promises = $C(values).map<Then>(Then.resolve);

		return new Then((res, rej, onAbort) => {
			let counter = 0;

			const
				resolved: any[] = [];

			$C(promises).forEach((promise, i) => {
				promise.then(
					(val) => {
						resolved[i] = val;

						if (++counter === promises.length) {
							res(resolved);
						}
					},

					rej
				);
			});

			onAbort((reason) => {
				$C(promises).forEach((el) => el.bubblingAbort(reason));
			});
		});
	}

	/** @see {Promise.race} */
	static race<T>(values: Iterable<Value<T>>): Then<T> {
		const
			promises = $C(values).map<Then>(Then.resolve);

		return new Then((res, rej, onAbort) => {
			$C(promises).forEach((promise) => {
				promise.then(res, rej);
			});

			onAbort((reason) => {
				$C(promises).forEach((el) => el.bubblingAbort(reason));
			});
		});
	}

	/**
	 * Returns true if the current promise is pending
	 */
	get isPending(): boolean {
		return this.state === State.pending;
	}

	/**
	 * Number of child promises
	 */
	protected pendingChildren: number = 0;

	/**
	 * Promise state
	 */
	protected state: State = State.pending;

	/**
	 * Internal promise
	 */
	protected promise: Promise<T>;

	/**
	 * Resolve function
	 */
	protected resolve!: (value?: Value<T>) => void;

	/**
	 * Reject function
	 */
	protected reject!: OnError;

	/**
	 * Abort handler
	 */
	protected onAbort!: OnError;

	/**
	 * @param executor - executor function
	 * @param [parent] - parent promise
	 */
	constructor(executor: Executor<T>, parent?: Then) {
		this.promise = new Promise((res, rej) => {
			const resolve = this.resolve = (v) => {
				if (!this.isPending) {
					return;
				}

				this.state = State.fulfilled;
				res(v);
			};

			const reject = this.reject = (v) => {
				if (!this.isPending) {
					return;
				}

				this.state = State.rejected;
				rej(v);
			};

			let
				setOnAbort;

			if (parent) {
				const
					abortParent = this.onAbort = (r) => parent.bubblingAbort(r);

				setOnAbort = (cb) => {
					this.onAbort = (r) => {
						abortParent(r);
						cb(r);
					};
				};

			} else {
				setOnAbort = (cb) => this.onAbort = cb;
			}

			this.evaluate(executor, [resolve, reject, setOnAbort], reject);
		});
	}

	/** @see {Promise.prototype.then} */
	// @ts-ignore
	then(
		onFulfilled?: ((value: T) => Value<T>) | null | undefined,
		onRejected?: ((reason: any) => Value<T>) | null | undefined,
		abortCb?: OnError | null | undefined
	): Then<T>;

	then<TReason>(
		onFulfilled: ((value: T) => Value<T>) | null | undefined,
		onRejected: (reason: any) => Value<TReason>,
		abortCb?: OnError | null | undefined
	): Then<T | TReason>;

	then<TValue>(
		onFulfilled: (value: T) => Value<TValue>,
		onRejected?: ((reason: any) => Value<TValue>) | null | undefined,
		abortCb?: OnError | null | undefined
	): Then<TValue>;

	then<TValue, TReason>(
		onFulfilled: (value: T) => Value<TValue>,
		onRejected: (reason: any) => Value<TReason>,
		abortCb?: OnError | null | undefined
	): Then<TValue | TReason>;

	// tslint:disable-next-line
	then(onFulfilled, onRejected, abortCb) {
		this.pendingChildren++;

		return new Then((res, rej, onAbort) => {
			let
				resolve,
				reject;

			if (Object.isFunction(onFulfilled)) {
				resolve = (v) => {
					this.evaluate(onFulfilled, [v], rej, res);
				};

			} else {
				resolve = res;
			}

			if (Object.isFunction(onRejected)) {
				reject = (r) => {
					this.evaluate(onRejected, [r], rej, res);
				};

			} else {
				reject = rej;
			}

			onAbort((r) => {
				if (Object.isFunction(abortCb)) {
					try {
						abortCb(r);

					} catch (_) {}
				}

				this.bubblingAbort(r);
			});

			this.promise.then(resolve, reject);
		});
	}

	/** @see {Promise.prototype.catch} */
	catch(onRejected?: ((reason: any) => Value<T>) | null | undefined): Then<T>;
	catch<TReason>(onRejected: (reason: any) => Value<TReason>): Then<TReason>;

	// tslint:disable-next-line
	catch(onRejected) {
		return this.then(null, onRejected);
	}

	/**
	 * Aborts the current promise
	 * @param [reason] - abort reason
	 */
	abort(reason?: any): void {
		if (this.isPending) {
			setImmediate(() => {
				this.evaluate(this.onAbort, [reason]);
				this.reject(reason);
			});
		}
	}

	/**
	 * Aborts the current promise:
	 * if .pendingChildren > 1, then the promise won't be aborted really
	 *
	 * @param [reason] - abort reason
	 */
	protected bubblingAbort(reason: any): void {
		if (this.pendingChildren < 2) {
			this.abort(reason);
		}

		this.pendingChildren--;
	}

	/**
	 * Executes a function with the specified parameters
	 *
	 * @param fn
	 * @param args - arguments
	 * @param [onError] - error handler
	 * @param [onValue] - success handler
	 */
	protected evaluate<T, V>(
		fn: (...args: T[]) => V,
		args: T[] = [],
		onError?: OnError,
		onValue?: (value: V) => void
	): void {
		try {
			const v = fn(...args);
			onValue && onValue(v);

		} catch (err) {
			onError && onError(err);
		}
	}
}
