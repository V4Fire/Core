/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export declare const isAbsURL: RegExp, isStrictAbsURL: RegExp;
export declare const startSlashesRgxp: RegExp, endSlashesRgxp: RegExp;
/**
 * Default function to filter query parameters to serialize with the `toQueryString` method
 * @param value
 */
export declare function defaultToQueryStringParamsFilter(value: unknown): boolean;
