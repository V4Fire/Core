/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Range from 'core/range';
import statusCodes from 'core/status-codes';
import type { ResponseType } from 'core/request';

export const defaultResponseOpts = {
	responseType: <ResponseType>'text',
	url: '',
	okStatuses: new Range(200, 299),
	status: 200,
	statusText: 'OK',
	headers: {}
};

/**
 * Status codes that cannot contain any content according to the HTTP standard
 *
 * 1xx - https://tools.ietf.org/html/rfc7231#section-6.2
 * 204 - https://tools.ietf.org/html/rfc7231#section-6.3.5
 * 304 - https://tools.ietf.org/html/rfc7232#section-4.1
 */
export const noContentStatusCodes: number[] =
	[statusCodes.NO_CONTENT, statusCodes.NOT_MODIFIED]
		.concat(new Range<number>(100, 199).toArray(1));
