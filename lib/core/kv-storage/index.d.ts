/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { SyncStorage, AsyncStorage, StorageEngine } from '../../core/kv-storage/interface';
export * from '../../core/kv-storage/interface';
/**
 * API for synchronous local storage
 *
 * @example
 * ```js
 * local.set('foo', 'bar');
 * local.get('foo'); // 'foo'
 * ```
 */
export declare const local: SyncStorage;
/**
 * API for asynchronous local storage
 *
 * @example
 * ```js
 * asyncLocal.set('foo', 'bar').then(async () => {
 *   console.log(await asyncLocal.get('foo')); // 'foo'
 * });
 * ```
 */
export declare const asyncLocal: AsyncStorage;
/**
 * API for synchronous session storage
 *
 * @example
 * ```js
 * session.set('foo', 'bar');
 * session.get('foo'); // 'foo'
 * ```
 */
export declare const session: SyncStorage;
/**
 * API for asynchronous session storage
 *
 * @example
 * ```js
 * asyncSession.set('foo', 'bar').then(async () => {
 *   console.log(await asyncSession.get('foo')); // 'foo'
 * });
 * ```
 */
export declare const asyncSession: AsyncStorage;
/**
 * Alias for a has method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */
export declare const has: any;
/**
 * Alias for a get method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */
export declare const get: any;
/**
 * Alias for a set method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */
export declare const set: any;
/**
 * Alias for a remove method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */
export declare const remove: any;
/**
 * Alias for a clear method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 */
export declare const clear: any;
/**
 * Alias for a namespace method of the synchronous local storage API
 *
 * @alias
 * @see [[local]]
 *
 * @example
 * ```js
 * const storage = namespace('REQUEST_STORAGE');
 * storage.set('foo', 'bar');
 * storage.get('foo'); // 'foo'
 * local.get('foo'); // undefined
 * ```
 */
export declare const namespace: any;
/**
 * Creates a new kv-storage API with the specified engine
 *
 * @param engine
 * @param async - if true, then the storage is implemented async interface
 *
 * @example
 * ```js
 * const storage = factory(window.localStorage);
 * storage.set('foo', 'bar');
 * storage.get('foo'); // 'foo'
 * ```
 */
export declare function factory(engine: StorageEngine, async: true): AsyncStorage;
export declare function factory(engine: StorageEngine, async?: false): SyncStorage;
