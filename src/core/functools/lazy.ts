/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Decorator for `Function.prototype.debounce`
 *
 * @decorator
 * @see [[Function.debounce]]
 * @param [delay] - delay value (in milliseconds)
 */
export function debounce(delay?: number): MethodDecorator {
	return (target, key, descriptor: PropertyDescriptor) => {
		const
			method = descriptor.value;

		if (!Object.isFunction(method)) {
			throw new TypeError(`descriptor.value is not a function: ${method}`);
		}

		descriptor.value = function value(this: object, ...args: unknown[]): unknown {
			Object.defineProperty(this, key, {
				configurable: true,
				value: method.debounce(delay)
			});

			return this[key](...args);
		};
	};
}

/**
 * Decorator for `Function.prototype.throttle`
 *
 * @decorator
 * @see [[Function.throttle]]
 * @param [delay] - delay value (in milliseconds)
 */
export function throttle(delay?: number): MethodDecorator {
	return (target, key, descriptor: PropertyDescriptor) => {
		const
			method = descriptor.value;

		if (!Object.isFunction(method)) {
			throw new TypeError(`descriptor.value is not a function: ${method}`);
		}

		descriptor.value = function value(this: object, ...args: unknown[]): unknown {
			Object.defineProperty(this, key, {
				configurable: true,
				value: method.throttle(delay)
			});

			return this[key](...args);
		};
	};
}
