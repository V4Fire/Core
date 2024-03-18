/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { parserStateTypes } from '../../../../core/json/stream/parser/const';
export declare type ParserState = typeof parserStateTypes[keyof typeof parserStateTypes];
export declare type ParentParserState = typeof parserStateTypes.OBJECT | typeof parserStateTypes.ARRAY | typeof parserStateTypes.EMPTY;
export declare type TokenName = '' | 'startObject' | 'endObject' | 'startArray' | 'endArray' | 'startKey' | 'stringChunk' | 'endKey' | 'keyValue' | 'startString' | 'endString' | 'stringValue' | 'startNumber' | 'numberChunk' | 'numberValue' | 'endNumber' | 'nullValue' | 'trueValue' | 'falseValue';
export declare type TokenValue = string | boolean | number | null;
export interface Token {
    name: TokenName;
    value?: TokenValue;
}
export interface TokenProcessorFn<T> {
    (token: Token): Generator<T>;
}
export interface TokenProcessor<T> {
    processToken: TokenProcessorFn<T>;
    finishTokenProcessing?(): Generator<T>;
}
