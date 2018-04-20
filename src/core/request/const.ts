/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import StatusCodes from 'core/statusCodes';
import { RequestMethods, ResponseTypes, GlobalOptions, CacheStrategy } from 'core/request/interface';
import { Cache, RestrictedCache } from 'core/cache';
export { asyncLocal as storage } from 'core/kv-storage';

export const defaultRequestOpts = {
	method: <RequestMethods>'GET',
	responseType: <ResponseTypes>'json',
	cacheStrategy: <CacheStrategy>'never',
	headers: {},
	query: {}
};

export const defaultResponseOpts = {
	responseType: <ResponseTypes>'text',
	okStatuses: <sugarjs.Range>Number.range(200, 299),
	status: StatusCodes.OK,
	headers: {}
};

export const
	globalOpts: GlobalOptions = {api: config.api},
	globalCache = new RestrictedCache(),
	pendingCache = new Cache(),
	sharedCache: Dictionary<Cache> = {};
