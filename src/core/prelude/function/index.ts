/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import 'core/prelude/function/shim';
import extend from 'core/prelude/extend';

/**
 * Returns a new function that allows to invoke the target function only once
 */
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

//#if runtime has prelude/function/debounce

/**
 * Returns a new function that allows to invoke the target function only with the specified delay.
 * The next invocation of the function will cancel the previous.
 *
 * @param [delay]
 */
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

//#endif
//#if runtime has prelude/function/throttle

/**
 * Returns a new function that allows to invoke the target function not more often than the specified delay
 * @param [delay]
 */
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

//#endif
