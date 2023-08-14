/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { Cache } from '../../../../core/cache';
export * from '../../../../core/kv-storage/engines/node-localstorage/interface';
export declare const syncLocalStorage: any, asyncLocalStorage: any, syncSessionStorage: Cache<unknown, string>, asyncSessionStorage: Cache<unknown, string>;
