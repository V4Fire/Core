/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

import { isDictionary } from 'core/prelude/types';

/** @see [[Function.addToPrototype]] */
export const addToPrototype = extend(Function.prototype, 'addToPrototype', function addToPrototype(
	this: AnyFunction,
	...args: Array<Dictionary<Function> | Function>
): AnyFunction {
	const
		{prototype} = this;

	for (let i = 0; i < args.length; i++) {
		const
			arg = args[i];

		if (isDictionary(arg)) {
			Object.assign(prototype, arg);

		} else {
			prototype[arg.name] = arg;
		}
	}

	return this;
});
