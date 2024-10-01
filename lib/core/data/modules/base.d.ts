/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import Async from '../../../core/async';
import { Socket } from '../../../core/socket';
import { CreateRequestOptions, MiddlewareParams, RequestQuery, RequestMethod, RequestBody, RequestPromise, ResolverResult, RequestFunctionResponse } from '../../../core/request';
import type { Provider as IProvider, ProviderOptions, ModelMethod } from '../../../core/data/interface';
import ParamsProvider from '../../../core/data/modules/params';
export * from '../../../core/data/modules/params';
export declare const $$: StrictDictionary<symbol>;
export default abstract class Provider extends ParamsProvider implements IProvider {
    /**
     * Cache identifier
     */
    readonly cacheId: string;
    /** @inheritDoc */
    readonly alias?: string;
    /** @inheritDoc */
    readonly emitter: EventEmitter;
    /** @inheritDoc */
    readonly params: ProviderOptions;
    /** @inheritDoc */
    get providerName(): string;
    /** @inheritDoc */
    get event(): EventEmitter;
    /**
     * API for asynchronous operations
     */
    protected readonly async: Async;
    /**
     * Socket connection
     */
    protected connection?: Promise<Socket>;
    /**
     * @param [opts] - additional options
     */
    protected constructor(opts?: ProviderOptions);
    /**
     * Returns a key to the class instance cache
     * @param [paramsForCache]
     */
    getCacheKey(paramsForCache?: ProviderOptions): string;
    /**
     * Returns an object with authentication parameters
     * @param _params - additional parameters
     */
    getAuthParams(_params: unknown): Promise<Dictionary>;
    /**
     * Function to resolve a request: it takes a request URL and request environment
     * and can modify some request parameters.
     *
     * Also, if the function returns a new string, the string will be appended to the request URL, or
     * if the function returns a string that wrapped with an array, the string fully override the original URL.
     *
     * @see [[RequestResolver]]
     * @param url - request URL
     * @param params - request parameters
     */
    resolver<T = unknown>(url: string, params: MiddlewareParams<T>): ResolverResult;
    /**
     * Connects to a socket server and returns the connection
     * @param [opts] - additional options for the server
     */
    connect(opts?: Dictionary): Promise<Socket>;
    /** @inheritDoc */
    name(): CanUndef<ModelMethod>;
    /** @inheritDoc */
    name(value: ModelMethod): Provider;
    /** @inheritDoc */
    method(): CanUndef<RequestMethod>;
    /** @inheritDoc */
    method(value: RequestMethod): Provider;
    /** @inheritDoc */
    base(): string;
    /** @inheritDoc */
    base(value: string): Provider;
    /** @inheritDoc */
    url(): string;
    /** @inheritDoc */
    url(value: string): Provider;
    /** @inheritDoc */
    dropCache(recursive?: boolean): void;
    /** @inheritDoc */
    destroy(): void;
    /** @inheritDoc */
    get<D = unknown>(query?: RequestQuery, opts?: CreateRequestOptions<D>): RequestPromise<D>;
    /** @inheritDoc */
    peek<D = unknown>(query?: RequestQuery, opts?: CreateRequestOptions<D>): RequestPromise<D>;
    /** @inheritDoc */
    post<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestPromise<D>;
    /** @inheritDoc */
    add<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestPromise<D>;
    /** @inheritDoc */
    update<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestPromise<D>;
    /** @inheritDoc */
    delete<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestPromise<D>;
    /**
     * Returns full request URL by the specified URL chunks
     *
     * @param [baseURL]
     * @param [advURL]
     */
    protected resolveURL(baseURL?: Nullable<string>, advURL?: Nullable<string>): string;
    /**
     * Sets a readonly value by the specified key to the current provider
     */
    protected setReadonlyParam(key: string, val: unknown): void;
    /**
     * Returns an event cache key by the specified parameters
     *
     * @param event - event name
     * @param data - event data
     */
    protected getEventKey(event: string, data: unknown): unknown;
    /**
     * Returns an object with request options by the specified model name and object with additional parameters
     *
     * @param method - model method
     * @param [params] - additional parameters
     */
    protected getRequestOptions<D = unknown>(method: ModelMethod, params?: CreateRequestOptions<D>): CreateRequestOptions<D>;
    /**
     * Updates the specified request with adding caching, etc.
     *
     * @param url - request url
     * @param factory - request factory
     */
    protected updateRequest<D = unknown>(url: string, factory: RequestFunctionResponse<D>): RequestPromise<D>;
    /**
     * Updates the specified request with adding caching, etc.
     *
     * @param url - request url
     * @param event - event name that is fired after resolving of the request
     * @param factory - request factory
     */
    protected updateRequest<D = unknown>(url: string, event: string, factory: RequestFunctionResponse<D>): RequestPromise<D>;
    /**
     * Initializes the socket behaviour after successful connecting
     */
    protected initSocketBehaviour(): Promise<void>;
}
