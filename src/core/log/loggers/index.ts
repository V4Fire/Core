/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import configurableLogger from 'core/log/loggers/configurable';
import immediateLogger from 'core/log/loggers/immediate';
import { InternalLogger } from 'core/log/loggers/types';
export * from 'core/log/loggers/types';

const loggersStrategy: StrictDictionary<InternalLogger> = {
	configurableLogger,
	immediateLogger
};

export default loggersStrategy;
