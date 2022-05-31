/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Any primitive JS value
 */
type Primitive =
	string |
	symbol |
	number |
	bigint |
	boolean |
	undefined |
	null;

/**
 * Unsafe alias for `any`.
 * You can use it when you never touch a value, but convert it to boolean.
 */
type AnyToBoolean = any;

/**
 * Any valid JSON value
 */
type JSONLikeValue =
	string |
	number |
	boolean |
	null |
	JSONLikeValue[] |
	Dictionary<JSONLikeValue>;

/**
 * Alias for any `JSON.parse/stringify` callbacks
 */
interface JSONCb {
	(key: string, value: unknown): unknown;
}
