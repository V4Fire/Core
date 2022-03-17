/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Pull from 'core/pull/index';

/**
 * Interface for hooks like `onTake` and `onFree`
 */
export type PullHook<T> = (value: T, pull: Pull<T>, ...args: unknown[]) => void;

export interface PullOptions<T> {
	/**
	 * Hook that is executed before `this.take` or `this.takeOrCreate`
	 *
	 * @param value - value that are return from `this.take`
	 * @param pull - this pull
	 * @param args - params in `this.take(...args)`
	 */
	onTake?: PullHook<T>;

	/**
	 * Hook that is executed before `free` function
	 *
	 * @param value - value from `free(value)`
	 * @param pull - this pull
	 * @param args - params that are given in `free(value,...args)`
	 */
	onFree?: PullHook<T>;

	/**
	 * Function that calculate hash of resource
	 *
	 * @param args - params passed to objectFactory
	 */
	hashFn?(...args: unknown[]): string;

	/**
	 * Hook that is called on 'this.clear'
	 *
	 * @param pull - this pull
	 * @param args - params given to `Pull.clear()`
	 */
	onClear?(pull: Pull<T>, ...args: unknown[]): void;

	/**
	 * Hook that destructs object
	 *
	 * @param resource - resource that will be destructed
	 */
	destructor?(resource: T): void;
}

export interface PullResource<T> {
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
	 * Function that destruct value instead of returning it to pull
	 *
	 * @param resource - value from pull
	 */
	destroy(resource: T): void;
}
