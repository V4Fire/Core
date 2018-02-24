/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import StatusCodes from 'core/statusCodes';
import { RequestMethods, ResponseTypes, GlobalOptions, Cache } from 'core/request/interface';
export { asyncLocal as storage } from 'core/kv-storage';
export { RestrictedCache } from 'core/cache';

export const defaultRequestOpts = {
	method: <RequestMethods>'GET',
	responseType: <ResponseTypes>'json',
	headers: {}
};

export const defaultResponseOpts = {
	type: <ResponseTypes>'text',
	status: StatusCodes.OK,
	headers: {}
};

export const
	globalOpts: GlobalOptions = {},
	requestCache: Cache = new RestrictedCache();
