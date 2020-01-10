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

export interface RequestAPI {
	/**
	 * Direct value for API URL
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
	 *
	 */
	auth?: RequestAPIValue;

	/**
	 *
	 */
	domain6?: RequestAPIValue;

	/**
	 *
	 */
	domain5?: RequestAPIValue;

	/**
	 *
	 */
	domain4?: RequestAPIValue;

	/**
	 *
	 */
	domain3?: RequestAPIValue;

	/**
	 *
	 */
	domain2?: RequestAPIValue;

	/**
	 *
	 */
	zone?: RequestAPIValue;

	/**
	 *
	 */
	port?: RequestAPIValue<string | number>;

	/**
	 *
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
	 * * `'text'` - result is interpreted as a simple string;
	 * * `'json'` - result is interpreted as a JSON string;
	 * * `'arrayBuffer'` - result is interpreted as an array buffer;
	 * * `'blob'` - result is interpreted as a binary sequence;
	 * * `'object'` - result is interpreted "as is" without any converting.
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
	 * <p>You can provide a direct URL for the API:</p>
	 */
	api?: RequestAPI;
	okStatuses?: OkStatuses;
	timeout?: number;

	readonly cacheStrategy?: CacheStrategy;
	cacheId?: string | symbol;
	cacheMethods?: RequestMethod[];
	cacheTTL?: number;
	offlineCache?: boolean;
	offlineCacheTTL?: number;

	middlewares?: Middlewares<T>;
	encoder?: Encoder | Encoders;
	decoder?: Decoder | Decoders;

	externalRequest?: boolean;
	important?: boolean;
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
