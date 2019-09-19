/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Decorator for Sugar.Function.once
 * @decorator
 */
export function once(target: Object, key: string | symbol, descriptor: PropertyDescriptor): void {
	const
		method = descriptor.value;

	if (!Object.isFunction(method)) {
		throw new TypeError(`descriptor.value is not a function: ${method}`);
	}

	descriptor.value = function (): unknown {
		Object.defineProperty(this, key, {
			configurable: true,
			value: method.once()
		});

		return this[key].apply(this, arguments);
	};
}

//#if runtime has prelude/function/debounce

/**
 * Decorator for Sugar.Function.debounce
 *
 * @decorator
 * @param [delay]
 */
export function debounce(delay?: number): MethodDecorator {
	return (target, key, descriptor: PropertyDescriptor) => {
		const
			method = descriptor.value;

		if (!Object.isFunction(method)) {
			throw new TypeError(`descriptor.value is not a function: ${method}`);
		}

		descriptor.value = function (): unknown {
			Object.defineProperty(this, key, {
				configurable: true,
				value: method.debounce(delay)
			});

			return this[key].apply(this, arguments);
		};
	};
}

//#endif
//#if runtime has prelude/function/throttle

/**
 * Decorator for Sugar.Function.throttle
 *
 * @decorator
 * @param [delay]
 * @param [options]
 */
export function throttle(delay?: number, options?: {leading?: boolean}): MethodDecorator {
	return (target, key, descriptor: PropertyDescriptor) => {
		const
			method = descriptor.value;

		if (!Object.isFunction(method)) {
			throw new TypeError(`descriptor.value is not a function: ${method}`);
		}

		descriptor.value = function (): unknown {
			Object.defineProperty(this, key, {
				configurable: true,
				value: method.throttle(delay, options)
			});

			return this[key].apply(this, arguments);
		};
	};
}

//#endif
