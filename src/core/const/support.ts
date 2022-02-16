/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * True if the runtime supports Proxy objects
 */
export const proxy = (() => {
	try {
		const obj = new Proxy({a: 1}, {
			defineProperty(target: typeof obj, key: string, desc: PropertyDescriptor): boolean {
				return Reflect.defineProperty(target, key, desc);
			}
		});

		obj.a = 2;

		return Object.keys(obj).toString() === 'a';

	} catch {
		return false;
	}
})();

