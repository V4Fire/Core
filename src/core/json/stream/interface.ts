/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { parserStateTypes } from 'core/json/stream/const';

export type ParserState = typeof parserStateTypes[
	keyof typeof parserStateTypes
];

export type ParentParserState =
	typeof parserStateTypes.OBJECT |
	typeof parserStateTypes.ARRAY |
	typeof parserStateTypes.EMPTY;

export type TokenName =
	'' |
	'startObject' |
	'endObject' |
	'startArray' |
	'endArray' |
	'startKey' |
	'stringChunk' |
	'endKey' |
	'keyValue' |
	'startString' |
	'endString' |
	'stringValue' |
	'startNumber' |
	'numberChunk' |
	'numberValue' |
	'endNumber' |
	'nullValue' |
	'trueValue' |
	'falseValue';

export type TokenValue =
	string |
	boolean |
	number |
	null;

export interface Token {
	name: TokenName;
	value?: TokenValue;
}

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
