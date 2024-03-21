/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/cache/decorators/ttl/README.md]]
 * @packageDocumentation
 */
import type Cache from '../../../../core/cache/interface';
import { CacheWithEmitter } from '../../../../core/cache/decorators/helpers/add-emitter';
import type { TTLCache } from '../../../../core/cache/decorators/ttl/interface';
export * from '../../../../core/cache/decorators/ttl/interface';
/**
 * Wraps the specified cache object to add a feature of the cache expiring
 *
 * @typeparam V - value type of the cache object
 * @typeparam K - key type of the cache object
 *
 * @param cache - cache object to wrap
 * @param ttl - default ttl value in milliseconds
 *
 * @example
 * ```typescript
 * import addTTL from '../../../../core/cache/decorators/ttl';
 * import SimpleCache from '../../../../core/cache/simple';
 *
 * const
 *   cache = addTTL(new SimpleCache(), (10).seconds());
 *
 * cache.add('foo', 'bar1', {ttl: 0.5.seconds()});
 * cache.add('foo2', 'bar2');
 * ```
 */
export default function addTTL<T extends Cache<V, K>, V = unknown, K extends string = string>(cache: T, ttl?: number): TTLCache<V, K, CacheWithEmitter<V, K, T>>;
