/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import LazyPersistentEngine from '../../../../../core/cache/decorators/persistent/engines/lazy';
import type { StorageCheckState } from '../../../../../core/cache/decorators/persistent/engines/interface';
export default class LazyPersistentOfflineEngine<V> extends LazyPersistentEngine<V> {
    getCheckStorageState(): Promise<StorageCheckState>;
}
