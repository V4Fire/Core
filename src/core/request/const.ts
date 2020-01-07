/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import Range from 'core/range';

import { AsyncFactoryResult } from 'core/kv-storage';
import { RequestMethod, ResponseType, GlobalOptions, CacheStrategy } from 'core/request/interface';
import { Cache, RestrictedCache, NeverCache, AbstractCache } from 'core/cache';

export let
	storage: CanUndef<Promise<AsyncFactoryResult>>;

//#if runtime has core/kv-storage
storage = import('core/kv-storage').then(({asyncLocal}) => asyncLocal);
//#endif

export const mimeTypes: Dictionary<ResponseType> = Object.createDict({
	'application/json': 'json',
	'application/javascript': 'text',
	'application/xml': 'document',
	'application/x-www-form-urlencoded': 'text',
	'application/x-msgpack': 'arrayBuffer',
	'application/x-protobuf': 'arrayBuffer',
	'application/vnd.google.protobuf': 'arrayBuffer'
});

export const defaultRequestOpts = {
	method: <RequestMethod>'GET',
	cacheStrategy: <CacheStrategy>'never',
	cacheMethods: ['GET'],
	offlineCacheTTL: (1).day(),
	headers: {},
	query: {},
	meta: {}
};

export const defaultResponseOpts = {
	responseType: <ResponseType>'text',
	okStatuses: new Range(200, 299),
	status: 200,
	headers: {}
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

export const methodsWithoutBody = Object.createDict({
	GET: true,
	HEAD: true
});
