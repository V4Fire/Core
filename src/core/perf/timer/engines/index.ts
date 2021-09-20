/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { log } from 'core/perf/timer/engines/console';

export * from 'core/perf/timer/engines/interface';

const engines = {
	console: log
};

export default engines;
