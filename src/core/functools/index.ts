/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/functools/README.md]]
 * @packageDocumentation
 */

/**
 * Decorator for Function.prototype.once
 *
 * @decorator
 * @see [[Function.prototype.once]]
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
 * Decorator for Function.prototype.debounce
 *
 * @decorator
 * @see [[Function.prototype.debounce]]
 * @param [delay] - delay value (in milliseconds)
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
 * Decorator for Function.prototype.throttle
 *
 * @decorator
 * @see [[Function.prototype.throttle]]
 * @param [delay] - delay value (in milliseconds)
 */
export function throttle(delay?: number): MethodDecorator {
	return (target, key, descriptor: PropertyDescriptor) => {
		const
			method = descriptor.value;

		if (!Object.isFunction(method)) {
			throw new TypeError(`descriptor.value is not a function: ${method}`);
		}

		descriptor.value = function (): unknown {
			Object.defineProperty(this, key, {
				configurable: true,
				value: method.throttle(delay)
			});

			return this[key].apply(this, arguments);
		};
	};
}

//#endif
