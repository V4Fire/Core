/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { ConfigurableMiddleware } from 'core/log/loggers/configurable';
import { LogMiddleware } from 'core/log/loggers/types';
export * from 'core/log/loggers/types';

/**
 * Returns a function that creates objects of specified class
 * @param ctor - a constructor or just a class
 */
export function creatorFor<T extends LogMiddleware>(ctor: new () => T): () => T {
	return () => new ctor();
}

const middlewareStrategy: StrictDictionary<() => LogMiddleware> = {
	configurable: creatorFor(ConfigurableMiddleware)
};

export default middlewareStrategy;
