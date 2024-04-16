/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { Token } from '../../../core/json/stream/parser';
import { AssemblerOptions } from '../../../core/json/stream/assembler';
import { FilterOptions, TokenFilter } from '../../../core/json/stream/filters';
import { StreamedArray, StreamedObject } from '../../../core/json/stream/streamers';
import type { AndPickOptions } from '../../../core/json/stream/interface';
export * from '../../../core/json/stream/interface';
/**
 * Parses the specified iterable object as a JSON stream and yields tokens via a Generator
 * @param source
 */
export declare function from(source: AnyIterable<string>): AsyncGenerator<Token>;
/**
 * Takes the specified iterable object of tokens and filters it via the specified filter
 *
 * @param source
 * @param filter
 */
export declare function filter(source: AnyIterable<Token>, filter: TokenFilter): AsyncGenerator<Token>;
/**
 * Takes the specified iterable object of tokens and picks from it a value that matches the specified selector
 *
 * @param source
 * @param selector
 * @param [opts] - additional filter options
 */
export declare function pick(source: AnyIterable<Token>, selector: TokenFilter, opts?: FilterOptions): AsyncGenerator<Token>;
/**
 * Takes the specified iterable object of tokens that has already been `pick` or `pickAnd` applied to,
 * and picks from it a value that matches the specified selector.
 * Use this function when you need to combine two or more Pick-s from a one token stream.
 *
 * @param source
 * @param selector
 * @param opts
 *
 * @example
 * ```js
 * const tokens = intoIter(from(JSON.stringify({
 *   total: 3,
 *   data: [
 *     {user: 'Bob', age: 21},
 *     {user: 'Ben', age: 24},
 *     {user: 'Rob', age: 28}
 *   ]
 * })));
 *
 * const seq = seq(
 *   assemble(pick(tokens, 'total')),
 *   streamArray(andPick(tokens, 'data'))
 * );
 *
 * for await (const val of seq) {
 *   console.log(val);
 * }
 * ```
 */
export declare function andPick(source: AnyIterable<Token>, selector: TokenFilter, opts?: AndPickOptions): AsyncGenerator<Token>;
/**
 * Takes the specified iterable object of tokens and yields an assembled item from it
 *
 * @param source
 * @param [opts] - additional options
 */
export declare function assemble<T = unknown>(source: AnyIterable<Token>, opts?: AssemblerOptions): AsyncGenerator<T>;
/**
 * Takes the specified iterable object of tokens representing an array and yields assembled array items
 *
 * @param source
 * @param [opts] - additional options
 */
export declare function streamArray<T = unknown>(source: AnyIterable<Token>, opts?: AssemblerOptions): AsyncGenerator<StreamedArray<T>>;
/**
 * Takes the specified iterable object of tokens representing an object and yields assembled object items
 *
 * @param source
 * @param [opts] - additional options
 */
export declare function streamObject<T = unknown>(source: AnyIterable<Token>, opts?: AssemblerOptions): AsyncGenerator<StreamedObject<T>>;
