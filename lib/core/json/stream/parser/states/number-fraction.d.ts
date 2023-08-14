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
 * Parses the buffer for a numeric fraction symbol `[\.eE]?` and generates a token `numberChunk` with a fraction symbol
 */
export declare function numberFraction(this: Parser): Generator<Token>;
