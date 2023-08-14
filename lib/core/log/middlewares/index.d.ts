/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import { ConfigurableMiddleware } from '../../../core/log/middlewares/configurable';
import { ExtractorMiddleware } from '../../../core/log/middlewares/extractor';
import { ErrorsDeduplicatorMiddleware } from '../../../core/log/middlewares/errors-deduplicator';
import type { LogMiddleware } from '../../../core/log/middlewares/interface';
export { extend, Extended } from '../../../core/log/base';
export * from '../../../core/log/middlewares/interface';
/**
 * Returns a function that creates a middleware of the specified class
 * @param Ctor - constructor or just a class
 */
export declare function creatorFor<T extends LogMiddleware, A extends any[]>(Ctor: new (...args: A) => T): (...args: A) => T;
declare const middlewareFactory: {
    configurable: () => ConfigurableMiddleware;
    extractor: (...args: import("../../error").ErrorDetailsExtractor<Error>[]) => ExtractorMiddleware;
    errorsDeduplicator: () => ErrorsDeduplicatorMiddleware;
};
export default middlewareFactory;
