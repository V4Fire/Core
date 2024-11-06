/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { EventEmitter2 as EventEmitter } from 'eventemitter2';
import type { AbstractCache } from 'core/cache';

import type Data from 'core/data';
import type { ModelMethod } from 'core/data';

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

export type CacheType =
	'memory' |
	'offline';

export type RequestQuery =
	Dictionary |
	unknown[] |
	string;

export type RequestBody =
	string |
	number |
	boolean |
	Dictionary |
	FormData |
	ArrayBuffer |
	Blob;

export type NormalizedRequestBody = Exclude<
	RequestBody,
	number | boolean | Dictionary
>;

export type Statuses =
	Range<number> |
	StatusCodes |
	StatusCodes[];

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

export interface StreamDecoder<I = unknown, O = unknown> {
	(data: AnyIterable<I>, params: MiddlewareParams, response: Response): AnyIterable<O>;
}

export interface WrappedStreamDecoder<I = unknown, O = unknown> {
	(data: AnyIterable<I>, response: Response): AnyIterable<O>;
}

export type StreamDecoders = Iterable<StreamDecoder>;
export type WrappedStreamDecoders = Iterable<WrappedStreamDecoder>;

export interface RequestResponseChunk {
	loaded: number;
	total?: number;
	data?: Uint8Array;
}

export interface RequestResponseObject<D = unknown> {
	ctx: Readonly<RequestContext<D>>;
	response: Response<D>;

	data: Promise<Nullable<D>>;
	stream: AsyncIterableIterator<unknown>;

	emitter: EventEmitter;
	[Symbol.asyncIterator](): AsyncIterableIterator<RequestResponseChunk>;

	cache?: CacheType;

	/**
	 * Drops the request cache
	 *
	 * @param [recursive] - if true, then the `dropCache` operation will be propagated recursively,
	 *   for example, if an engine based on a data provider is used
	 */
	dropCache(recursive?: boolean): void;

	/**
	 * Destroys the request context
	 */
	destroy(): void;
}

export type RequestResponse<D = unknown> = AbortablePromise<RequestResponseObject<D>>;

export interface RequestPromise<D = unknown> extends RequestResponse<D> {
	data: Promise<Nullable<D>>;
	stream: AsyncIterableIterator<unknown>;
	emitter: EventEmitter;
	[Symbol.asyncIterator](): AsyncIterableIterator<RequestResponseChunk>;
}

export interface RequestFunctionResponse<D = unknown, ARGS extends any[] = unknown[]> {
	(...args: ARGS extends Array<infer V> ? V[] : unknown[]): RequestPromise<D>;
}

export interface RequestResolver<D = unknown, ARGS extends any[] = unknown[]> {
	(url: string, params: MiddlewareParams<D>, ...args: ARGS): ResolverResult;
}

export type ResolverResult = CanUndef<CanArray<string>>;

export interface RequestMeta extends Dictionary {
	provider?: Data;
	providerMethod?: ModelMethod;
	providerParams?: CreateRequestOptions<any>;
}

/**
 * Options for a request
 * @typeparam D - response data type
 */
export interface CreateRequestOptions<D = unknown> {
	/**
	 * HTTP method to create a request
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
	 */
	method?: RequestMethod;

	/**
	 * Additional HTTP request headers.
	 * You can provide them as a simple dictionary or an instance of the Headers class.
	 * Also, you can pass headers as an instance of the `core/request/headers` class.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
	 */
	headers?: RawHeaders;

	/**
	 * Enables providing of credentials for cross-domain requests.
	 * Also, you can manage to omit any credentials if the used request engine supports it.
	 */
	credentials?: boolean | RequestCredentials;

	/**
	 * Request parameters that will be serialized to a string and passed via a request URL.
	 * To customize how to encode data to a query string, see `querySerializer`.
	 */
	query?: RequestQuery;

	/**
	 * Returns a serialized value of the specified query object
	 *
	 * @param query
	 * @example
	 * ```js
	 * import request from 'core/request';
	 * import { toQueryString } from 'core/url';
	 *
	 * request('//user', {
	 *   query: {ids: [125, 35, 454]},
	 *   querySerializer: (data) => toQueryString(data, {arraySyntax: true})
	 * }).data.then(console.log);
	 * ```
	 */
	querySerializer?(query: RequestQuery): string;

	/**
	 * Request body.
	 * Mind, not every HTTP method can send data in this way. For instance,
	 * GET or HEAD requests can send data only with URLs (@see `query`).
	 */
	body?: RequestBody;

	/**
	 * Mime type of the request data (if not specified, it will be cast dynamically)
	 *
	 * @example
	 * ```js
	 * request('//create-user', {
	 *   method: 'POST',
	 *   body: {name: 'Bob'},
	 *   contentType: 'application/x-msgpack',
	 *   encoder: toMessagePack
	 * }).data.then(console.log);
	 * ```
	 */
	contentType?: string;

	/**
	 * The data type of the response.
	 * By default, the data type is taken from the `content-type` header, and if not set, then based on this parameter.
	 * However, you can change this behavior with the `forceResponseType` parameter.
	 *
	 * 1. `'text'` - result is interpreted as a simple string;
	 * 1. `'json'` - result is interpreted as a JSON object;
	 * 1. `'document'` - result is interpreted as an XML/HTML document;
	 * 1. `'formData'` - result is interpreted as a FormData object;
	 * 1. `'blob'` - result is interpreted as a Blob object;
	 * 1. `'arrayBuffer'` - result is interpreted as a raw array buffer;
	 * 1. `'object'` - result is interpreted "as is" without any converting.
	 *
	 * @example
	 * ```js
	 * request('//users', {
	 *   responseType: 'arrayBuffer',
	 *   decoder: fromMessagePack
	 * }).data.then(console.log);
	 * ```
	 */
	responseType?: ResponseType;

	/**
	 * If true, then the `responseType` parameter takes precedence over the `content-type` header from the server
	 * @default `false`
	 */
	forceResponseType?: boolean;

	/**
	 * A list of status codes (or a single code) that match successful operation.
	 * Also, you can pass a range of codes.
	 *
	 * @default `new Range(200, 299)`
	 */
	okStatuses?: Statuses;

	/**
	 * A list of status codes (or a single code) that match response with no content.
	 * Also, you can pass a range of codes.
	 *
	 * @default `[statusCodes.NO_CONTENT, statusCodes.NOT_MODIFIED]
	 *   .concat(new Range<number>(100, 199).toArray(1))`
	 */
	noContentStatuses?: Statuses;

	/**
	 * Value in milliseconds for a request timeout
	 */
	timeout?: number;

	/**
	 * Options to retry bad requests or a number of maximum request retries
	 *
	 * @example
	 * ```js
	 * request('//users', {
	 *   timeout: (10).seconds(),
	 *   retry: 3
	 * }).data.then(console.log);
	 *
	 * request('//users', {
	 *   timeout: (10).seconds(),
	 *   retry: {
	 *     attempts: 3,
	 *     delay: (attempt) => attempt * (3).seconds()
	 *   }
	 * }).data.then(console.log);
	 * ```
	 */
	retry?: RetryOptions | number;

	/**
	 * A map of API parameters.
	 *
	 * These parameters apply if the original request URL is not absolute, and they can be used to customize the
	 * base API URL depending on the runtime environment. If you define the base API URL via
	 * `config#api` or `globalOpts.api`, these parameters will be mapped on it.
	 *
	 * @example
	 * ```js
	 * // URL (IS_PROD === true): https://foo.com/users
	 * // URL (IS_PROD === false): https://foo.com/foo-stage
	 *
	 * request('/users', {
	 *   api: {
	 *     protocol: 'https',
	 *     domain2: () => IS_PROD ? 'foo' : 'foo-stage',
	 *     zone: 'com'
	 *   }
	 * }).data.then(console.log);
	 *
	 *
	 * // URL (globalOpts.api === 'https://api.foo.com' && IS_PROD === true): https://api.foo.com/users
	 * // URL (globalOpts.api === 'https://api.foo.com' && IS_PROD === false): https://api.foo-stage.com/users
	 *
	 * request('/users', {
	 *   api: {
	 *     domain2: () => IS_PROD ? 'foo' : 'foo-stage',
	 *   }
	 * }).data.then(console.log);
	 * ```
	 */
	api?: RequestAPI;

	/**
	 * Strategy of caching for requests that support caching (by default, only GET requests can be cached):
	 *
	 * 1. `'forever'` - caches all requests and stores their values forever within the active session or
	 *   until the cache expires (if `cacheTTL` is specified);
	 * 2. `'queue'` - caches all requests, but more frequent requests will push less frequent requests;
	 * 3. `'never'` - never caches any requests;
	 * 4. Or, you can pass a custom cache object.
	 *
	 * @example
	 * ```js
	 * import request, { cache } from 'core/request';
	 * import RestrictedCache from 'core/cache/restricted';
	 *
	 * request('/users', {
	 *   cacheStrategy: 'forever'
	 * }).data.then(console.log);
	 *
	 * request('/users', {
	 *   cacheStrategy: new RestrictedCache(50)
	 * }).data.then(console.log);
	 *
	 * // If you set a strategy using string identifiers, all requests will be stored within the global cache objects.
	 * cache.forever.clear();
	 * ```
	 */
	cacheStrategy?: CacheStrategy;

	/**
	 * Value in milliseconds that indicates how long a request value should keep in the cache
	 * (all requests are stored within the active session without expiring by default)
	 */
	cacheTTL?: number;

	/**
	 * Enables support of offline caching.
	 * By default, a request can only be taken from a cache if there is no network.
	 * You can customize this logic by providing a custom cache object with the `core/cache/decorators/persistent`
	 * decorator.
	 *
	 * @default `false`
	 * @example
	 * ```js
	 * import request from 'core/request';
	 * import { asyncLocal } from 'core/kv-storage';
	 *
	 * import addPersistent from 'core/cache/decorators/persistent';
	 * import SimpleCache from 'core/cache/simple';
	 *
	 * request('/users', {
	 *   cacheStrategy: 'forever',
	 *   offlineCache: true
	 * });
	 *
	 * const
	 *   opts = {loadFromStorage: 'onInit'},
	 *   persistentCache = await addPersistent(new SimpleCache(), asyncLocal, opts);
	 *
	 * request('/users', {
	 *   cacheStrategy: persistentCache
	 * });
	 * ```
	 */
	offlineCache?: boolean;

	/**
	 * Value in milliseconds that indicates how long a request value should keep in the offline cache
	 * @default `(1).day()`
	 */
	offlineCacheTTL?: number;

	/**
	 * List of request methods that support caching
	 * @default `['GET']`
	 */
	cacheMethods?: RequestMethod[];

	/**
	 * Unique cache identifier: it can be useful to create request factories with isolated cache storages
	 */
	cacheId?: string | symbol;

	/**
	 * A dictionary or iterable value with middleware functions:
	 * functions take an environment of request parameters and can modify theirs.
	 *
	 * Please notice that the order of middleware depends on the structure you use.
	 * Also, if at least one of the middlewares returns a function, invoking this function
	 * will be returned as the request result. It can be helpful to organize mocks of data and
	 * other similar cases when you don't want to execute a real request.
	 *
	 * @example
	 * ```js
	 * request('/users', {
	 *   middlewares: {
	 *     addAPI({globalOpts}) {
	 *       if (globalOpts.api == null) {
	 *         globalOpts.api = 'https://api.foo.com';
	 *       }
	 *     },
	 *
	 *     addSession({opts}) {
	 *       opts.headers.set('Authorization', myJWT);
	 *     }
	 *   }
	 * }).data.then(console.log);
	 *
	 * // Mocking response data
	 * request('/users', {
	 *   middlewares: [
	 *     ({ctx}) => () => ctx.wrapAsResponse([
	 *       {name: 'Bob'},
	 *       {name: 'Robert'}
	 *     ])
	 *   ]
	 * });
	 * ```
	 */
	middlewares?: Middlewares<D>;

	/**
	 * A function (or a sequence of functions) takes the current request data
	 * and returns new data to request. If you provide a sequence of functions,
	 * the first function will pass a result in the next function from the sequence, etc.
	 */
	encoder?: Encoder | Encoders;

	/**
	 * A function (or a sequence of functions) takes the current request response data
	 * and returns new data to respond. If you provide a sequence of functions,
	 * the first function will pass a result to the next function from the sequence, etc.
	 */
	decoder?: Decoder | Decoders;

	/**
	 * A function (or a sequence of functions) takes the current request response data chunk
	 * and yields a new chunk to respond via an asynchronous iterator. If you provide a sequence of functions,
	 * the first function will pass a result to the next function from the sequence, etc.
	 * This parameter is used when you're parsing responses in a stream form.
	 */
	streamDecoder?: StreamDecoder | StreamDecoders;

	/**
	 * Reviver function for `JSON.parse` or false to disable defaults.
	 * By default, it parses some strings as Date instances.
	 *
	 * @default `convertIfDate`
	 */
	jsonReviver?: JSONCb | false;

	/**
	 * A dictionary with some extra parameters for the request: is usually used with middlewares to provide
	 * domain-specific information
	 */
	meta?: RequestMeta;

	/**
	 * A meta flag that indicates that the request is important: is usually used with middlewares to indicate that
	 * the request needs to be executed as soon as possible
	 *
	 * @example
	 * ```js
	 * request('/users', {
	 *   important: true,
	 *
	 *   middlewares: {
	 *     doSomeWork({ctx}) {
	 *       if (ctx.important) {
	 *         // Do some work...
	 *       }
	 *     }
	 *   }
	 * }).data.then(console.log);
	 * ```
	 */
	important?: boolean;

	/**
	 * A request engine to use.
	 * The engine - is a simple function that takes request parameters and returns an abortable promise resolved with the
	 * `core/request/response` instance. Mind, some engines provide extra features. For instance, you can listen to upload
	 * progress events with the XHR engine. Or, you can parse responses in a stream form with the Fetch engine.
	 *
	 * @example
	 * ```js
	 * import AbortablePromise from 'core/promise/abortable';
	 *
	 * import request from 'core/request';
	 * import Response from 'core/request/response';
	 *
	 * import fetchEngine from 'core/request/engines/fetch';
	 * import xhrEngine from 'core/request/engines/xhr';
	 *
	 * request('//users', {
	 *   engine: fetchEngine,
	 *   credentials: 'omit'
	 * }).data.then(console.log);
	 *
	 * request('//users', {
	 *   engine: xhrEngine
	 * }).data.then(console.log);
	 *
	 * request('//users', {
	 *   engine: (params) => new AbortablePromise((resolve) => {
	 *     const res = new Response({
	 *       message: 'Hello world'
	 *     }, {responseType: 'object'});
	 *
	 *     resolve(res);
	 *
	 *   }, params.parent)
	 *
	 * }).data.then(console.log);
	 * ```
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

export type RequestAPIValue<T = string> = Nullable<T> | ((params: MiddlewareParams) => Nullable<T>);

/**
 * A map of API parameters.
 *
 * These parameters apply if the original request URL is not absolute, and they can be used to customize the
 * base API URL depending on the runtime environment. If you define the base API URL via
 * `config#api` or `globalOpts.api`, these parameters will be mapped on it.
 */
export interface RequestAPI {
	/**
	 * The direct value of API URL.
	 * If this parameter is defined, all other parameters will be ignored.
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
	streamDecoder?: WrappedStreamDecoder | WrappedStreamDecoders;
}

export type NormalizedCreateRequestOptions<D = unknown> = typeof defaultRequestOpts & WrappedCreateRequestOptions<D>;

export interface RequestOptions {
	readonly url: string;
	readonly method: RequestMethod;

	readonly emitter: EventEmitter;
	readonly parent: AbortablePromise;

	readonly timeout?: number;
	readonly okStatuses?: Statuses;
	readonly noContentStatuses?: Statuses;

	readonly contentType?: string;
	readonly responseType?: ResponseType;
	readonly forceResponseType?: boolean;

	readonly decoders?: WrappedDecoders;
	readonly streamDecoders?: WrappedStreamDecoders;
	readonly jsonReviver?: JSONCb | false;

	readonly meta?: RequestMeta;
	readonly headers?: Headers;
	readonly body?: RequestBody;

	readonly important?: boolean;
	readonly credentials?: boolean | RequestCredentials;
	readonly redirect?: RequestRedirect;
}

/**
 * Request engine
 */
export interface RequestEngine {
	(request: RequestOptions, params: MiddlewareParams): AbortablePromise<Response>;

	/**
	 * A flag indicates that the active requests with the same request hash can be merged
	 * @default `true`
	 */
	pendingCache?: boolean;

	/**
	 * Drops the request cache
	 *
	 * @param [recursive] - if true, then the `dropCache` operation will be propagated recursively,
	 *   for example, if an engine based on a data provider is used
	 */
	dropCache?(recursive?: boolean): void;

	/**
	 * Destroys the request engine
	 */
	destroy?(): void;
}
