/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/data/middlewares/attach-status/README.md]]
 *
 * @packageDocumentation
 */

import type { Response, MiddlewareParams } from 'core/request';
import type { DataWithStatus } from 'core/data/middlewares/attach-status/interface';

export * from 'core/data/middlewares/attach-status/interface';

/**
 * Decoder: attaches a response status to response data
 *
 * @param data
 * @param params
 * @param response
 */
export function attachStatus<D>(data: D, params: MiddlewareParams<D>, response: Response<D>): DataWithStatus<D> {
	return {
		data,
		status: response.status
	};
}
