/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { CreateRequestOptions, RequestPromise, RequestResolver, RequestFunctionResponse } from '../../core/request/interface';
export * from '../../core/request/helpers';
export * from '../../core/request/interface';
export * from '../../core/request/response/helpers';
export * from '../../core/request/response/interface';
export { globalOpts, cache, pendingCache } from '../../core/request/const';
export { default as RequestError } from '../../core/request/error';
export { default as Response } from '../../core/request/response';
export default request;
/**
 * Creates a new remote request with the specified options
 *
 * @param path - request path URL
 * @param opts - request options
 *
 * @example
 * ```js
 * request('bla/get').then(({data, response}) => {
 *   console.log(data, response.status);
 * });
 * ```
 */
declare function request<D = unknown>(path: string, opts?: CreateRequestOptions<D>): RequestPromise<D>;
/**
 * Returns a wrapped request constructor with the specified options.
 * This overload helps to organize the "builder" pattern.
 *
 * @param opts - request options
 * @example
 * ```js
 * request({okStatuses: 200})({method: 'POST'})('bla/get').then(({data, response}) => {
 *   console.log(data, response.status);
 * });
 * ```
 */
declare function request<D = unknown>(opts: CreateRequestOptions<D>): typeof request;
/**
 * Returns a function to create a new remote request with the specified options.
 * This overload helps to create a factory of requests.
 *
 * @param path - request path URL
 * @param resolver - function to resolve a request: it takes a request URL, request environment, and arguments
 *   from invoking the outer function and can modify some request parameters.
 *   Also, if the function returns a new string, the string will be appended to the request URL, or
 *   if the function returns a string wrapped with an array, the string fully overrides the original URL.
 *
 * @param opts - request options
 *
 * @example
 * ```js
 * // Modifying the current URL
 * request('https://foo.com', (url, env, ...args) => args.join('/'))('bla', 'baz') // https://foo.com/bla/baz
 *
 * // Replacing the current URL
 * request('https://foo.com', () => ['https://bla.com', 'bla', 'baz'])() // https://bla.com/bla/baz
 * ```
 */
declare function request<D = unknown, A extends any[] = unknown[]>(path: string, resolver: RequestResolver<D, A>, opts?: CreateRequestOptions<D>): RequestFunctionResponse<D, A extends Array<infer V> ? V[] : unknown[]>;
