/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { ConfigurableMiddleware } from 'core/log/middlewares/configurable';
import { LogMiddleware } from 'core/log/middlewares/types';
export * from 'core/log/middlewares/types';

/**
 * Returns a function that creates middleware of specified class
 * @param ctor - a constructor or just a class
 */
export function creatorFor<T extends LogMiddleware>(ctor: new () => T): () => T {
	return () => new ctor();
}

const middlewareStrategy: StrictDictionary<() => LogMiddleware> = {
	configurable: creatorFor(ConfigurableMiddleware)
};

export default middlewareStrategy;
