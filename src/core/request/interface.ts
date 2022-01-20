/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { EventEmitter2 as EventEmitter } from 'eventemitter2';
import type { AbstractCache } from 'core/cache';

import type Range from 'core/range';
import type AbortablePromise from 'core/promise/abortable';

import type Headers from 'core/request/headers';
import type { RawHeaders } from 'core/request/headers';

import type Response from 'core/request/response';
import type { ResponseType } from 'core/request/response';

import type RequestError from 'core/request/error';
import type RequestContext from 'core/request/modules/context';

import type { defaultRequestOpts } from 'core/request/const';
import type { StatusCodes } from 'core/status-codes';

export type RequestMethod =
	'GET' |
	'POST' |
	'PUT' |
	'DELETE' |
	'PATCH' |
	'HEAD' |
	'CONNECT' |
	'OPTIONS' |
	'TRACE';

export type CacheStrategy =
	'queue' |
	'forever' |
	'never' |
	AbstractCache |
	Promise<AbstractCache>;

export type RequestBody =
	string |
	number |
	boolean |
	Dictionary |
	FormData |
	ArrayBuffer |
	Blob;

export type OkStatuses =
	Range<number> |
	StatusCodes |
	StatusCodes[];

export interface Encoder<I = unknown, O = unknown> {
	(data: I, params: MiddlewareParams): CanPromise<O>;
}

export interface WrappedEncoder<I = unknown, O = unknown> {
	(data: I): CanPromise<O>;
}

export type Encoders = Iterable<Encoder>;
export type WrappedEncoders = Iterable<WrappedEncoder>;

export interface Decoder<I = unknown, O = unknown> {
	(data: I, params: MiddlewareParams, response: Response): CanPromise<O>;
}

export interface WrappedDecoder<I = unknown, O = unknown> {
	(data: I, response: Response): CanPromise<O>;
}

export type Decoders = Iterable<Decoder>;
export type WrappedDecoders = Iterable<WrappedDecoder>;

export type CacheType =
	'memory' |
	'offline';

export interface RequestChunk {
	loaded: number;
	total?: number;
	data?: Uint8Array;
}

export interface RequestResponseObject<D = unknown> {
	data: Nullable<D>;
	[Symbol.asyncIterator](): AsyncIterable<RequestChunk>;

	ctx: Readonly<RequestContext<D>>;
	response: Response<D>;

	cache?: CacheType;
	dropCache(): void;
}

export type RequestPromise = AbortablePromise & {
	emitter: EventEmitter;
	[Symbol.asyncIterator](): AsyncIterable<RequestChunk>;
};

export type RequestResponse<D = unknown> = AbortablePromise<RequestResponseObject<D>>;

export interface RequestFunctionResponse<D = unknown, ARGS extends any[] = unknown[]> {
	(...args: ARGS extends Array<infer V> ? V[] : unknown[]): RequestResponse<D>;
}

export interface RequestResolver<D = unknown, ARGS extends any[] = unknown[]> {
	(url: string, params: MiddlewareParams<D>, ...args: ARGS): ResolverResult;
}

export interface RequestOptions {
	readonly url: string;
	readonly method: RequestMethod;

	readonly emitter: EventEmitter;
	readonly parent: AbortablePromise;

	readonly timeout?: number;
	readonly okStatuses?: OkStatuses;

	readonly contentType?: string;
	readonly responseType?: ResponseType;

	readonly decoders?: WrappedDecoders;
	readonly jsonReviver?: JSONCb | false;

	readonly headers?: Headers;
	readonly body?: RequestBody;

	readonly important?: boolean;
	readonly credentials?: boolean;
}

export type RequestQuery =
	Dictionary |
	unknown[] |
	string;

// @ts-ignore (extend)
export interface WrappedCreateRequestOptions<D = unknown> extends CreateRequestOptions<D> {
	/**
	 * URL to make request
	 */
	url: CanUndef<string>;

	/**
	 * Original path that was passed into the request function
	 */
	path: CanUndef<string>;

	headers: Headers;
	encoder?: WrappedEncoder | WrappedEncoders;
	decoder?: WrappedDecoder | WrappedDecoders;
}

export type NormalizedCreateRequestOptions<D = unknown> = typeof defaultRequestOpts & WrappedCreateRequestOptions<D>;
export type ResolverResult = CanUndef<CanArray<string>>;

export interface GlobalOptions {
	api?: Nullable<string>;
	meta: Dictionary;
}

export interface MiddlewareParams<D = unknown> {
	ctx: RequestContext<D>;
	opts: NormalizedCreateRequestOptions<D>;
	globalOpts: GlobalOptions;
}

export interface Middleware<D = unknown> {
	(params: MiddlewareParams<D>): CanPromise<any | Function>;
}

export type Middlewares<D = unknown> =
	Dictionary<Middleware<D>> |
	Iterable<Middleware<D>>;

export type RequestAPIValue<T = string> = Nullable<T> | (() => Nullable<T>);

/**
 * An object with API parameters.
 * If the API is specified, it will be concatenated with a request path URL.
 * It can be useful to create request factories. In addition, you can provide a function as a key-value,
 * and it will be invoked. You can provide a direct URL for the API, such as `'https://google.com'`.
 *
 * Or you can provide a bunch of parameters to map on `api` parameter from the application config.
 * For example, if the `config.api` is equal to `'https://google.com'`, and you provide parameters, like,
 *
 * ```
 *   {
 *     domain3: 'foo',
 *     namespace: () => 'bar'
 *   }
 * ```
 *
 * then it builds a string is equal to `'https://foo.google.com/bar'.`
 */
export interface RequestAPI {
	/**
	 * The direct value of API URL
	 *
	 * @example
	 * `'https://google.com'`
	 */
	url?: RequestAPIValue;

	/**
	 * API protocol
	 *
	 * @example
	 * `'http'`
	 * `'https'`
	 */
	protocol?: RequestAPIValue;

	/**
	 * Value for an API authorization part
	 *
	 * @example
	 * `'login:password'`
	 */
	auth?: RequestAPIValue;

	/**
	 * Value for an API domain level 6 part
	 */
	domain6?: RequestAPIValue;

	/**
	 * Value for an API domain level 5 part
	 */
	domain5?: RequestAPIValue;

	/**
	 * Value for an API domain level 4 part
	 */
	domain4?: RequestAPIValue;

	/**
	 * Value for an API domain level 3 part
	 */
	domain3?: RequestAPIValue;

	/**
	 * Value for an API domain level 2 part
	 */
	domain2?: RequestAPIValue;

	/**
	 * Value for an API domain zone part
	 */
	zone?: RequestAPIValue;

	/**
	 * Value for an API api port
	 */
	port?: RequestAPIValue<string | number>;

	/**
	 * Value for an API namespace part: it follows after '/' character
	 */
	namespace?: RequestAPIValue;
}

/**
 * Request engine
 */
export interface RequestEngine {
	(params: RequestOptions): AbortablePromise<Response>;

	/**
	 * A flag indicates that the active requests with the same request hash can be merged
	 * @default `true`
	 */
	pendingCache?: boolean;
}

/**
 * Options for a request
 * @typeparam D - response data type
 */
export interface CreateRequestOptions<D = unknown> {
	/**
	 * Request method type
	 */
	readonly method?: RequestMethod;

	/**
	 * Options to retry bad requests
	 */
	retry?: RetryOptions | number;

	/**
	 * Mime type of the request data (if not specified, it will be cast dynamically)
	 */
	contentType?: string;

	/**
	 * Type of the response data:
	 * (if not specified, it will be cast dynamically from the response headers):
	 *
	 * 1. `'text'` - result is interpreted as a simple string;
	 * 1. `'json'` - result is interpreted as a JSON string;
	 * 1. `'arrayBuffer'` - result is interpreted as an array buffer;
	 * 1. `'blob'` - result is interpreted as a binary sequence;
	 * 1. `'object'` - result is interpreted "as is" without any converting.
	 */
	responseType?: ResponseType;

	/**
	 * Additional request headers
	 */
	headers?: RawHeaders;

	/**
	 * URL query parameters
	 */
	query?: RequestQuery;

	/**
	 * Request body
	 */
	body?: RequestBody;

	/**
	 * Enables providing of credentials for cross-domain requests
	 */
	credentials?: boolean;

	/**
	 * Map of API parameters.
	 *
	 * If the API is specified it will be concatenated with a request path URL. It can be useful to create
	 * request factories. In addition, you can provide a function as a key value, and it will be invoked.
	 */
	api?: RequestAPI;

	/**
	 * List of status codes (or a single code) that match successful operation.
	 * Also, you can pass a range of codes.
	 *
	 * @default `new Range(200, 299)`
	 */
	okStatuses?: OkStatuses;

	/**
	 * Value in milliseconds for a request timeout
	 */
	timeout?: number;

	/**
	 * Strategy of caching for requests that supports it:
	 *
	 * 1. `'forever'` - caches all requests and stores their values forever within the active session or
	 *   until the cache expires (if `cacheTTL` is specified);
	 * 2. `'queue'` - caches all requests, but more frequent requests will push less frequent requests;
	 * 3. `'never'` - never caches any requests;
	 * 4. custom cache object.
	 */
	readonly cacheStrategy?: CacheStrategy;

	/**
	 * Unique cache identifier: it can be useful to create request factories with isolated cache storages
	 */
	cacheId?: string | symbol;

	/**
	 * List of request methods that supports caching
	 * @default `['GET']`
	 */
	cacheMethods?: RequestMethod[];

	/**
	 * Value in milliseconds that indicates how long a request' value should keep in the cache
	 * (all requests are stored within the active session without expiring by default)
	 */
	cacheTTL?: number;

	/**
	 * Enables support of offline caching
	 * @default `false`
	 */
	offlineCache?: boolean;

	/**
	 * Value in milliseconds that indicates how long a request' value should keep in the offline cache
	 * @default `(1).day()`
	 */
	offlineCacheTTL?: number;

	/**
	 * A dictionary or iterable value with middleware functions:
	 * functions take an environment of request parameters and can modify theirs.
	 *
	 * Please notice that the order of middleware depends on the structure you use.
	 * Also, if at least one of the middlewares returns a function, the result of invoking this function
	 * will be returned as the request result. It can be helpful to organize mocks of data and
	 * other similar cases when you don't want to execute a real request.
	 */
	middlewares?: Middlewares<D>;

	/**
	 * A function (or a sequence of functions) takes the current request data
	 * and returns new data to request. If you provide a sequence of functions,
	 * the first function will pass result in the next function from the sequence, etc.
	 */
	encoder?: Encoder | Encoders;

	/**
	 * Returns serialized value of the specified query object
	 * @param query
	 */
	querySerializer?(query: RequestQuery): string;

	/**
	 * A function (or a sequence of functions) takes the current request's response data
	 * and returns new data to respond. If you provide a sequence of functions,
	 * the first function will pass a result to the next function from the sequence, etc.
	 */
	decoder?: Decoder | Decoders;

	/**
	 * Reviver function for `JSON.parse` or false to disable defaults
	 * @default `convertIfDate`
	 */
	jsonReviver?: JSONCb | false;

	/**
	 * A meta flag that indicates that the request is important: is usually used with middleware to indicate that
	 * the request needs to be executed as soon as possible
	 */
	important?: boolean;

	/**
	 * A dictionary with some extra parameters for the request: is usually used with middlewares to provide
	 * domain-specific information
	 */
	meta?: Dictionary;

	/**
	 * Request engine to use
	 */
	engine?: RequestEngine;
}

/**
 * Options to retry bad requests
 * @typeparam D - response data type
 */
export interface RetryOptions<D = unknown> {
	/**
	 * Maximum number of attempts to request
	 */
	attempts?: number;

	/**
	 * Returns a number in milliseconds (or a promise) to wait before the next attempt.
	 * If the function returns false, it will prevent all further attempts.
	 *
	 * @param attempt - current attempt number
	 * @param error - error object
	 */
	delay?(attempt: number, error: RequestError<D>): number | Promise<void> | false;
}
