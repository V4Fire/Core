/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export declare type Operation = '>' | '>=' | '<' | '<=' | '==' | '~=' | '^=';
export declare type Strategy = 'eq' | 'range' | 'ord';
export interface ComparisonOptions {
    x: string;
}
