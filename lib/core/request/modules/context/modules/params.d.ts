/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type AbortablePromise from '../../../../../core/promise/abortable';
import type { ControllablePromise } from '../../../../../core/promise';
import type { AbstractCache } from '../../../../../core/cache';
import Headers from '../../../../../core/request/headers';
import type { NormalizedCreateRequestOptions, RequestQuery, RequestResponse, WrappedEncoders, WrappedDecoders, WrappedStreamDecoders } from '../../../../../core/request/interface';
export declare const $$: StrictDictionary<symbol>;
export default class RequestContext<D = unknown> {
    /**
     * Promise that resolves when the instance is already initialized
     */
    readonly isReady: Promise<void>;
    /**
     * True if the request can be cached
     */
    readonly canCache: boolean;
    /**
     * String key to cache the request
     */
    get cacheKey(): CanUndef<string>;
    /**
     * Sets a new string key to cache the request
     */
    protected set cacheKey(value: CanUndef<string>);
    /**
     * Storage to cache the resolved request
     */
    readonly cache: AbstractCache<Nullable<D>>;
    /**
     * Storage to cache the request while it is pending a response
     */
    readonly pendingCache: AbstractCache<ControllablePromise<RequestResponse<D>> | RequestResponse<D>>;
    /**
     * True if the request can provide parameters only as a query string
     */
    readonly withoutBody: boolean;
    /**
     * Request parameters
     */
    readonly params: NormalizedCreateRequestOptions<D>;
    /**
     * Alias for `params.query`
     * @alias
     */
    get query(): RequestQuery;
    /**
     * Alias for `params.headers`
     * @alias
     */
    get headers(): Headers;
    /**
     * Sequence of request data encoders
     */
    get encoders(): WrappedEncoders;
    /**
     * Sets a new sequence of request data encoders
     */
    protected set encoders(value: WrappedEncoders);
    /**
     * Sequence of response data decoders
     */
    get decoders(): WrappedDecoders;
    /**
     * Sets a new sequence of response data decoders
     */
    protected set decoders(value: WrappedDecoders);
    /**
     * Sequence of response data decoders
     */
    get streamDecoders(): WrappedStreamDecoders;
    /**
     * Sets a new sequence of response data decoders
     */
    protected set streamDecoders(value: WrappedStreamDecoders);
    /**
     * Link to a parent operation promise
     */
    parent: AbortablePromise;
    /**
     * Cache TTL identifier
     */
    protected cacheTimeoutId?: number;
    /**
     * @param [params] - request parameters
     */
    constructor(params?: NormalizedCreateRequestOptions<D>);
}
