/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { requestQuery } from '../../../core/request/headers/const';
import type { RawHeaders, HeadersForEachCb } from '../../../core/request/headers/interface';
export * from '../../../core/request/headers/interface';
/**
 * Class to create a set of HTTP headers
 */
export default class V4Headers {
    /**
     * Request query object (to interpolate values from headers)
     */
    [requestQuery]?: Dictionary;
    /**
     * @param [headers] - headers to initialize
     * @param [query] - request query object (to interpolate values from headers)
     */
    constructor(headers?: RawHeaders, query?: Dictionary);
    /**
     * Returns an iterator over headers.
     * It produces tuples with headers' names and values.
     */
    [Symbol.iterator](): IterableIterator<[string, string]>;
    /**
     * Returns a header value by the specified name
     * @param name
     */
    get(name: string): string | null;
    /**
     * Returns true if the structure contains a header by the specified name
     * @param name
     */
    has(name: string): boolean;
    /**
     * Sets a new header value by the specified name.
     * To set multiple values for one header, provide its value as a list of values.
     *
     * @param name
     * @param value
     */
    set(name: string, value: CanArray<string>): void;
    /**
     * Appends a new value into an existing header or adds the header if it does not already exist.
     * To set multiple values for one header, provide its value as a list of values.
     *
     * @param name
     * @param value
     */
    append(name: string, value: CanArray<string>): void;
    /**
     * Deletes a header by the specified name
     * @param name
     */
    delete(name: string): void;
    /**
     * Iterates over the headers and invokes the given callback function at each header
     *
     * @param cb
     * @param [thisArg] - value to use as `this` when executing callback
     */
    forEach(cb: HeadersForEachCb, thisArg?: any): void;
    /**
     * Returns an iterator over headers' values
     */
    values(): IterableIterator<string>;
    /**
     * Returns an iterator over headers' names
     */
    keys(): IterableIterator<string>;
    /**
     * Returns an iterator over headers.
     * It produces tuples with headers' names and values.
     */
    entries(): IterableIterator<[string, string]>;
    /**
     * Normalizes the specified header name
     * @param name
     */
    protected normalizeHeaderName(name: string): string;
    /**
     * Normalizes the specified header value
     * @param value
     */
    protected normalizeHeaderValue(value: unknown): string;
}
