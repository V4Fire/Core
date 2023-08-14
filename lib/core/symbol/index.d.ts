/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * Returns a factory for flexible creation of unique symbols by the first touch
 * @param fields - list of predefined fields (it can be useful to shim the Proxy API)
 */
export default function generator(fields?: string[]): StrictDictionary<symbol>;
