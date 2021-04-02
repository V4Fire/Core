/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import LazyEngine from 'core/cache/decorators/persistent/engines/lazy';
import LazyOfflineEngine from 'core/cache/decorators/persistent/engines/lazy-offline';
import ActiveEngine from 'core/cache/decorators/persistent/engines/active';

export * from 'core/cache/decorators/persistent/interface';

const engines = {
	onInit: ActiveEngine,
	onDemand: LazyEngine,
	onOfflineDemand: LazyOfflineEngine
};

export default engines;
