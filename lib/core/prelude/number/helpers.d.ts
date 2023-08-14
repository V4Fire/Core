/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * Factory to create rounding methods
 * @param method
 */
export declare function createRoundingFunction(method: AnyFunction): AnyFunction;
/**
 * Factory to create static rounding methods
 * @param method
 */
export declare function createStaticRoundingFunction(method: string): AnyFunction;
/**
 * Returns a descriptor for a getter that returns a string with attaching the specified type
 * @param type
 */
export declare function createStringTypeGetter(type: string): PropertyDescriptor;
/**
 * Factory for functions that converts milliseconds by the specified offset
 * @param offset
 */
export declare function createMsFunction(offset: number): AnyFunction;
/**
 * Factory for static functions that converts milliseconds by the specified offset
 * @param offset
 */
export declare function createStaticMsFunction(offset: number): AnyFunction;
/**
 * Repeats a string with the specified number of repetitions and returns a new string
 *
 * @param str
 * @param num
 */
export declare function repeatString(str: string, num: number): string;
