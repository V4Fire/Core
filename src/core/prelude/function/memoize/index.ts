/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see [[Function.once]] */
extend(Function.prototype, 'once', function once(this: AnyFunction, ...args: unknown[]): AnyFunction {
	const
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		fn = this;

	let
		called = false,
		res;

	return function wrapper(this: unknown): unknown {
		if (called) {
			return res;
		}

		res = fn.apply(this, args);
		called = true;
		return res;
	};
});

/** @see [[FunctionConstructor.once]] */
extend(Function, 'once', (fn: AnyFunction) => fn.once());
