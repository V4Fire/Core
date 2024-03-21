/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { LogMessageOptions } from '../../../core/log/interface';
/**
 * Sends data to every logging pipeline
 *
 * @param context
 * @param details
 */
export default function log(context: string | LogMessageOptions, ...details: unknown[]): void;
