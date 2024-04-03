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
 * Parses the buffer for a colon and sets the expected element to a parser expect value
 */
export declare function colon(this: Parser): Generator<Token>;
