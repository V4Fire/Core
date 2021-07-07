/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as env from 'core/env';

function setFilters(): void {
	// TODO
}

env.get('perf').then(setFilters, setFilters);
env.emitter.on('set.log', setFilters);
env.emitter.on('remove.log', setFilters);
