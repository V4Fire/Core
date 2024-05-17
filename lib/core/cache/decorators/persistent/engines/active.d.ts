/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type Cache from '../../../../../core/cache/interface';
import { UncheckablePersistentEngine } from '../../../../../core/cache/decorators/persistent/engines/interface';
export default class ActivePersistentEngine<V> extends UncheckablePersistentEngine<V> {
    /**
     * Index with keys and TTL-s of stored values
     */
    protected ttlIndex: Dictionary<number>;
    initCache(cache: Cache<V>): Promise<void>;
    set(key: string, value: V, ttl?: number): Promise<void>;
    remove(key: string): Promise<void>;
    getTTLFrom(key: string): Promise<CanUndef<number>>;
    removeTTLFrom(key: string): Promise<boolean>;
    getCheckStorageState(): CanPromise<{
        available: false;
        checked: boolean;
    }>;
}
