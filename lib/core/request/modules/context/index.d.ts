/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { RequestResolver } from '../../../../core/request/interface';
import Super from '../../../../core/request/modules/context/modules/middlewares';
/**
 * Context of a request
 * @typeparam D - response data
 */
export default class RequestContext<D = unknown> extends Super<D> {
    /**
     * Forks the specified request context and decorates it with additional parameters
     *
     * @param ctx
     * @param path - request path URL
     * @param resolver - function to resolve a request
     * @param args - additional arguments for the resolver
     */
    static decorateContext<CTX extends RequestContext<any>>(ctx: CTX, path: string, resolver?: RequestResolver, ...args: unknown[]): CTX;
}
