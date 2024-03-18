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
 * Parse the buffer for the first digit in a number fraction `[0-9]`
 * and generates a token `numberChunk` with a fraction value
 */
export declare function numberFractionStart(this: Parser): Generator<Token>;
