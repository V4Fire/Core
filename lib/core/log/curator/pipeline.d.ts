/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { LogEvent, LogMiddleware } from '../../../core/log/middlewares';
import type { LogEngine } from '../../../core/log/engines';
import type { LogLevel } from '../../../core/log/interface';
export declare class LogPipeline {
    protected engine: LogEngine;
    protected middlewares: LogMiddleware[];
    protected nextCallback: (events: CanArray<LogEvent>) => void;
    protected middlewareIndex: number;
    protected minLevel: LogLevel;
    constructor(engine: LogEngine, middlewares: LogMiddleware[], minLevel: LogLevel);
    /**
     * Carries events through a chain of middlewares and passes them to the engine in the end
     * @param events
     */
    run(events: CanArray<LogEvent>): void;
    protected next(events: CanArray<LogEvent>): void;
}
