/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/request/response/README.md]]
 * @packageDocumentation
 */
import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import { Token } from '../../../core/json/stream/parser';
import AbortablePromise from '../../../core/promise/abortable';
import Headers from '../../../core/request/headers';
import type { Statuses, RequestResponseChunk, WrappedDecoder, WrappedStreamDecoder } from '../../../core/request/interface';
import type { ResponseType, ResponseTypeValue, ResponseTypeValueP, ResponseModeType, ResponseOptions, JSONLikeValue } from '../../../core/request/response/interface';
export * from '../../../core/request/headers';
export * from '../../../core/request/response/const';
export * from '../../../core/request/response/interface';
export * from '../../../core/request/response/helpers';
export declare const $$: StrictDictionary<symbol>;
/**
 * Class to work with server response data
 * @typeparam D - response data type
 */
export default class Response<D extends Nullable<string | JSONLikeValue | ArrayBuffer | Blob | Document | unknown> = unknown> {
    /**
     * The resolved request URL (after resolving redirects, etc.)
     */
    readonly url: string;
    /**
     * True if the response was obtained through a redirect
     */
    readonly redirected: boolean;
    /**
     * Mode type of the response
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/type
     */
    readonly type: ResponseModeType;
    /**
     * Parent operation promise
     */
    readonly parent?: AbortablePromise;
    /**
     * A meta flag that indicates that the request is important: is usually used with decoders to indicate that
     * the request needs to be executed as soon as possible
     */
    readonly important?: boolean;
    /**
     * Type of the response data
     */
    get responseType(): CanUndef<ResponseType>;
    /**
     * Sets a new type of the response data
     */
    protected set responseType(value: CanUndef<ResponseType>);
    /**
     * Original type of the response data
     */
    readonly sourceResponseType?: ResponseType;
    /**
     * Response status code
     */
    readonly status: number;
    /**
     * Response status text
     */
    readonly statusText: string;
    /**
     * True if the response status matches with a successful status codes
     * (by default it should match range from 200 to 299)
     */
    readonly ok: boolean;
    /**
     * True if the response status matches with no content status codes
     * (by default it should match range from 100 to 199, 204 or 304)
     */
    readonly hasNoContent: boolean;
    /**
     * A list of status codes (or a single code) that match successful operation.
     * Also, you can pass a range of codes.
     */
    readonly okStatuses: Statuses;
    /**
     * A list of status codes (or a single code) that match a response with no content.
     * Also, you can pass a range of codes.
     */
    readonly noContentStatuses: Statuses;
    /**
     * Set of response headers
     */
    readonly headers: Readonly<Headers>;
    /**
     * List of response decoders
     */
    readonly decoders: WrappedDecoder[];
    /**
     * List of response decoders to apply for chunks when you are parsing response in a stream form
     */
    readonly streamDecoders: WrappedStreamDecoder[];
    /**
     * Reviver function for `JSON.parse`
     * @default `convertIfDate`
     */
    readonly jsonReviver?: JSONCb;
    /**
     * Response body value
     */
    readonly body: ResponseTypeValueP;
    /**
     * True, if the response body is already read
     */
    get bodyUsed(): boolean;
    /**
     * Sets a new status of `bodyUsed`
     */
    protected set bodyUsed(value: boolean);
    /**
     * True, if the response body is already read as a stream
     */
    get streamUsed(): boolean;
    /**
     * Sets a new status of `streamUsed`
     */
    protected set streamUsed(value: boolean);
    /**
     * Event emitter to broadcast response events
     */
    readonly emitter: EventEmitter;
    /**
     * Creates a clone of a response object, identical in every way, but stored in a different variable
     */
    readonly clone: () => Response<D>;
    /**
     * @param [body] - response body value
     * @param [opts] - additional options
     */
    constructor(body?: ResponseTypeValueP, opts?: ResponseOptions);
    /**
     * Returns an iterator by the response body.
     * Mind, when you parse response via iterator, you won't be able to use other parse methods, like `json` or `text`.
     * @emits `streamUsed()`
     */
    [Symbol.asyncIterator](): AsyncIterableIterator<RequestResponseChunk>;
    /**
     * Returns an HTTP header value by the specified name
     * @param name
     */
    getHeader(name: string): CanUndef<string>;
    /**
     * Parses the response body and returns a promise with the result.
     * The operation result is memoized, and you can't parse the response as a stream after invoking this method.
     *
     * A way to parse data is based on the response `Content-Type` header or a passed `responseType` constructor option.
     * Also, a sequence of decoders is applied to the parsed result if they are passed with a `decoders`
     * constructor option.
     */
    decode(): AbortablePromise<D | null>;
    /**
     * Parses the response body as a stream and yields chunks via an asynchronous iterator.
     * You can't parse the response as a whole data after invoking this method.
     *
     * A way to parse data chunks is based on the response `Content-Type` header or a passed `responseType`
     * constructor option. Also, a sequence of stream decoders is applied to the parsed chunk if they are
     * passed with a `streamDecoders` constructor option.
     */
    decodeStream<T = unknown>(): AsyncIterableIterator<T>;
    /**
     * Parses the response body as a JSON object and returns it
     */
    json(): AbortablePromise<JSONLikeValue>;
    /**
     * Parses the response data stream as a JSON tokens and yields them via an asynchronous iterator
     */
    jsonStream(): AsyncIterableIterator<Token>;
    /**
     * Parses the response body as a FormData object and returns it
     */
    formData(): AbortablePromise<FormData>;
    /**
     * Parses the response body as a Document instance and returns it
     */
    document(): AbortablePromise<Document>;
    /**
     * Parses the response body as a string and returns it
     */
    text(): AbortablePromise<string>;
    /**
     * Parses the response data stream as a text chunks and yields them via an asynchronous iterator
     */
    textStream(): AsyncIterableIterator<string>;
    /**
     * Parses the response data stream as an ArrayBuffer chunks and yields them via an asynchronous iterator
     */
    stream(): AsyncIterableIterator<ArrayBuffer | undefined>;
    /**
     * Parses the response body as a Blob structure and returns it
     */
    blob(): AbortablePromise<Blob>;
    /**
     * Parses the response body as an ArrayBuffer and returns it
     */
    arrayBuffer(): AbortablePromise<ArrayBuffer>;
    /**
     * Destroys the instance
     */
    destroy(): void;
    /**
     * Reads the response body or throws an exception if reading is impossible
     * @emits `bodyUsed()`
     */
    protected readBody(): AbortablePromise<ResponseTypeValue>;
    /**
     * Applies the given decoders to the specified data and returns a promise with the result
     *
     * @param data
     * @param [decoders]
     */
    protected applyDecoders<T = unknown>(data: CanPromise<ResponseTypeValue>, decoders?: WrappedDecoder[]): T;
    /**
     * Applies the given decoders to the specified data stream and yields values via an asynchronous iterator
     *
     * @param stream
     * @param [decoders]
     */
    protected applyStreamDecoders<T>(stream: AnyIterable, decoders?: WrappedStreamDecoder[]): AsyncIterableIterator<T>;
    /**
     * Converts the specified data to a Blob structure and returns it
     *
     * @param data
     * @param [type] - blob type, by default it takes from response headers
     */
    protected decodeToBlob(data: unknown, type?: string): Blob;
    /**
     * Converts the specified data to a string and returns it
     *
     * @param data
     * @param [encoding] - string encoding
     */
    protected decodeToString(data: unknown, encoding?: string): AbortablePromise<string>;
}
