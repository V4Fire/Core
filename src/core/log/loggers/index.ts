/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import configurableLogger from 'core/log/loggers/log';
import immediateLogger from 'core/log/loggers/immediate';

const loggersStrategy = {
	configurableLogger,
	immediateLogger
};

export default loggersStrategy;
