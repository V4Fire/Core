/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';
import Range from 'core/range';
import Response from 'core/request/response';
import RequestContext from 'core/request/context';
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
	'never';

export type ResponseType =
	'text' |
	'json' |
	'document' |
	'arrayBuffer' |
	'blob' |
	'object';

export type ResponseTypeValue =
	string |
	ArrayBuffer |
	Document |
	null |
	undefined;

export type RequestBody =
	string |
	number |
	boolean |
	Dictionary |
	FormData |
	ArrayBuffer;

export type JSONLikeValue =
	string |
	number |
	boolean |
	null |
	unknown[] |
	Dictionary;

export type OkStatuses =
	Range<number> |
	StatusCodes |
	StatusCodes[];

export interface Encoder<I = unknown, O = unknown> {
	(data: I, params: MiddlewareOptions): O;
}

export type Encoders<T = unknown> =
	Iterable<Encoder<T>>;

export interface Decoder<I = unknown, O = unknown> {
	(data: I, params: MiddlewareOptions, response: Response): O;
}

export type Decoders<T = unknown> =
	Iterable<Decoder<T>>;

export interface RequestResponseObject<T = unknown> {
	data: T | null;
	response: Response;
	ctx: Readonly<RequestContext<T>>;
	dropCache(): void;
}

export type RequestResponse<T = unknown> = Then<RequestResponseObject<T>>;
export interface RequestFunctionResponse<T = unknown, A extends unknown[] = []> {
	(...args: A extends (infer V)[] ? V[] : unknown[]): RequestResponse<T>;
}

export interface RequestOptions {
	readonly url: string;
	readonly method?: RequestMethod;
	readonly timeout?: number;
	readonly okStatuses?: OkStatuses;
	readonly contentType?: string;
	readonly responseType?: ResponseType;
	readonly decoder?: Decoder | Decoder[];
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

export interface MiddlewareOptions<T = unknown> {
	ctx: RequestContext<T>;
	opts: CreateRequestOptions<T>;
	globalOpts: GlobalOptions;
}

export interface Middleware<T = unknown> {
	(params: MiddlewareOptions<T>): CanPromise<void | Function>;
}

export type Middlewares<T = unknown> =
	Dictionary<Middleware<T>> |
	Iterable<Middleware<T>>;

export type RequestAPIValue<T = string> = Nullable<T> | (() => Nullable<T>);

/**
 * Object with API parameters. If the API is specified it will be concatenated with
 * a request path URL. It can be useful for creating request factories. In addition, you can provide a function as a
 * key value, and it will be invoked.
 *
 * You can provide a direct URL for the API, such as `'https://google.com'`.
 * Or you can provide a bunch of parameters for mapping on .api parameter from the application config.
 * For example, if the config.api is equal to `'https://google.com'` and you provide parameters like
 *
 * ```
 *   {
 *     domain3: 'foo',
 *     namespace: () => 'bar'
 *   }
 * ```
 *
 * than it builds a string is equal to `'https://foo.google.com/bar'.`
 *
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
export interface RequestResolver<T = unknown, ARGS extends unknown[] = unknown[]> {
	(url: string, opts: MiddlewareOptions<T>, ...args: ARGS): ResolverResult;
}

export interface CreateRequestOptions<T = unknown> {
	/**
	 * Request method type
	 */
	readonly method?: RequestMethod;

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
	 * If the API is specified it will be concatenated with a request path URL. It can be useful for creating
	 * request factories. In addition, you can provide a function as a key value, and it will be invoked.
	 */
	api?: RequestAPI;

	/**
	 * List of status codes (or a single code) with HTTP statuses that is ok for response,
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
	 * Type of caching for requests that supports it:
	 *
	 * 1. `'forever'` - caches all requests and stores their values forever within the active session or
	 * until the cache expires (if .cacheTTL is specified);
	 * 1. `'queue'` - caches all requests, but more frequent requests will push less frequent requests;
	 * 1. `'never'` - never caches any requests.
	 */
	readonly cacheStrategy?: CacheStrategy;

	/**
	 * Unique cache identifier: it can be useful for creating request factories with isolated cache storages
	 */
	cacheId?: string | symbol;

	/**
	 * List of request methods that supports caching
	 * @default `['GET']`
	 */
	cacheMethods?: RequestMethod[];

	/**
	 * Value in milliseconds that indicates how long a value of the request should keep in
	 * the cache (by default, all request is stored within the active session without expiring)
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
	 * Please notice, that the order of middlewares depends of a structure that you use.
	 * Also, if at least one of middlewares returns a function, than the result of invoking this function
	 * will be returned as the request result. It can be helpful for organizing mocks of data and
	 * other similar cases when you don't want to execute a real request.
	 */
	middlewares?: Middlewares<T>;

	/**
	 * Function (or a sequence of functions) that takes response data of the current request
	 * and returns a new data for responsing. If you provides a sequence of functions, then the first function
	 * will provide a result to the next function from te sequence and etc.
	 */
	encoder?: Encoder | Encoders;

	/**
	 * Function (or a sequence of functions) that takes response data of the current request
	 * and returns a new data for responsing. If you provides a sequence of functions, then the first function
	 * will provide a result to the next function from te sequence and etc.
	 */
	decoder?: Decoder | Decoders;

	/**
	 * Special flag that indicates that request will be invoked not directly by a browser,
	 * but some "external" application, such as a native application in a mobile (it's important for offline requests
	 */
	externalRequest?: boolean;

	/**
	 * Meta flag that indicates that the request is important: usually it used with middlewares
	 * for indicating that the request need execute as soon as possible
	 */
	important?: boolean;

	/**
	 * Dictionary with some extra parameters for the request: usually it used with middlewares for
	 * providing domain specific information
	 */
	meta?: Dictionary;
}

export type ResolverResult =
	string |
	string[] |
	undefined;

export interface ResponseHeaders {
	readonly [name: string]: string;
}

export interface ResponseOptions {
	parent?: Then;
	important?: boolean;
	responseType?: ResponseType;
	okStatuses?: OkStatuses;
	status?: StatusCodes;
	headers?: string | Dictionary<string>;
	decoder?: Decoder | Decoders;
}

export interface GlobalOptions {
	api?: Nullable<string>;
	meta: Dictionary;
}
