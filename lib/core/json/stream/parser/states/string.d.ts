/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type Parser from '../../../../../core/json/stream/parser';
import type { Token } from '../../../../../core/json/stream/parser/interface';
/**
 * Parses the buffer for the end of a key or string and generates a sequence of tokens
 * `endKey`, `keyValue` for a key or `endString`, `stringValue` and `stringChunk` for a string
 */
export declare function string(this: Parser): Generator<Token>;
