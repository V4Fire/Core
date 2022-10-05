/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Decorator for `Function.prototype.once`
 *
 * @param target
 * @param key
 * @param descriptor
 *
 * @decorator
 * @see {@link Function.once}
 *
 * @throws {@link TypeError} if the descriptor value is not a function
 */
export function once(target: object, key: string | symbol, descriptor: PropertyDescriptor): void {
	const
		method = descriptor.value;

	if (!Object.isFunction(method)) {
		throw new TypeError(`descriptor.value is not a function: ${method}`);
	}

	descriptor.value = function value(this: object, ...args: unknown[]): unknown {
		Object.defineProperty(this, key, {
			configurable: true,
			value: method.once()
		});

		return this[key](...args);
	};
}
