/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Decorator for Function.prototype.once
 *
 * @decorator
 * @see [[Function.once]]
 */
export function once(target: Object, key: string | symbol, descriptor: PropertyDescriptor): void {
	const
		method = descriptor.value;

	if (!Object.isFunction(method)) {
		throw new TypeError(`descriptor.value is not a function: ${method}`);
	}

	descriptor.value = function value(this: object): unknown {
		Object.defineProperty(this, key, {
			configurable: true,
			value: method.once()
		});

		return this[key].apply(this, arguments);
	};
}
