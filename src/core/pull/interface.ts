/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Pull from 'core/pull/index';

/**
 * Interface for hooks like onTake and onFree
 */
export type hook<T> = (value: T, pull: Pull<T>, args: unknown[]) => void;

export interface Options<T> {
	/**
	 * Hook that are activated before this.take or this.takeOrCreate
	 *
	 * @param value - value that are return from this.take
	 * @param pull - this pull
	 * @param args - params in this.take(...args)
	 */
	// eslint-disable-next-line @typescript-eslint/method-signature-style
	onTake?: (value: T, pull: Pull<T>, args: any) => void;

	/**
	 * Hook that are activated before (free) function
	 *
	 * @param value - value from free(value)
	 * @param pull - this pull
	 * @param args - params that are given in free(value,...args)
	 */
	// eslint-disable-next-line @typescript-eslint/method-signature-style
	onFree?: (value: T, pull: Pull<T>, args: any) => void;

	/**
	 * Function that calculate hash of resource
	 *
	 * @param args - params passed to take or borrow or createOpts from constructor
	 */
	// eslint-disable-next-line @typescript-eslint/method-signature-style
	hashFn?: (...args: unknown[]) => string;

	/**
	 * Hook that called on this.clear
	 *
	 * @param pull - this pull
	 * @param args - params given to Pull.clear()
	 */
	// eslint-disable-next-line @typescript-eslint/method-signature-style
	onClear?: (pull: Pull<T>, ...args: unknown[]) => void;

	/**
	 * Hook that destruct object
	 *
	 * @param resource - resource that will be destructed
	 */
	// eslint-disable-next-line @typescript-eslint/method-signature-style
	destructor?: (resource: T) => void;
}

export interface ReturnType<T> {
	/**
	 * Return value back to pull
	 *
	 * @param val - value from pull
	 * @param args - additional params given to hook onFree
	 */
	free(val: T, args: any): void;

	/**
	 * Value from pull
	 */
	value: T;

	/**
	 * Function to destruct value instead of returning it to pull
	 *
	 * @param resource - value from pull
	 */
	destroy(resource: T): void;
}
