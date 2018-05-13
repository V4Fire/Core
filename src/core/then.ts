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
	 *
	 * @param [value] - if function, it will be executed
	 * @param [parent] - parent promise
	 */
	static immediate<V>(value?: ExecValue<V>, parent?: Then): Then<V> {
		return new Then((res, rej, onAbort) => {
			const id = setImmediate(() => {
				res(value && Object.isFunction(value) ? (<Function>value)() : value);
			});

			onAbort((err) => {
				clearImmediate(id);
				if (value instanceof Then) {
					value.abort(err);
				}
			});
		}, parent);
	}

	/**
	 * @see {Promise.resolve}
	 * @param value
	 * @param [parent] - parent promise
	 */
	static resolve<V>(value?: Value<V>, parent?: Then): Then<V> {
		if (value instanceof Then) {
			if (parent) {
				parent.catch((err) => {
					value.abort(err);
				});
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
	 * @see {Promise.reject}
	 * @param reason
	 * @param [parent] - parent promise
	 */
	static reject<V>(reason?: Value<V>, parent?: Then): Then {
		return new Then((res, rej) => rej(reason), parent);
	}

	/**
	 * @see {Promise.all}
	 * @param values
	 * @param [parent] - parent promise
	 */
	// @ts-ignore
	static all<T1, T2, T3>(values: [Value<T1>, Value<T2>, Value<T3>], parent?: Then): Then<[T1, T2, T3]>;
	static all<T1, T2>(values: [Value<T1>, Value<T2>], parent?: Then): Then<[T1, T2]>;
	static all<T>(values: Iterable<Value<T>>, parent?: Then): Then<T[]>;
	static all<T>(values: Iterable<Value<T>>, parent?: Then): Then<T[]> {
		return new Then((res, rej, onAbort) => {
			const
				promises = $C(values).map((el) => Then.resolve(el)),
				resolved = <any[]>[];

			onAbort((reason) => {
				$C(promises).forEach((el) => {
					el.abort(reason);
				});
			});

			let
				counter = 0;

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
		}, parent);
	}

	/**
	 * @see {Promise.race}
	 * @param values
	 * @param [parent] - parent promise
	 */
	static race<T>(values: Iterable<Value<T>>, parent?: Then): Then<T> {
		return new Then((res, rej, onAbort) => {
			const
				promises = $C(values).map<Then>((el) => Then.resolve(el));

			onAbort((reason) => {
				$C(promises).forEach((el) => {
					el.abort(reason);
				});
			});

			$C(promises).forEach((promise) => {
				promise.then(res, rej);
			});
		}, parent);
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
				const abortParent = this.onAbort = (err) => parent.abort(err);
				parent.catch((err) => this.abort(err));

				setOnAbort = (cb) => {
					this.onAbort = (r) => {
						abortParent(r);
						cb(r);
					};
				};

			} else {
				setOnAbort = (cb) => this.onAbort = cb;
			}

			if (this.isPending && (!parent || parent.state !== State.rejected)) {
				this.evaluate(executor, [resolve, reject, setOnAbort], reject);
			}
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

				this.abort(r);
			});

			this.promise.then(resolve, reject);
		});
	}

	/** @see {Promise.prototype.catch} */
	catch(onRejected?: ((reason: any) => Value<T>) | null | undefined): Then<T>;
	catch<TReason>(onRejected: (reason: any) => Value<TReason>): Then<TReason>;

	// tslint:disable-next-line
	catch(onRejected) {
		return new Then((res, rej) => {
			let
				reject;

			if (Object.isFunction(onRejected)) {
				reject = (r) => {
					this.evaluate(onRejected, [r], rej, res);
				};

			} else {
				reject = rej;
			}

			this.promise.then(res, reject);
		});
	}

	/**
	 * Aborts the current promise
	 * @param [reason] - abort reason
	 */
	abort(reason?: any): void {
		if (this.pendingChildren < 2) {
			this.evaluate(this.onAbort, [reason]);
			this.reject(reason);
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
