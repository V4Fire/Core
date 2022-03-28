/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Pool from 'core/pool';
import { hashVal, borrowCounter } from 'core/pool/const';

export type Resource<T> = T & {
	[hashVal]: string;
	[borrowCounter]: number;
};

export interface WrappedResource<T = unknown> {
	/**
	 * Value from the pool
	 */
	value: T;

	/**
	 * Returns the resource to the pool
	 * @param args - extra arguments to pass to the `onFree` hook handler
	 */
	free(...args: unknown[]): void;

	/**
	 * Destroys the resource instead of returning it to the pool
	 */
	destroy(): void;
}

export interface OptionalWrappedResource<T> extends WrappedResource<Nullable<T>> {}

export interface PoolOptions<T = unknown> {
	/**
	 * Number of resources to create at pull initialization
	 */
	size?: number;

	/**
	 * The maximum number of resources that the pool can contain
	 */
	maxSize?: number;

	/**
	 * A function to destroy one resource from the pool
	 */
	resourceDestructor?: ResourceDestructor<T>;

	/**
	 * A function to calculate a hash string for the specified arguments
	 */
	hashFn?: HashFn;

	/**
	 * Handler: taking some resource via `take` methods
	 */
	onTake?: ResourceHook<T>;

	/**
	 * Handler: taking some resource via `borrow` methods
	 */
	onBorrow?: ResourceHook<T>;

	/**
	 * Handler: releasing of some resource
	 */
	onFree?: ResourceHook<T>;

	/**
	 * Handler: clearing of all pool resources
	 */
	onClear?: PoolHook<T>;
}

export interface HashFn {
	(...args: unknown[]): string;
}

export interface ResourceFactory<T = unknown> {
	(...args: unknown[]): T;
}

export interface ResourceDestructor<T = unknown> {
	(resource: T): void;
}

export interface ResourceHook<T = unknown> {
	(value: T, pool: Pool<T>, ...args: unknown[]): void;
}

export interface PoolHook<T = unknown> {
	(pool: Pool<T>, ...args: unknown[]): void;
}
