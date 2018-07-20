/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import StatusCodes from 'core/statusCodes';
import config from 'config';

import { RequestMethods, ResponseTypes, GlobalOptions, CacheStrategy } from 'core/request/interface';
import { Cache, RestrictedCache, NeverCache } from 'core/cache';
export { asyncLocal as storage } from 'core/kv-storage';

export const defaultRequestOpts = {
	method: <RequestMethods>'GET',
	responseType: <ResponseTypes>'json',
	cacheStrategy: <CacheStrategy>'never',
	offlineCacheTTL: (1).day(),
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
	pendingCache = new Cache();

export const cache: Record<CacheStrategy, Cache> = {
	queue: new RestrictedCache(),
	forever: new Cache(),
	never: new NeverCache()
};

export const globalOpts: GlobalOptions = {
	get api(): string | undefined {
		return config.api;
	},

	set api(value: string | undefined) {
		config.api = value;
	},

	meta: {}
};

/**
 * Drops all request caches
 */
export function dropCache(): void {
	$C(cache).forEach((cache) => cache.clear());
	pendingCache.clear();
}
