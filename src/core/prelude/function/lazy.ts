/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see Function.debounce */
extend(Function.prototype, 'debounce', function (this: AnyFunction, delay: number = 250): AnyFunction {
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

/** @see FunctionConstructor.debounce */
extend(Function, 'debounce', (fn: AnyFunction | number, delay?: number) => {
	if (Object.isNumber(fn)) {
		delay = fn;
		return (fn) => Function.debounce(fn, delay);
	}

	return fn.debounce(delay);
});

/** @see Function.throttle */
extend(Function.prototype, 'throttle', function (this: AnyFunction, delay: number = 250): AnyFunction {
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

/** @see FunctionConstructor.throttle */
extend(Function, 'throttle', (fn: AnyFunction | number, delay?: number) => {
	if (Object.isNumber(fn)) {
		delay = fn;
		return (fn) => Function.throttle(fn, delay);
	}

	return fn.throttle(delay);
});
