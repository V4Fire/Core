/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { ConsoleEngine } from 'core/log/engines/console';
import { LogEngine, LogEngineConstructor } from 'core/log/engines/interface.js';

export { extend, Extended } from 'core/log/base';
export * from 'core/log/engines/interface.js';

/**
 * Returns a function that creates an engine of the specified class
 * @param ctor - constructor or just a class
 */
export function creatorFor<T extends LogEngine>(ctor: LogEngineConstructor<T>): (opts?: Dictionary) => T {
	return (opts?: Dictionary) => new ctor(opts);
}

const engineFactory = {
	console: creatorFor(ConsoleEngine)
};

export default engineFactory;
