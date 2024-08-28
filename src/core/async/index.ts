/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/async/README.md]]
 * @packageDocumentation
 */

import Super from 'core/async/core/core';
import Wrappers from 'core/async/wrappers';

export * from 'core/async/const';
export * from 'core/async/interface';
export * from 'core/async/wrappers';
export * from 'core/async/helpers';

interface Async<CTX extends object = Async<any>> extends Wrappers<CTX> {}

class Async<CTX extends object = Async<any>> extends Super<CTX> {}

export default Async;

borrowAPI(Wrappers);

function borrowAPI(target: Function) {
	if (target !== Super) {
		borrowAPI(Object.getPrototypeOf(target.prototype).constructor);
	}

	Object.entries(Object.getOwnPropertyDescriptors(target.prototype)).forEach(([name, desc]) => {
		if (name === 'constructor') {
			return;
		}

		Object.defineProperty(Async.prototype, name, desc);
	});
}
