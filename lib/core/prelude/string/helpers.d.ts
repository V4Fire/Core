/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * Returns true, if the specified character is declared in upper case
 * @param char
 */
export declare function isCharUpper(char: string): boolean;
/**
 * Transforms a string to an underscore style
 *
 * @param str
 * @param start
 * @param end
 * @param middle
 */
export declare function toUnderscore(str: string, start: CanUndef<string>, end: CanUndef<string>, middle: CanUndef<string>): string;
/**
 * Transforms a string to a camelize style
 *
 * @param str
 * @param start
 * @param end
 * @param middle
 */
export declare function toCamelize(str: string, start: CanUndef<string>, end: CanUndef<string>, middle: CanUndef<string>): string;
/**
 * Transforms a string to a dasherize style
 *
 * @param str
 * @param start
 * @param end
 * @param middle
 */
export declare function toDasherize(str: string, start: CanUndef<string>, end: CanUndef<string>, middle: CanUndef<string>): string;
/**
 * Converts the specified string to a string that logically split by a separator
 *
 * @param str
 * @param separator
 * @param stable
 */
export declare function convertToSeparatedStr(str: string, separator: string, stable?: boolean): string;
/**
 * Factory to create static string transform methods
 * @param method
 */
export declare function createStaticTransformFunction(method: string): AnyFunction;
