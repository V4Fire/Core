/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PerfGroup } from 'core/perf/const';
import type { PerfTimer } from 'core/perf/timer/impl';

export { PerfGroup } from 'core/perf/const';

export interface Perf {
	getTimer(group: PerfGroup): PerfTimer;
}
