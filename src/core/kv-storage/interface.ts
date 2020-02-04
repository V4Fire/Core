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

export interface Namespace {
	/**
	 * Returns true if a value by the specified key exists in the storage
	 *
	 * @param key,
	 * @param [args]
	 */
	has(key: string, ...args: unknown[]): boolean;

	/**
	 * Returns a value from the storage by the specified key
	 *
	 * @param key
	 * @param [args]
	 */
	get<T = unknown>(key: string, ...args: unknown[]): CanUndef<T>;

	/**
	 * Saves a value to the storage by the specified key
	 *
	 * @param key
	 * @param value
	 * @param [args]
	 */
	set(key: string, value: unknown, ...args: unknown[]): void;

	/**
	 * Removes a value from the storage by the specified key
	 *
	 * @param key
	 * @param [args]
	 */
	remove(key: string, ...args: unknown[]): void;

	/**
	 * Clears the storage by the specified filter and returns a list of removed keys
	 *
	 * @param [filter] - filter for removing (if not specified, then all storage values will be removed)
	 * @param [args]
	 */
	clear<T = unknown>(filter?: ClearFilter<T>, ...args: unknown[]): void;
}

export interface FactoryResult extends Namespace {
	/**
	 * Returns a storage object by the specified namespace
	 * @param name
	 */
	namespace(name: string): Namespace;
}

export interface AsyncNamespace {
	/**
	 * Returns true if a value by the specified key exists in the storage
	 *
	 * @param key,
	 * @param [args]
	 */
	has(key: string, ...args: unknown[]): Promise<boolean>;

	/**
	 * Returns a value from the storage by the specified key
	 *
	 * @param key
	 * @param [args]
	 */
	get<T = unknown>(key: string, ...args: unknown[]): Promise<CanUndef<T>>;

	/**
	 * Saves a value to the storage by the specified key
	 *
	 * @param key
	 * @param value
	 * @param [args]
	 */
	set(key: string, value: unknown, ...args: unknown[]): Promise<void>;

	/**
	 * Removes a value from the storage by the specified key
	 *
	 * @param key
	 * @param [args]
	 */
	remove(key: string, ...args: unknown[]): Promise<void>;

	/**
	 * Clears the storage by the specified filter and returns a list of removed keys
	 *
	 * @param [filter] - filter for removing (if not specified, then all storage values will be removed)
	 * @param [args]
	 */
	clear<T = unknown>(filter?: ClearFilter<T>, ...args: unknown[]): Promise<void>;
}

export interface AsyncFactoryResult extends AsyncNamespace {
	namespace(name: string): AsyncNamespace;
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
