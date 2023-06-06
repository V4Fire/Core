/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/log/README.md]]
 * @packageDocumentation
 */

import extend from 'core/log/extensions';
import log from 'core/log/curator';

export * from 'core/log/interface';
export * from 'core/log/config';

/**
 * API for logging
 */
const logger = extend(log);
export default logger;
