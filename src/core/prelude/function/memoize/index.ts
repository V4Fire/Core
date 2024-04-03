/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see [[Function.once]] */
extend(Function.prototype, 'once', function once(this: AnyFunction): AnyFunction {
	const
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		fn = this;

	let
		called = false,
		res;

	Object.defineProperty(wrapper, 'cancelOnce', {
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

/** @see [[Function.cancelOnce]] */
extend(Function.prototype, 'cancelOnce', () => undefined);

/** @see [[FunctionConstructor.once]] */
extend(Function, 'once', (fn: AnyFunction) => fn.once());

/** @see [[FunctionConstructor.cancelOnce]] */
extend(Function, 'cancelOnce', (fn: AnyFunction) => fn.cancelOnce());
