/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/log/middlewares/extractor/README.md]]
 * @packageDocumentation
 */
import type { LogEvent, LogMiddleware, NextCallback } from '../../../../core/log/middlewares/interface';
/**
 * Middleware to omit duplicated errors
 */
export declare class ErrorsDeduplicatorMiddleware implements LogMiddleware {
    /**
     * Errors that have already been occurred
     */
    protected errorsDoubles: WeakSet<Error>;
    /** @inheritDoc */
    exec(events: CanArray<LogEvent>, next: NextCallback): void;
    /**
     * Returns true if the passed event has an error that's already occurred
     * @param event - log event from a pipeline
     */
    protected omitEvent(event: LogEvent): boolean;
}
