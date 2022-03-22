/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Pull from 'core/pull/index';
import { hashProperty, viewerCount } from 'core/pull/index';

/**
 * Interface for hooks like `onTake` and `onFree`
 *
 * @param value - value passed to function
 * @param pull - this pull
 * @param args - arguments passed to function
 */
export type PullHook<T> = (value: T, pull: Pull<T>, ...args: unknown[]) => void;

/**
 * Hook that is executed before `this.take` or `this.takeOrCreate`
 *
 * @param value - value that are return from `this.take`
 * @param pull - this pull
 * @param args - params in `this.take(...args)`
 */
export type PullOnTake<T> = PullHook<T>;

/**
 * Handler: releasing of some resource
 *
 * @param value - value from `free(value)`
 * @param pull - this pull
 * @param args - params that are given in `free(value,...args)`
 */
export type PullOnFree<T> = PullHook<T>;

/**
 * Returns a hash value for the specified arguments
 *
 * @param args - arguments passed to `objectFactory`
 */
export type PullHashFn = (...args: unknown[]) => string;

/**
 * Handler: clearing of pull' resources
 *
 * @param pull - this pull
 * @param args - args in `this.clear(...args)`
 */
export type PullOnClear<T> = (pull: Pull<T>, ...args: unknown[]) => void;

/**
 * Object destructor
 *
 * @param resource - resource that will be destructed
 */
export type PullDestructor<T> = (resource: T) => void;

export interface PullOptions<T> {
	/**
	 * Handler: releasing of some resource
	 */
	onFree?: PullOnFree<T>;

	/**
	 * Handler: taking some resource via `take` or `takeOrCreate` methods
	 */
	onTake?: PullOnTake<T>;

	/**
	 * Returns a hash value for the specified arguments
	 */
	hashFn?: PullHashFn;

	/**
	 * Handler: clearing of pull' resources
	 */
	onClear?: PullOnClear<T>;

	/**
	 * Object destructor
	 */
	destructor?: PullDestructor<T>;
}

export interface PullReturnedResource<T> {
	/**
	 * Return value back to pull
	 *
	 * @param args - additional params given to hook onFree
	 */
	free(...args: any): void;

	/**
	 * Value from pull
	 */
	value: T;

	/**
	 * Function that destruct value instead of returning it to pull
	 */
	destroy(): void;
}

export type PullResource<T> = { [hashProperty]: string; [viewerCount]: number } & T;

export interface NullablePullResource<T> extends PullReturnedResource<Nullable<T>> {
}
