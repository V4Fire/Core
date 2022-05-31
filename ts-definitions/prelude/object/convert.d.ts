/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface ObjectConstructor {
	/**
	 * Returns a curried version of `Object.serialize`
	 * @param replacer - replacer function to serialize
	 */
	trySerialize(replacer?: JSONCb): <V>(value: V) => string | V;

	/**
	 * Tries to serialize the specified value into a string.
	 *
	 * If the value is an array, dictionary, or string or has the predefined `toJSON` method, it is serialized using
	 * `JSON.stringify`. In other cases, the value isn't serialized and will be returned by the function.
	 * Also, in the case of error during serialization, the function returns the original value.
	 *
	 * @param value
	 * @param [replacer] - replacer function to serialize
	 */
	trySerialize<V>(value: V, replacer?: JSONCb): string | V;

	/**
	 * Returns a curried version of `Object.parse`
	 * @param reviver - reviver function to parse
	 */
	parse(reviver?: JSONCb): <V, R = unknown>(value: V) => V extends string ? R : V;

	/**
	 * Parses the specified value as a JSON/JS object and returns the result of parsing.
	 * If the value isn't a string or can't be parsed, the function returns the original value.
	 *
	 * @param value
	 * @param [reviver] - reviver function to parse
	 */
	parse<V, R = unknown>(value: V, reviver?: JSONCb): V extends string ? R : V;
}
