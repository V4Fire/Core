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
 * Parses the buffer for the end of the current structure (an object or array) and
 * generates tokens `endObject` or `endArray`
 */
export declare function stop(this: Parser): Generator<Token>;
