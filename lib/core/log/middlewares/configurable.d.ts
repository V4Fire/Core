/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { LogEvent, LogMiddleware, NextCallback } from '../../../core/log/middlewares/interface';
export declare class ConfigurableMiddleware implements LogMiddleware {
    protected queue: LogEvent[];
    exec(events: CanArray<LogEvent>, next: NextCallback): void;
    /**
     * Returns true if config patterns allow to log a record with the specified context
     * @param context
     */
    protected filterContext(context: string): boolean;
}
