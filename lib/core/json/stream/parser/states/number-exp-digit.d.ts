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
 * Parses the buffer for a digit expression `[0-9]*` and generates a token `numberChunk` with a number value
 */
export declare function numberExpDigit(this: Parser): Generator<Token>;
