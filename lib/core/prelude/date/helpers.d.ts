/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * Factory to create functions to modify date values
 * @param mod
 */
export declare function createDateModifier(mod?: (val: number, base: number) => number): AnyFunction;
/**
 * Factory to create static functions to modify date values
 * @param method
 */
export declare function createStaticDateModifier(method: string): AnyFunction;
/**
 * Factory to create static functions to compare date values
 * @param method
 */
export declare function createStaticDateComparator(method: string): AnyFunction;
/**
 * Factory to create static functions to format date values
 * @param method
 */
export declare function createStaticDateFormatter(method: string): AnyFunction;
