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
 * Parses the buffer for the first digit `[0-9]` in a numeric expression and
 * generates a token `numberChunk` with a digit value
 */
export declare function numberExpStart(this: Parser): Generator<Token>;
