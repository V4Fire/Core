/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { ConfigurableMiddleware } from 'core/log/middlewares/configurable';
import { ExtractorMiddleware } from 'core/log/middlewares/extractor';
import { ErrorsDeduplicatorMiddleware } from 'core/log/middlewares/errors-deduplicator';
import type { LogMiddleware } from 'core/log/middlewares/interface';

export { extend, Extended } from 'core/log/base';
export * from 'core/log/middlewares/interface';

/**
 * Returns a function that creates a middleware of the specified class
 * @param Ctor - constructor or just a class
 */
export function creatorFor<T extends LogMiddleware, A extends any[]>(Ctor: new (...args: A) => T): (...args: A) => T {
	return (...args) => new Ctor(...args);
}

const middlewareFactory = {
	configurable: creatorFor(ConfigurableMiddleware),
	extractor: creatorFor(ExtractorMiddleware),
	errorsDeduplicator: creatorFor(ErrorsDeduplicatorMiddleware)
};

export default middlewareFactory;
