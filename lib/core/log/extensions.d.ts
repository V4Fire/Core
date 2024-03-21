/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Logger, ExtendedLogger } from '../../core/log/interface';
declare const extend: (func: Logger) => ExtendedLogger;
export default extend;
