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
 * Parses the buffer for an exponent symbol `[eE]?` and generates a token `numberChunk` with a symbol value
 */
export declare function numberExponent(this: Parser): Generator<Token>;
