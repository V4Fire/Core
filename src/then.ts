import $C = require('collection.js');

export type Value<T> = T | PromiseLike<T>;
export interface onAbort {
	(reason: any): void;
}

export interface Executor<T> {
	(
		resolve?: (value?: Value<T>) => void,
		reject?: (reason?: any) => void,
		onAbort?: (cb: onAbort) => void
	): void;
}

export const enum State {
	pending,
	fulfilled,
	rejected
}

export default class Then<T> {
	/**
	 * Промис который никогда не зарезолвится
	 */
	static readonly never: Promise<any> = new Promise(() => {});

	/**
	 * Выполняет заданную функцию с указанными аргументами
	 *
	 * @param fn
	 * @param args
	 * @param [onError] - обработчик ошибки
	 * @param [onValue] - обработчик успешной операции
	 */
	protected static evaluate<T, V>(
		fn: (...args: T[]) => V,
		args: T[] = [],
		onError?: (r: any) => void,
		onValue?: (v: V) => void
	): void {
		try {
			const value = fn(...args);
			onValue && onValue(value);

		} catch (err) {
			onError && onError(err);
		}
	}

	/**
	 * Возвращает true если заданное значение является PromiseLike
	 * @param obj
	 */
	static isThenable(obj: any): obj is PromiseLike<any> {
		return Boolean(obj) && Object.isFunction(obj.then) && Object.isFunction(obj.catch);
	}

	/**
	 * Оборачивает заданное значение в Then
	 * @param value
	 */
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

	/**
	 * Оборачивает заданное значение в Then, который зарезолвиться по setImmediate
	 * @param [value]
	 */
	static immediate<V>(value?: Value<V>): Then<V> {
		return new Then((res, rej, onAbort) => {
			const
				id = setImmediate(() => res(value));

			onAbort((r) => {
				clearImmediate(id);

				if (value instanceof Then) {
					value.bubblingAbort(r);
				}
			});
		});
	}

	/** @see {Promise.all} */
	static all<T1, T2, T3>(values: [Value<T1>, Value<T2>, Value<T3>]): Then<[T1, T2, T3]>;
	static all<T1, T2>(values: [Value<T1>, Value<T2>]): Then<[T1, T2]>;
	static all<T>(values: Array<Value<T>>): Then<T[]>;
	static all(values) {
		values = $C(values).map(Then.resolve);

		return new Then((res, rej, onAbort) => {
			let counter = 0;

			const
				resolved = [];

			$C(values).forEach((promise, i) => {
				promise.then(
					(val) => {
						resolved[i] = val;

						if (++counter === values.length) {
							res(resolved);
						}
					},

					rej
				);
			});

			onAbort((reason) => {
				$C(values).forEach((val: Then<any>) => {
					val.bubblingAbort(reason);
				});
			});
		});
	}

	protected pendingChildren: number = 0;

	protected state: State = State.pending;

	protected promise: Promise<T>;

	protected resolve: (value?: Value<T>) => void;

	protected onAbort: onAbort;

	constructor(executor: Executor<T>, parent?: Then<any>) {
		this.promise = new Promise((res, rej) => {
			const resolve = (v) => {
				if (!this.isPending()) {
					return;
				}

				this.state = State.fulfilled;
				res(v);
			};

			const reject = (v) => {
				if (!this.isPending()) {
					return;
				}

				this.state = State.rejected;
				rej(v);
			};

			this.resolve = resolve;

			let
				setOnAbort;

			if (parent) {
				const ap = (r) => {
					parent.bubblingAbort(r);
				};

				this.onAbort = ap;
				setOnAbort = (cb) => {
					this.onAbort = (r) => {
						ap(r);
						cb(r);
					};
				};

			} else {
				setOnAbort = (cb) => {
					this.onAbort = cb;
				};
			}

			Then.evaluate(executor, [resolve, reject, setOnAbort], reject);
		});
	}

	/**
	 * Отменяет исходный запрос:
	 * если .pendingChildren > 1 то запрос физически не отменяется
	 *
	 * @param [reason] - причина отмены
	 */
	protected bubblingAbort(reason: any): void {
		if (this.pendingChildren < 2) {
			this.abort(reason);
		}

		this.pendingChildren--;
	}

	/**
	 * Вернет true если промис обрабатывается
	 */
	isPending(): boolean {
		return this.state === State.pending;
	}

	/** @see {Promise.prototype.then} */
	then(
		onFulfilled?: ((value: T) => Value<T>) | null | undefined,
		onRejected?: ((reason: any) => Value<T>) | null | undefined,
		abortCb?: onAbort | null | undefined
	): Then<T>;

	then<TReason>(
		onFulfilled: ((value: T) => Value<T>) | null | undefined,
		onRejected: (reason: any) => Value<TReason>,
		abortCb?: onAbort | null | undefined
	): Then<T | TReason>;

	then<TValue>(
		onFulfilled: (value: T) => Value<TValue>,
		onRejected?: ((reason: any) => Value<TValue>) | null | undefined,
		abortCb?: onAbort | null | undefined
	): Then<TValue>;

	then<TValue, TReason>(
		onFulfilled: (value: T) => Value<TValue>,
		onRejected: (reason: any) => Value<TReason>,
		abortCb?: onAbort | null | undefined
	): Then<TValue | TReason>;

	then(onFulfilled, onRejected, abortCb) {
		this.pendingChildren++;

		return new Then((res, rej, onAbort) => {
			let
				resolve,
				reject;

			if (Object.isFunction(onFulfilled)) {
				resolve = (v) => {
					Then.evaluate(onFulfilled, [v], rej, res);
				};

			} else {
				resolve = res;
			}

			if (Object.isFunction(onRejected)) {
				reject = (r) => {
					Then.evaluate(onRejected, [r], rej, res);
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
	catch(onRejected) {
		return this.then(null, onRejected);
	}

	/**
	 * Отменяет исходный запрос
	 * @param [reason] - причина отмены
	 */
	abort(reason: any = null): void {
		if (this.isPending()) {
			setImmediate(() => {
				Then.evaluate(this.onAbort, [reason]);
				this.resolve(Then.never);
			});
		}
	}
}
