/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { CheckablePersistentEngine, StorageCheckState } from '../../../../../core/cache/decorators/persistent/engines/interface';
export default class LazyPersistentEngine<V> extends CheckablePersistentEngine<V> {
    get<T>(key: string): Promise<CanUndef<T>>;
    set(key: string, value: V, ttl?: number): Promise<void>;
    remove(key: string): Promise<void>;
    getTTLFrom(key: string): Promise<CanUndef<number>>;
    removeTTLFrom(key: string): Promise<boolean>;
    getCheckStorageState(): CanPromise<StorageCheckState>;
}
