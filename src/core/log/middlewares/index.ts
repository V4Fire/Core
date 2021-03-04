/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { ConfigurableMiddleware } from 'core/log/middlewares/configurable';
import type { LogMiddleware } from 'core/log/middlewares/interface';

export { extend, Extended } from 'core/log/base';
export * from 'core/log/middlewares/interface';

/**
 * Returns a function that creates a middleware of the specified class
 * @param Ctor - constructor or just a class
 */
export function creatorFor<T extends LogMiddleware>(Ctor: new () => T): () => T {
	return () => new Ctor();
}

const middlewareFactory = {
	configurable: creatorFor(ConfigurableMiddleware)
};

export default middlewareFactory;
