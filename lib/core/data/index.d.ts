/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/data/README.md]]
 * @packageDocumentation
 */
import type { Middlewares, RequestPromise, RequestResponse } from '../../core/request';
import DefaultProvider from '../../core/data/modules/base';
import type { ProviderOptions } from '../../core/data/interface';
export * from '../../core/data/const';
export * from '../../core/data/decorators';
export * from '../../core/data/middlewares';
export * from '../../core/data/interface';
export { Socket } from '../../core/socket';
export { globalOpts, CreateRequestOptions, CacheStrategy, RequestQuery, RequestMethod, Middlewares, MiddlewareParams, RequestPromise, RequestResponse, RequestResponseObject, RequestFunctionResponse, Response, RequestBody, RequestError } from '../../core/request';
/**
 * Default data provider
 */
export default class Provider extends DefaultProvider {
    static readonly middlewares: Middlewares;
    /**
     * Borrows API from the specified `RequestPromise` object to the passed `RequestResponse` object and returns it
     *
     * @param from
     * @param to
     */
    static borrowRequestPromiseAPI<T>(from: RequestPromise<T>, to: RequestResponse<T>): RequestPromise<T>;
    /** @override */
    constructor(opts?: ProviderOptions);
}
