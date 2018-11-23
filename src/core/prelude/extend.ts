/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Extends an object or a function by the specified method
 *
 * @param obj
 * @param name - method name
 * @param method
 */
export default function extend(obj: Function | object, name: string, method: Function): void {
	const
		key = Symbol.for(`[[V4_PROP_TRAP:${name}]]`);

	if (typeof obj === 'function') {
		Object.defineProperty(obj, key, {
			writable: true,
			configurable: true,
			value: () => method
		});

	} else {
		Object.defineProperty(obj, key, {
			writable: true,
			configurable: true,
			value(): unknown {
				return method;
			}
		});

		if (obj !== Object.prototype) {
			Object.defineProperty(Object.prototype, key, {
				writable: true,
				configurable: true,
				value(): unknown {
					return this[name];
				}
			});
		}
	}
}
