/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

import { isNumber } from 'core/prelude/types';

/** @see [[Function.debounce]] */
export const debounce = extend(Function.prototype, 'debounce', function debounce(this: AnyFunction, delay: number = 250): AnyFunction {
	const
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		fn = this;

	let
		timer;

	return function wrapper(this: unknown, ...args: unknown[]): void {
		const
			cb = () => fn.apply(this, args);

		if (delay === 0) {
			clearImmediate(timer);
			timer = setImmediate(cb);

		} else {
			clearTimeout(timer);
			timer = setTimeout(cb, delay);
		}
	};
});

/** @see [[Function.throttle]] */
export const throttle = extend(Function.prototype, 'throttle', function throttle(
	this: AnyFunction,
	delayOrOpts?: number | ThrottleOptions
): AnyFunction {
	let
		opts: ThrottleOptions = {};

	if (isNumber(delayOrOpts)) {
		opts.delay = delayOrOpts;

	} else {
		opts = {...delayOrOpts};
	}

	opts.delay = opts.delay ?? 250;

	const
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		fn = this;

	let
		lastArgs,
		timer;

	return function wrapper(this: unknown, ...args: unknown[]): void {
		lastArgs = args;

		if (timer === undefined) {
			fn.apply(this, lastArgs);

			const cb = () => {
				timer = undefined;

				if (!opts.single && lastArgs !== args) {
					wrapper.apply(this, lastArgs);
				}
			};

			if (opts.delay === 0) {
				timer = setImmediate(cb);

			} else {
				timer = setTimeout(cb, opts.delay);
			}
		}
	};
});

//#if standalone/prelude
/** @see [[FunctionConstructor.throttle]] */
extend(Function, 'throttle', (fn: AnyFunction | number, delayOrOpts?: number | ThrottleOptions) => {
	if (!Object.isFunction(fn)) {
		delayOrOpts = fn;
		return (fn) => Function.throttle(fn, Object.cast(delayOrOpts));
	}

	return fn.throttle(Object.cast(delayOrOpts));
});

/** @see [[FunctionConstructor.debounce]] */
extend(Function, 'debounce', (fn: AnyFunction | number, delay?: number) => {
	if (Object.isNumber(fn)) {
		delay = fn;
		return (fn) => Function.debounce(fn, delay);
	}

	return fn.debounce(delay);
});
//#endif
