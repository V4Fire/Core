/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { TokenName, TokenProcessor, TokenProcessorFn } from '../../../../core/json/stream/parser';
import type { FilterToken, TokenFilter, TokenFilterFn, FilterStack, FilterOptions } from '../../../../core/json/stream/filters/interface';
export declare const $$: StrictDictionary<symbol>;
export default abstract class AbstractFilter implements TokenProcessor<FilterToken> {
    /**
     * Creates a function to filter only chunks by the specified path
     *
     * @param path
     * @example
     * ```js
     * const filter = createPathFilter('foo.bla.bar');
     * ```
     */
    static createPathFilter(path: string): TokenFilterFn;
    /**
     * Creates a function to filter only chunks with paths matched to the specified regular expression
     *
     * @param rgxp
     * @example
     * ```js
     * const filter = createRegExpFilter(/\d+\.foo\.bar/);
     * ```
     */
    static createRegExpFilter(rgxp: RegExp): TokenFilterFn;
    /**
     * If true the filtration will return all matched filter results, otherwise only the first match will be returned
     */
    readonly multiple: boolean;
    /**
     * Processes the passed JSON token and yields tokens
     */
    get processToken(): TokenProcessorFn<FilterToken>;
    /**
     * Sets a new process function to parse JSON chunk and yield tokens
     */
    protected set processToken(val: TokenProcessorFn<FilterToken>);
    /**
     * Checks that specified token is matched for the filter
     * @param token
     */
    protected abstract checkToken(token: FilterToken): Generator<boolean | FilterToken>;
    /**
     * Function to filter a sequence of parsed tokens
     *
     * @param stack
     * @param chunk
     */
    protected filter: TokenFilterFn;
    /**
     * Stack of processed tokens
     */
    protected stack: FilterStack;
    /**
     * Depth of the current structure
     */
    protected depth: number;
    /**
     * Name of the previous parsed token
     */
    protected previousToken: TokenName;
    /**
     * Name of the next expected token from a stream
     */
    protected expectedToken?: TokenName;
    /**
     * Method to pass numeric tokens
     */
    protected readonly passNumber: TokenProcessorFn<FilterToken>;
    /**
     * Method to skip numeric tokens
     */
    protected readonly skipNumber: TokenProcessorFn<FilterToken>;
    /**
     * Method to pass string tokens
     */
    protected readonly passString: TokenProcessorFn<FilterToken>;
    /**
     * Method to skip string tokens
     */
    protected readonly skipString: TokenProcessorFn<FilterToken>;
    /**
     * Method to pass key tokens
     */
    protected readonly passKey: TokenProcessorFn<FilterToken>;
    /**
     * Method to skip key tokens
     */
    protected readonly skipKey: TokenProcessorFn<FilterToken>;
    /**
     * @param filter
     * @param [opts] - additional filter options
     */
    protected constructor(filter: TokenFilter, opts?: FilterOptions);
    /**
     * Closes all unclosed tokens and returns a Generator of filtered tokens.
     * The method must be called after the end of filtration.
     */
    finishTokenProcessing(): Generator<FilterToken>;
    /**
     * Check the specified token for filter satisfaction
     * @param token
     */
    protected check(token: FilterToken): Generator<FilterToken>;
    /**
     * Passes the passed token into an output token stream
     * @param token
     */
    protected pass(token: FilterToken): Generator<FilterToken>;
    /**
     * Skips the passed token from an output token stream
     */
    protected skip(_: FilterToken): Generator<FilterToken>;
    /**
     * Passes the passed object token into an output token stream
     * @param token
     */
    protected passObject(token: FilterToken): Generator<FilterToken>;
    /**
     * Skips the passed object token from an output token stream
     * @param chunk
     */
    protected skipObject(chunk: FilterToken): void;
    /**
     * Creates a function to pass tokens into an output token stream
     *
     * @param currentToken
     * @param expectedToken
     */
    protected passValue(currentToken: TokenName, expectedToken: TokenName): TokenProcessorFn<FilterToken>;
    /**
     * Creates a function to skip tokens from an output token stream
     *
     * @param currentToken
     * @param expectedToken
     */
    protected skipValue(currentToken: TokenName, expectedToken: TokenName): TokenProcessorFn<FilterToken>;
}
