/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import Range from '../../../core/range';
import type { ResponseType } from '../../../core/request';
export declare const defaultResponseOpts: {
    url: string;
    redirected: boolean;
    status: number;
    statusText: string;
    okStatuses: Range<import("../../range").RangeValue>;
    responseType: ResponseType;
    headers: {};
};
/**
 * Status codes that cannot contain any content according to the HTTP standard
 *
 * 1xx - https://tools.ietf.org/html/rfc7231#section-6.2
 * 204 - https://tools.ietf.org/html/rfc7231#section-6.3.5
 * 304 - https://tools.ietf.org/html/rfc7232#section-4.1
 */
export declare const noContentStatusCodes: number[];
