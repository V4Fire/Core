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

import extend from '@src/core/log/extensions';
import log from '@src/core/log/curator';

export * from '@src/core/log/interface';
export * from '@src/core/log/config';

/**
 * API for logging
 * @defaultExport
 */
const logger = extend(log);
export default logger;
