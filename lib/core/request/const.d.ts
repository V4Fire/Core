/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { toQueryString } from '../../core/url';
import { Cache, AbstractCache } from '../../core/cache';
import type { AsyncStorage } from '../../core/kv-storage';
import type { RawHeaders } from '../../core/request/headers';
import type { RequestEngine, RequestMethod, RequestQuery, RequestResponse, GlobalOptions, CacheStrategy } from '../../core/request/interface';
export declare let storage: CanUndef<Promise<AsyncStorage>>;
export declare const isAbsoluteURL: RegExp;
export declare const caches: Set<AbstractCache<unknown, string>>, pendingCache: Cache<RequestResponse<unknown>, string>;
export declare const cache: Record<Exclude<CacheStrategy, AbstractCache | Promise<AbstractCache>>, AbstractCache>;
export declare const globalOpts: GlobalOptions;
export declare const methodsWithoutBody: Pick<{
    GET: boolean;
    HEAD: boolean;
}, "GET" | "HEAD">;
export declare const defaultRequestOpts: {
    engine: RequestEngine;
    method: RequestMethod;
    cacheStrategy: CacheStrategy;
    cacheMethods: RequestMethod[];
    offlineCacheTTL: number;
    headers: RawHeaders;
    meta: Dictionary<unknown>;
    query: RequestQuery;
    querySerializer: typeof toQueryString;
};
