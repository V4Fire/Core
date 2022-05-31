/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Simple dictionary when a value by the passed key can be uninitialized
 *
 * @example
 * ```typescript
 * const dict: Dictionary<string> = {};
 *
 * // @ts-expect-error
 * console.log(dict['key'].slice(0, 10));
 * ```
 */
interface Dictionary<T = unknown> {
	[key: PropertyKey]: CanUndef<T>;
}

/**
 * Dictionary where all contained properties are strictly initialized
 *
 * @example
 * ```typescript
 * const dict: Dictionary<string> = {};
 *
 * // TS expects that a value by the passed key is existed
 * console.log(dict['key'].slice(0, 10));
 * ```
 */
interface StrictDictionary<T = unknown> {
	[key: PropertyKey]: T;
}

/**
 * Extracts a value type of the passed dictionary
 *
 * @example
 * ```typescript
 * const dict: Dictionary<string> = {};
 * const val: DictionaryType<typeof dict> = 'foo';
 * ```
 */
type DictionaryType<T extends Dictionary> = T extends Dictionary<infer V> ? NonNullable<V> : T;
