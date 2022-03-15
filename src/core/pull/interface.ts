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
export type PullHook<T> = (value: T, pull: Pull<T>, ...args: unknown[]) => void;

export interface PullOptions<T> {
	/**
	 * Hook that are activated before `this.take` or `this.takeOrCreate`
	 *
	 * @param value - value that are return from `this.take`
	 * @param pull - this pull
	 * @param args - params in this.take(...args)
	 */
	onTake?: PullHook<T>;

	/**
	 * Hook that are activated before (free) function
	 *
	 * @param value - value from free(value)
	 * @param pull - this pull
	 * @param args - params that are given in free(value,...args)
	 */
	onFree?: PullHook<T>;

	/**
	 * Function that calculate hash of resource
	 *
	 * @param args - params passed to take or borrow or createOpts from constructor
	 */
	hashFn?(...args: unknown[]): string;

	/**
	 * Hook that called on 'this.clear'
	 *
	 * @param pull - this pull
	 * @param args - params given to `Pull.clear()`
	 */
	onClear?(pull: Pull<T>, ...args: unknown[]): void;

	/**
	 * Hook that destruct object
	 *
	 * @param resource - resource that will be destructed
	 */
	destructor?(resource: T): void;
}

export interface PullReturnType<T> {
	/**
	 * Return value back to pull
	 *
	 * @param val - value from pull
	 * @param args - additional params given to hook onFree
	 */
	free(val: T, ...args: any): void;

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
