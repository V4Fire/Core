/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * Returns a function to serialize object values into strings
 *
 * @param a - first object to serialize
 * @param b - second object to serialize
 * @param funcMap - map to store functions
 */
export declare function createSerializer(a: unknown, b: unknown, funcMap: WeakMap<Function, string>): JSONCb;
