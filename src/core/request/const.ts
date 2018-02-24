/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import StatusCodes from 'core/statusCodes';
import { RequestMethods, ResponseTypes, GlobalOptions, CacheStrategy } from 'core/request/interface';
export { asyncLocal as storage } from 'core/kv-storage';
export { RestrictedCache } from 'core/cache';

export const defaultRequestOpts = {
	method: <RequestMethods>'GET',
	responseType: <ResponseTypes>'json',
	cacheStrategy: <CacheStrategy>'never',
	headers: {},
	query: {}
};

export const defaultResponseOpts = {
	type: <ResponseTypes>'text',
	successStatus: <sugarjs.Range>Number.range(200, 299),
	status: StatusCodes.OK,
	headers: {}
};

export const
	globalOpts: GlobalOptions = {},
	// @ts-ignore
	requestCache = new RestrictedCache();
