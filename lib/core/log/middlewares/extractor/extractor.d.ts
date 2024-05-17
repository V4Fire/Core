/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { ErrorDetailsExtractor, ErrorCtor } from '../../../../core/error';
import type { LogEvent, LogMiddleware, NextCallback } from '../../../../core/log/middlewares/interface';
import type { ErrorInfo } from '../../../../core/log/middlewares/extractor/interface';
/**
 * Middleware to extract information from an error log event and store
 * it within the `additionals` dictionary of the event
 */
export declare class ExtractorMiddleware implements LogMiddleware {
    extractorsMap: Map<ErrorCtor<Error>, ErrorDetailsExtractor<Error>>;
    constructor(...extractors: Array<ErrorDetailsExtractor<Error>>);
    /** @inheritDoc */
    exec(events: CanArray<LogEvent>, next: NextCallback): void;
    /**
     * Extracts error's details from the passed log event and stores it within the `additionals.error` property
     * @param event - log event from a pipeline
     */
    protected processEvent(event: LogEvent): LogEvent;
    /**
     * Returns an error's info structure
     *
     * @param error - error, which details should be returned
     * @param isRoot - if false then adds `name` and `message` of the passed error to its info
     * @param depthLimit - maximum depth of nested errors
     */
    protected generateErrorInfo(error: Error, isRoot?: boolean, depthLimit?: number): ErrorInfo;
}
