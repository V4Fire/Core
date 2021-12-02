/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from '@src/config';

import { memoize } from '@src/core/promise/sync';
import { toQueryString } from '@src/core/url';

import { Cache, RestrictedCache, NeverCache, AbstractCache } from '@src/core/cache';
import type { AsyncStorage } from '@src/core/kv-storage';

import engine from '@src/core/request/engines';

import type {

	RequestQuery,
	RequestMethod,
	RequestEngine,
	RequestResponse,

	GlobalOptions,
	CacheStrategy

} from '@src/core/request/interface';

// eslint-disable-next-line import/no-mutable-exports
export let storage: CanUndef<Promise<AsyncStorage>>;

//#if runtime has core/kv-storage
// eslint-disable-next-line prefer-const
storage = memoize(import('@src/core/kv-storage').then(({asyncLocal}) => asyncLocal.namespace('[[REQUEST]]')));
//#endif

export const
	isAbsoluteURL = /^\w*:?\/\//;

export const
	caches = new Set<AbstractCache>(),
	pendingCache = new Cache<RequestResponse>();

export const cache: Record<Exclude<CacheStrategy, AbstractCache | Promise<AbstractCache>>, AbstractCache> = {
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

export const methodsWithoutBody = Object.createDict({
	GET: true,
	HEAD: true
});

export const defaultRequestOpts = {
	method: <RequestMethod>'GET',
	cacheStrategy: <CacheStrategy>'never',
	cacheMethods: <RequestMethod[]>['GET'],
	offlineCacheTTL: (1).day(),
	headers: <Dictionary<CanArray<string>>>{},
	query: <RequestQuery>{},
	meta: <Dictionary>{},
	engine: <RequestEngine>engine,
	querySerializer: toQueryString
};
