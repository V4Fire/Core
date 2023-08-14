/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { ErrorDetailsExtractor, ErrorCtor } from '../../../core/error';
import RequestError from '../../../core/request/error';
import Headers, { RawHeaders } from '../../../core/request/headers';
import type { RequestErrorDetailsExtractorOptions } from '../../../core/request/error/interface';
interface FilterParams {
    include: Set<string>;
    exclude: Set<string>;
}
/**
 * Extractor to get details from `RequestError`
 */
export declare class RequestErrorDetailsExtractor implements ErrorDetailsExtractor<RequestError> {
    /** @inheritDoc */
    target: ErrorCtor<RequestError>;
    /**
     * Parameters to define which header makes its way to the result
     */
    protected headersFilterParams: FilterParams;
    constructor(opts?: RequestErrorDetailsExtractorOptions);
    /** @inheritDoc */
    extract(error: RequestError): unknown;
    /**
     * Filters the specified headers according to settings
     *
     * @see headersFilterParams
     * @param headers - headers that need to be filtered
     */
    protected prepareHeaders(headers: CanUndef<RawHeaders>): CanUndef<Headers>;
}
export {};
