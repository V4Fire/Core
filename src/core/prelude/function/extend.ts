/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see [[Function.addToPrototype]] */
extend(Function.prototype, 'addToPrototype', function option(
	this: AnyFunction,
	...args: Array<Dictionary<Function> | Function>
): AnyFunction {
	const
		{prototype} = this;

	for (let i = 0; i < args.length; i++) {
		const
			arg = args[i];

		if (Object.isDictionary(arg)) {
			Object.assign(prototype, arg);

		} else {
			prototype[arg.name] = arg;
		}
	}

	return this;
});
