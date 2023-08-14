/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { LogStylesConfig, StylesCache } from '../../../core/log/config';
import type { LogEvent } from '../../../core/log/middlewares';
import type { LogLevel } from '../../../core/log/interface';
import type { LogEngine } from '../../../core/log/engines/interface';
export declare class ConsoleEngine implements LogEngine {
    protected stylesCache?: StylesCache;
    protected stringifiedStylesCache: Dictionary<string>;
    constructor(styles?: LogStylesConfig);
    /**
     * Prints the specified event to a console
     * @param event - log event to print
     */
    log(event: LogEvent): void;
    /**
     * Returns a string representing of a style for the specified log level
     * @param logLevel - level of logging that needs a style
     */
    protected getStringifiedStyle(logLevel: LogLevel): string;
}
