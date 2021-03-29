/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Cache from 'core/cache/interface';

abstract class AbstractPersistentEngine<V = unknown> {
	abstract initCache?(cache: Cache<V>): CanPromise<void>;
	abstract getTTL(key: string): CanPromise<number | undefined>;
	abstract set(key: string, value: V, ttl?: number): CanPromise<void>;
	abstract remove(key: string): CanPromise<void>;
}

export abstract class AvailableToCheckInStorageEngine<V = unknown> extends AbstractPersistentEngine<V> {
	abstract get<T = unknown>(key: string): CanPromise<T | undefined>;
	abstract isNeedToCheckInStorage(method: 'get' | 'has', key: string): CanPromise<boolean>;
}

export abstract class UnavailableToCheckInStorageEngine<V = unknown> extends AbstractPersistentEngine<V> {
	abstract isNeedToCheckInStorage(method: 'get' | 'has', key: string): CanPromise<false>;
}

export type PersistentEngine<V = unknown> = AvailableToCheckInStorageEngine<V> | UnavailableToCheckInStorageEngine<V>;

