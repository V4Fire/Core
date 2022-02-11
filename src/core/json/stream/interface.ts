/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { parserStateTypes } from 'core/json/stream/const';

export interface JsonToken {
	name: string;
	value?: string | boolean | number | null;
}

export type ParserState = typeof parserStateTypes[keyof typeof parserStateTypes];

export type ParentParserState =
	typeof parserStateTypes.OBJECT |
	typeof parserStateTypes.ARRAY |
	typeof parserStateTypes.EMPTY;

export interface AssemblerOptions {
	numberAsString?: boolean;
	reviver?(key: string, value?: AssemblerItem): any;
}

export type AssemblerItem = JSONLikeValue;
export type AssemblerKey = string | null;

export interface FilterBaseOptions {
	multiple?: boolean;
	filter?: RegExp | string | ((stack: FilterStack, chunk: JsonToken) => boolean);
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
