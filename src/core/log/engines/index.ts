/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { ConsoleEngine } from 'core/log/engines/console';
import { LogEngine } from 'core/log/engines/types';
export * from 'core/log/engines/types';

/**
 * Returns a function that creates engine of specified class
 * @param ctor - a constructor or just a class
 */
export function creatorFor<T extends LogEngine>(ctor: new () => T): () => T {
	return () => new ctor();
}

const engineStrategy: StrictDictionary<() => LogEngine> = {
	console: creatorFor(ConsoleEngine)
};

export default engineStrategy;
