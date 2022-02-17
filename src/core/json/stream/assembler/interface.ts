/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type AssembleKey = string | null;
export type AssembleValue = JSONLikeValue;

export interface AssembleReviver {
	(key: AssembleKey, value?: AssembleValue): AnyToIgnore;
}

export interface AssemblerOptions {
	numberAsString?: boolean;
	reviver?: AssembleReviver;
}
