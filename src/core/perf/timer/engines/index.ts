/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { log } from 'core/perf/timer/engines/console';
import type { PerfTimerEngine } from 'core/perf/timer/engines/interface';

export * from 'core/perf/timer/engines/interface';

const engines: Dictionary<PerfTimerEngine> = {
	console: log
};

export default engines;
