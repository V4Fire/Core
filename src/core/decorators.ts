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

	descriptor.value = function (): any {
		Object.defineProperty(this, key, {
			value: method.once()
		});

		return this[key].apply(this, arguments);
	};
}

/**
 * Decorator for Sugar.Function.memoize
 *
 * @decorator
 * @param [hashFn]
 * @param [limit]
 */
export function memoize(hashFn?: string | Function | number, limit?: number): MethodDecorator {
	return (target, key, descriptor: PropertyDescriptor) => {
		const
			method = descriptor.value;

		if (!Object.isFunction(method)) {
			throw new TypeError(`descriptor.value is not a function: ${method}`);
		}

		descriptor.value = function (): any {
			Object.defineProperty(this, key, {
				value: method.memoize(hashFn, limit)
			});

			return this[key].apply(this, arguments);
		};
	};
}

/**
 * Decorator for Sugar.Function.debounce
 *
 * @decorator
 * @param [delay]
 */
export function debounce(delay: number = 250): MethodDecorator {
	return (target, key, descriptor: PropertyDescriptor) => {
		const
			method = descriptor.value;

		if (!Object.isFunction(method)) {
			throw new TypeError(`descriptor.value is not a function: ${method}`);
		}

		descriptor.value = function (): any {
			Object.defineProperty(this, key, {
				value: method.debounce(delay)
			});

			return this[key].apply(this, arguments);
		};
	};
}

/**
 * Decorator for Sugar.Function.throttle
 *
 * @decorator
 * @param [delay]
 */
export function throttle(delay: number = 250): MethodDecorator {
	return (target, key, descriptor: PropertyDescriptor) => {
		const
			method = descriptor.value;

		if (!Object.isFunction(method)) {
			throw new TypeError(`descriptor.value is not a function: ${method}`);
		}

		descriptor.value = function (): any {
			Object.defineProperty(this, key, {
				value: method.throttle(delay)
			});

			return this[key].apply(this, arguments);
		};
	};
}
