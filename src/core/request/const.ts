/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import statusCodes from 'core/status-codes';
import Range from 'core/range';

import { RequestMethods, ResponseTypes, GlobalOptions, CacheStrategy } from 'core/request/interface';
import { Cache, RestrictedCache, NeverCache } from 'core/cache';
export { asyncLocal as storage } from 'core/kv-storage';

export const mimeTypes: Dictionary<ResponseTypes> = Object.createDict<any>({
	'application/json': 'json',
	'application/javascript': 'text',
	'application/xml': 'document',
	'application/x-www-form-urlencoded': 'text'
});

export const defaultRequestOpts = {
	method: <RequestMethods>'GET',
	cacheStrategy: <CacheStrategy>'never',
	offlineCacheTTL: (1).day(),
	headers: {},
	query: {}
};

export const defaultResponseOpts = {
	responseType: <ResponseTypes>'text',
	okStatuses: new Range(200, 299),
	status: statusCodes.OK,
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
	get api(): CanUndef<string> {
		return config.api;
	},

	set api(value: CanUndef<string>) {
		config.api = value;
	},

	meta: {}
};

/**
 * Drops all request caches
 */
export function dropCache(): void {
	for (let keys = Object.keys(cache), i = 0; i < keys.length; i++) {
		cache[keys[i]].clear();
	}
}
