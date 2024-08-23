/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export * from '../../core/log/interface';
export * from '../../core/log/config';
/**
 * API for logging
 * @defaultExport
 */
declare const logger: import("./interface").ExtendedLogger;
export default logger;
