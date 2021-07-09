/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface ClearFilter<T = unknown> {
	(el: T, key: string): unknown;
}

export interface SyncStorageNamespace {
	/**
	 * Returns true if a value by the specified key exists in the storage.
	 * Notice, the method can take a list of additional parameters provided to the used storage' engine.
	 *
	 * @param key,
	 * @param [args]
	 */
	has(key: string, ...args: unknown[]): boolean;

	/**
	 * Returns a value from the storage by the specified key.
	 *
	 * The returning value automatically parses by using `Object.parse` from a string to equivalent JS value, i.e.,
	 * `'1'` will be parsed to `1`, `'true'` to `true`, `'2021-07-09T08:15:57.753Z'` to `Date`, etc.
	 *
	 * Notice, the method can take a list of additional parameters provided to the used storage' engine.
	 *
	 * @param key
	 * @param [args]
	 */
	get<T = unknown>(key: string, ...args: unknown[]): CanUndef<T>;

	/**
	 * Saves a value to the storage by the specified key.
	 *
	 * The value to parse automatically serializes to a string by using `Object.trySerialize`, i.e.,
	 * arrays and dictionaries will be serialized to JSON, etc.
	 *
	 * Notice, the method can take a list of additional parameters provided to the used storage' engine.
	 *
	 * @param key
	 * @param value
	 * @param [args]
	 */
	set(key: string, value: unknown, ...args: unknown[]): void;

	/**
	 * Removes a value from the storage by the specified key.
	 * Notice, the method can take a list of additional parameters provided to the used storage' engine.
	 *
	 * @param key
	 * @param [args]
	 */
	remove(key: string, ...args: unknown[]): void;

	/**
	 * Clears the storage by the specified filter and returns a list of removed keys.
	 * Notice, the method can take a list of additional parameters provided to the used storage' engine.
	 *
	 * @param [filter] - filter for removing (if not specified, then all storage values will be removed)
	 * @param [args]
	 */
	clear<T = unknown>(filter?: ClearFilter<T>, ...args: unknown[]): void;
}

/**
 * API for a synchronous storage
 */
export interface SyncStorage extends SyncStorageNamespace {
	/**
	 * Returns a storage object by the specified namespace
	 * @param name
	 */
	namespace(name: string): SyncStorageNamespace;
}

export type AsyncStorageNamespace = {
	[key in Exclude<keyof SyncStorageNamespace, 'get' | 'clear'>]: ReturnPromise<SyncStorageNamespace[key]>;
} & {
	get<T = unknown>(key: string, ...args: unknown[]): Promise<CanUndef<T>>;
	clear<T = unknown>(filter?: ClearFilter<T>, ...args: unknown[]): Promise<void>;
};

/**
 * API for an asynchronous storage
 */
export interface AsyncStorage extends AsyncStorageNamespace {
	/**
	 * Returns an async storage object by the specified namespace
	 * @param name
	 */
	namespace(name: string): AsyncStorageNamespace;
}

/**
 * KV-storage engine
 */
export interface StorageEngine {
	get?(key: unknown): unknown;
	getItem?(key: unknown): unknown;
	set?(key: unknown, value: unknown): unknown;
	setItem?(key: unknown, value: unknown): unknown;
	remove?(key: unknown): unknown;
	removeItem?(key: unknown): unknown;
	delete?(key: unknown): unknown;
	exist?(key: unknown): unknown;
	exists?(key: unknown): unknown;
	includes?(key: unknown): unknown;
	has?(key: unknown): unknown;
	keys?(): Iterable<unknown>;
	clear?(): unknown;
	clearAll?(): unknown;
	truncate?(): unknown;
}
