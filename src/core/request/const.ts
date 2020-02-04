/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import engine from 'core/request/engines';

import { AsyncFactoryResult } from 'core/kv-storage';
import { Cache, RestrictedCache, NeverCache, AbstractCache } from 'core/cache';

import { ResponseType } from 'core/request/response/interface';
import { RequestQuery, RequestMethod, GlobalOptions, CacheStrategy, RequestEngine } from 'core/request/interface';

export let
	storage: CanUndef<Promise<AsyncFactoryResult>>;

//#if runtime has core/kv-storage
storage = import('core/kv-storage').then(({asyncLocal}) => asyncLocal);
//#endif

export const
	isAbsoluteURL = /^\w*:?\/\//;

export const mimeTypes: Dictionary<ResponseType> = Object.createDict({
	'application/json': 'json',
	'application/javascript': 'text',
	'application/xml': 'document',
	'application/x-www-form-urlencoded': 'text',
	'application/x-msgpack': 'arrayBuffer',
	'application/x-protobuf': 'arrayBuffer',
	'application/vnd.google.protobuf': 'arrayBuffer'
});

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
	engine: <RequestEngine>engine
};

export const
	pendingCache = new Cache();

export const cache: Record<CacheStrategy, AbstractCache> = {
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
