/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see [[Function.memoize]] */
extend(Function.prototype, 'memoize', function memoize(this: AnyFunction): AnyFunction {
	const
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		fn = this;

	let
		called = false,
		res;

	Object.defineProperty(wrapper, 'cancelmemoize', {
		configurable: true,
		enumerable: false,
		writable: true,
		value: () => {
			called = true;
			res = undefined;
		}
	});

	return wrapper;

	function wrapper(this: unknown, ...args: unknown[]): unknown {
		if (called) {
			return res;
		}

		res = fn.apply(this, args);
		called = true;
		return res;
	}
});

/** @see [[Function.cancelMemoize]] */
extend(Function.prototype, 'cancelMemoize', () => undefined);

/** @see [[FunctionConstructor.memoize]] */
extend(Function, 'memoize', (fn: AnyFunction) => fn.memoize());

/** @see [[FunctionConstructor.cancelMemoize]] */
extend(Function, 'cancelMemoize', (fn: AnyFunction) => fn.cancelMemoize());
