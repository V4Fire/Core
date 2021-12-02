/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import LazyPersistentEngine from '@src/core/cache/decorators/persistent/engines/lazy';
import LazyPersistentOfflineEngine from '@src/core/cache/decorators/persistent/engines/lazy-offline';
import ActivePersistentEngine from '@src/core/cache/decorators/persistent/engines/active';

export * from '@src/core/cache/decorators/persistent/interface';

const engines = {
	onInit: ActivePersistentEngine,
	onDemand: LazyPersistentEngine,
	onOfflineDemand: LazyPersistentOfflineEngine
};

export default engines;
