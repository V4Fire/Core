/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PARSER_STATE } from 'core/json/stream/const';

export interface JsonToken {
	name: string;
	value?: string | boolean | number | null;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TPARSER_STATE = typeof PARSER_STATE[keyof typeof PARSER_STATE];
export type PARENT_STATE = typeof PARSER_STATE.OBJECT | typeof PARSER_STATE.ARRAY | typeof PARSER_STATE.EMPTY;

export interface AssemblerOptions {
	numberAsString?: boolean;
	reviver?(key: string, value?: AssemblerItem): any;
}

export type AssemblerItem = string | number | boolean | AssemblerItem[] | Dictionary<AssemblerItem> | null;
export type AssemblerKey = string | null;

export interface FilterBaseOptions {
	multiple?: boolean;
	filter?: ((stack: FilterStack, chunk: JsonToken) => boolean) | RegExp | string;
}

export type FilterStack = Array<JsonToken['value'] | null>;

export type ProcessFunction = (chunk: JsonToken) => Generator<JsonToken>;

export interface StreamedArray {
	key: number;
	value: any;
}

export interface StreamedObject {
	key: string;
	value: any;
}
