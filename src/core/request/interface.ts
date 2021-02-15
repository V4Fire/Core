/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';
import Range from 'core/range';
import Cache from 'core/cache/interface';

import Response, { ResponseType } from 'core/request/response';
import RequestContext from 'core/request/context';

import { defaultRequestOpts } from 'core/request/const';
import { StatusCodes } from 'core/status-codes';

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
	Cache;

export type RequestBody =
	string |
	number |
	boolean |
	Dictionary |
	FormData |
	ArrayBuffer;

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
	(data: I, params: MiddlewareParams, response: Response<any>): CanPromise<O>;
}

export interface WrappedDecoder<I = unknown, O = unknown> {
	(data: I, response: Response<any>): CanPromise<O>;
}

export type Decoders = Iterable<Decoder>;
export type WrappedDecoders = Iterable<WrappedDecoder>;

export type CacheType = 'memory' | 'offline';

export interface RequestResponseObject<D = unknown> {
	data: Nullable<D>;
	response: Response<D>;
	ctx: Readonly<RequestContext<D>>;
	cache?: CacheType;
	dropCache(): void;
}

export type RequestResponse<D = unknown> = Then<RequestResponseObject<D>>;

export interface RequestFunctionResponse<D = unknown, ARGS extends any[] = unknown[]> {
	(...args: ARGS extends Array<infer V> ? V[] : unknown[]): RequestResponse<D>;
}

export interface RequestResolver<D = unknown, ARGS extends any[] = unknown[]> {
	(url: string, params: MiddlewareParams<D>, ...args: ARGS): ResolverResult;
}

export interface RequestOptions {
	readonly url: string;
	readonly method: RequestMethod;
	readonly timeout?: number;
	readonly okStatuses?: OkStatuses;
	readonly contentType?: string;
	readonly responseType?: ResponseType;
	readonly decoders?: WrappedDecoders;
	readonly jsonReviver?: JSONCb | false;
	readonly headers?: Dictionary<CanArray<string>>;
	readonly body?: RequestBody;
	readonly important?: boolean;
	readonly credentials?: boolean;
	readonly parent: Then;
}

export type RequestQuery =
	Dictionary |
	unknown[] |
	string;

// @ts-ignore (extend)
export interface WrappedCreateRequestOptions<D = unknown> extends CreateRequestOptions<D> {
	url: CanUndef<string>;
	encoder?: WrappedEncoder | WrappedEncoders;
	decoder?: WrappedDecoder | WrappedDecoders;
}

export type NormalizedCreateRequestOptions<D = unknown> =
	typeof defaultRequestOpts &
	WrappedCreateRequestOptions<D>;

export type ResolverResult =
	string |
	string[] |
	undefined;

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
 * Object with API parameters. If the API is specified it will be concatenated with
 * a request path URL. It can be useful to create request factories. In addition, you can provide a function as a
 * key value, and it will be invoked.
 *
 * You can provide a direct URL for the API, such as `'https://google.com'`.
 * Or you can provide a bunch of parameters to map on .api parameter from the application config.
 * For example, if the config.api is equal to `'https://google.com'`, and you provide parameters, like,
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
	 * Direct value an API URL
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
	(params: RequestOptions): Then<Response>;
}

/**
 * Options for request
 * @typeparam D - response data type
 */
export interface CreateRequestOptions<D = unknown> {
	/**
	 * Request method type
	 */
	readonly method?: RequestMethod;

	/**
	 * Params for request retries or attempts number
	 */
	retry?: RetryParams | number;

	/**
	 * Mime type of request data (if not specified, it will be casted dynamically)
	 */
	contentType?: string;

	/**
	 * Type of the response data:
	 * (if not specified, it will be casted dynamically from response headers):
	 *
	 * 1. `'text'` - result is interpreted as a simple string;
	 * 1. `'json'` - result is interpreted as a JSON string;
	 * 1. `'arrayBuffer'` - result is interpreted as an array buffer;
	 * 1. `'blob'` - result is interpreted as a binary sequence;
	 * 1. `'object'` - result is interpreted "as is" without any converting.
	 */
	responseType?: ResponseType;

	/**
	 * Request body
	 */
	body?: RequestBody;

	/**
	 * URL query parameters
	 */
	query?: RequestQuery;

	/**
	 * Additional request headers
	 */
	headers?: Dictionary<CanArray<unknown>>;

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
	 * List of status codes (or a single code) that is ok for response,
	 * also can pass a range of codes
	 *
	 * @default `new Range(200, 299)`
	 */
	okStatuses?: OkStatuses;

	/**
	 * Value in milliseconds for the request timeout
	 */
	timeout?: number;

	/**
	 * Strategy of caching for requests that supports it:
	 *
	 * 1. `'forever'` - caches all requests and stores their values forever within the active session or
	 * until the cache expires (if .cacheTTL is specified);
	 * 1. `'queue'` - caches all requests, but more frequent requests will push less frequent requests;
	 * 1. `'never'` - never caches any requests;
	 * 1. custom cache object.
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
	 * Value in milliseconds that indicates how long a value of the request should keep in
	 * the cache (all request is stored within the active session without expiring by default)
	 */
	cacheTTL?: number;

	/**
	 * Enables support of offline caching
	 * @default `false`
	 */
	offlineCache?: boolean;

	/**
	 * Value in milliseconds that indicates how long a value of the request should keep in the offline cache
	 * @default `(1).day()`
	 */
	offlineCacheTTL?: number;

	/**
	 * Dictionary or an iterable value with middleware functions:
	 * functions take an environment of request parameters and can modify theirs.
	 *
	 * Please notice, that the order of middlewares depends on the structure that you use.
	 * Also, if at least one of middlewares returns a function, than the result of invoking this function
	 * will be returned as the request result. It can be helpful to organize mocks of data and
	 * other similar cases when you don't want to execute a real request.
	 */
	middlewares?: Middlewares<D>;

	/**
	 * Function (or a sequence of functions) that takes response data of the current request
	 * and returns a new data to respond. If you provide a sequence of functions, then the first function
	 * will provide a result to the next function from te sequence, etc.
	 */
	encoder?: Encoder | Encoders;

	/**
	 * Function (or a sequence of functions) that takes response data of the current request
	 * and returns a new data to respond. If you provide a sequence of functions, then the first function
	 * will provide a result to the next function from te sequence, etc.
	 */
	decoder?: Decoder | Decoders;

	/**
	 * Reviver function for JSON.parse or false to disable defaults
	 * @default `convertIfDate`
	 */
	jsonReviver?: JSONCb | false;

	/**
	 * The special flag that indicates that request will be invoked not directly by a browser,
	 * but some "external" application, such as a native application in a mobile (it's important for offline requests
	 */
	externalRequest?: boolean;

	/**
	 * The meta flag that indicates that the request is important: usually it used with middlewares
	 * to indicate that the request need execute as soon as possible
	 */
	important?: boolean;

	/**
	 * Dictionary with some extra parameters for the request: usually it used with middlewares for
	 * providing domain specific information
	 */
	meta?: Dictionary;

	/**
	 * Custom request engine
	 */
	engine?: RequestEngine;
}

/**
 * Retry request params
 */
export interface RetryParams {
	/**
	 * Number of retryAttempts
	 */
	attempts?: number;

	/**
	 * Function that return ms delay or Promise before next try
	 * or return false to stop trying
	 * @param attempt next attempt number
	 */
	delayBeforeAttempt?(attempt?: number): number | Promise<void> | false;
}
