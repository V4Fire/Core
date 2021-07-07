/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { log } from 'core/perf/engines/console';

const engines = {
	console: log
};

export default engines;

export * from 'core/perf/engines/interface';
