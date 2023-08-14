/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import Response, { ResponseTypeValue } from '../../../../../core/request/response';
import Super from '../../../../../core/request/modules/context/modules/methods';
import type { RequestResponse, RequestResponseObject } from '../../../../../core/request/interface';
export default class RequestContext<D = unknown> extends Super<D> {
    /**
     * Wraps the specified promise: attaches the pending cache, etc.
     * @param promise
     */
    wrapRequest(promise: RequestResponse<D>): RequestResponse<D>;
    /**
     * Middleware to cache a response object
     * @param resObj - response object
     */
    saveCache(resObj: RequestResponseObject<D>): Promise<RequestResponseObject<D>>;
    /**
     * A middleware to wrap the specified response value with `RequestResponseObject`.
     * Use it when wrapping some raw data as the `core/request` response.
     *
     * @param value
     */
    wrapAsResponse(value: Response<D> | ResponseTypeValue): RequestResponseObject<D>;
}
