/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import 'core/prelude/function/shim';
import extend from 'core/prelude/extend';

/** @see Function.once */
extend(Function.prototype, 'once', function (this: Function): Function {
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

/** @see Function.debounce */
extend(Function.prototype, 'debounce', function (this: Function, delay: number = 250): Function {
	const
		// tslint:disable-next-line:no-this-assignment
		fn = this;

	let
		timer;

	return function (...args: unknown[]): void {
		clearTimeout(timer);
		timer = setTimeout(() => fn.apply(this, args), delay);
	};
});

/** @see Function.throttle */
extend(Function.prototype, 'throttle', function (this: Function, delay: number = 250): Function {
	const
		// tslint:disable-next-line:no-this-assignment
		fn = this;

	let
		lastArgs,
		timer;

	return function (...args: unknown[]): void {
		lastArgs = args;

		if (timer === undefined) {
			fn.apply(this, lastArgs);

			timer = setTimeout(() => {
				timer = undefined;

				if (lastArgs !== args) {
					fn.apply(this, lastArgs);
				}
			}, delay);
		}
	};
});
