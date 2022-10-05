/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Extends an object or function by the specified method
 *
 * @param obj
 * @param name - method name
 * @param method
 */
export default function extend(obj: Function | object, name: string, method: Function | PropertyDescriptor): void {
	const descriptor: PropertyDescriptor = {
		configurable: true
	};

	if (typeof method === 'function') {
		descriptor.writable = true;
		descriptor.value = method;

	} else {
		Object.assign(descriptor, method);
	}

	const
		dictKey = Symbol.for('{@link V4_EXTEND_API}');

	if (!(dictKey in obj)) {
		Object.defineProperty(obj, dictKey, {
			value: Object.create(null)
		});
	}

	Object.defineProperty(obj[dictKey], name, descriptor);

	//#if runtime has noGlobals

	const key = Symbol.for(`{@link V4_PROP_TRAP:${name}}`);
	Object.defineProperty(obj, key, descriptor);

	if (obj === Function.prototype || typeof obj !== 'function' && obj !== Object.prototype) {
		Object.defineProperty(Object.prototype, key, {
			configurable: true,

			set(val: unknown): void {
				this[name] = val;
			},

			get(): unknown {
				return this[name];
			}
		});
	}

	//#endif
	//#unless runtime has noGlobals

	Object.defineProperty(obj, name, descriptor);

	//#endunless
}
