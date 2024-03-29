/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import LazyPersistentEngine from '../../../../../core/cache/decorators/persistent/engines/lazy';
import LazyPersistentOfflineEngine from '../../../../../core/cache/decorators/persistent/engines/lazy-offline';
import ActivePersistentEngine from '../../../../../core/cache/decorators/persistent/engines/active';
export * from '../../../../../core/cache/decorators/persistent/interface';
declare const engines: {
    onInit: typeof ActivePersistentEngine;
    onDemand: typeof LazyPersistentEngine;
    onOfflineDemand: typeof LazyPersistentOfflineEngine;
};
export default engines;
