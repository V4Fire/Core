/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { ParserState, ParentParserState, Token, TokenProcessor } from '../../../../core/json/stream/parser/interface';
export * from '../../../../core/json/stream/parser/const';
export * from '../../../../core/json/stream/parser/interface';
export default class Parser {
    /**
     * Parses the specified iterable object as a JSON stream and yields tokens via a Generator
     * @param source
     */
    static from(source: AnyIterable<string>): AsyncGenerator<Token>;
    /**
     * Parses the specified iterable object as a JSON stream and yields tokens or values via a Generator
     *
     * @param source
     * @param [processors] - list of token processors to apply to the output iterable
     */
    static from<T extends Array<TokenProcessor<any>>>(source: Iterable<string> | AsyncIterable<string>, ...processors: T): T extends [TokenProcessor<infer R>] ? AsyncGenerator<R> : T extends [...infer A, TokenProcessor<infer R>] ? AsyncGenerator<R> : unknown;
    /**
     * The current parent of a parsed structure
     */
    protected parent: ParentParserState;
    /**
     * An array of parent objects for the current parsed structure
     */
    protected readonly stack: ParentParserState[];
    /**
     * The current piece of JSON
     */
    protected buffer: string;
    /**
     * Accumulator for the current parsed structure
     */
    protected accumulator: string;
    /**
     * The current parsed value
     */
    protected value?: string;
    /**
     * The current index in a buffer parsing process
     */
    protected index: number;
    /**
     * The current match value after RegExp execution
     */
    protected matched?: RegExpExecArray | null;
    /**
     * The next expected parser state from a stream
     */
    protected expected: ParserState;
    /**
     * Dictionary with RegExp-s to different types of data
     */
    protected patterns: Record<string, RegExp>;
    /**
     * Is the parser parsing a number now
     */
    protected isOpenNumber: boolean;
    /**
     * Closes all unclosed tokens and returns a Generator of tokens.
     * The method must be called after the end of parsing.
     */
    finishChunkProcessing(): Generator<Token>;
    /**
     * Processes the passed JSON chunk and yields tokens via an asynchronous Generator
     * @param chunk
     */
    processChunk(chunk: string): Generator<Token>;
}
