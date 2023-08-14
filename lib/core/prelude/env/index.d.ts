/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export * from '../../../core/prelude/env/const';
/**
 * Returns settings from the application environment by the specified key
 * @param key
 */
export declare function get(key: string): Promise<CanUndef<Dictionary>>;
/**
 * Added settings to the application environment by the specified key
 *
 * @param key
 * @param value
 */
export declare function set(key: string, value: Dictionary): void;
/**
 * Removes settings from the application environment by the specified key
 * @param key
 */
export declare function remove(key: string): void;
