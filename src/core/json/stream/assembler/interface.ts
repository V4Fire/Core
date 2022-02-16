/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type AssembleItem = JSONLikeValue;
export type AssembleKey = string | null;

export interface AssembleReviver {
	(key: AssembleKey, value?: AssembleItem): AnyToIgnore;
}

export interface AssemblerOptions {
	numberAsString?: boolean;
	reviver?: AssembleReviver;
}
