/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see Function.once */
extend(Function.prototype, 'once', function (this: AnyFunction): AnyFunction {
	const
		// tslint:disable-next-line:no-this-assignment
		fn = this;

	let
		called = false,
		res;

	return function (): unknown {
		if (called) {
			return res;
		}

		res = fn.apply(this, arguments);
		called = true;
		return res;
	};
});

/** @see FunctionConstructor.once */
extend(Function, 'once', (fn: AnyFunction) => fn.once());
