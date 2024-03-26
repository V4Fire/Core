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

	Object.defineProperty(wrapper, 'clearOnce', {
		configurable: true,
		enumerable: false,
		writable: true,
		value: () => {
			called = false;
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

/** @see [[Function.clearOnce]] */
extend(Function.prototype, 'clearOnce', () => undefined);

/** @see [[FunctionConstructor.once]] */
extend(Function, 'once', (fn: AnyFunction) => fn.once());

/** @see [[FunctionConstructor.clearOnce]] */
extend(Function, 'clearOnce', (fn: AnyFunction) => fn.clearOnce());
