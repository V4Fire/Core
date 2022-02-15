/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type AssemblerItem = JSONLikeValue;
export type AssemblerKey = string | null;

export interface AssemblerOptions {
	numberAsString?: boolean;
	reviver?(key: AssemblerKey, value?: AssemblerItem): any;
}

export interface StreamedArray {
	key: number;
	value: any;
}

export interface StreamedObject {
	key: string;
	value: any;
}
