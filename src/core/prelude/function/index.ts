/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import 'core/prelude/function/shim';
import extend from 'core/prelude/extend';

//#if runtime has prelude/function/once

/** @see Sugar.Function.once */
extend(Function.prototype, 'once', function (this: Function): Function {
	const
		that = this;

	let
		called = false,
		res;

	return function (): unknown {
		if (called) {
			return res;
		}

		res = that.apply(this, arguments);
		called = true;
		return res;
	};
});

//#endif
//#if runtime has prelude/function/debounce

/** @see Sugar.Function.debounce */
extend(Function.prototype, 'debounce', function (this: Function, delay: number = 250): Function {
	const
		that = this;

	let
		timer;

	return function (...args: unknown[]): void {
		clearTimeout(timer);
		timer = setTimeout(() => that.apply(this, args), delay);
	};
});

//#endif
//#if runtime has prelude/function/throttle

/** @see Sugar.Function.debounce */
extend(Function.prototype, 'throttle', function (this: Function, delay: number = 250): Function {
	const
		that = this;

	let
		lastArgs,
		timer;

	return function (...args: unknown[]): void {
		lastArgs = args;

		if (timer !== undefined) {
			timer = setTimeout(() => {
				timer = undefined;
				that.apply(this, lastArgs);
			}, delay);
		}
	};
});

//#endif
