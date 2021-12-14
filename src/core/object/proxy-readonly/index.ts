/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/object/proxy-readonly/README.md]]
 * @packageDocumentation
 */

import { unimplement } from 'core/functools/implementation';

/**
 * Returns a read-only view of the specified object.
 * The function uses a Proxy object to create a view.
 *
 * @param obj
 */
export default function proxyReadonly<T>(obj: T): Readonly<T> {
	return readonly(obj);

	function readonly<T>(obj: T): T {
		if (Object.isPrimitive(obj) || Object.isFrozen(obj)) {
			return obj;
		}

		if (typeof Proxy !== 'function') {
			unimplement({
				name: 'proxyReadonly',
				type: 'function',
				notice: 'An operation of a proxy read-only view depends on the support of native Proxy API'
			});
		}

		const proxy = new Proxy(Object.cast<object>(obj), {
			get: (target, key, receiver) => {
				const
					val = Reflect.get(target, key, receiver);

				const
					isArray = Object.isArray(target),
					isCustomObject = isArray || Object.isCustomObject(target);

				if (isArray && !Reflect.has(target, Symbol.isConcatSpreadable)) {
					target[Symbol.isConcatSpreadable] = true;
				}

				if (Object.isFunction(val) && !isCustomObject) {
					if (Object.isMap(target) || Object.isSet(target)) {
						switch (key) {
							case 'get':
								return (...args) => {
									const val = target[key](...args);
									return readonly(val);
								};

							case 'add':
							case 'set':
								return () => target;

							case 'keys':
							case 'values':
							case Symbol.iterator:
								return (...args) => {
									const
										iter = target[key](...args);

									return {
										[Symbol.iterator]() {
											return this;
										},

										next: () => {
											const
												res = iter.next();

											return {
												done: res.done,
												value: readonly(res.value)
											};
										}
									};
								};

							default:
								return val.bind(target);
						}
					}

					if (Object.isWeakMap(target) || Object.isWeakSet(target)) {
						switch (key) {
							case 'get':
								return (prop) => {
									const val = target[key](prop);
									return readonly(val);
								};

							case 'add':
							case 'set':
								return () => target;

							default:
								return val.bind(target);
						}
					}

					return val.bind(target);
				}

				return readonly(val);
			},

			getOwnPropertyDescriptor: (target, key) => {
				const
					desc = Reflect.getOwnPropertyDescriptor(target, key);

				if (desc?.configurable === false) {
					return desc;
				}

				return {
					...desc,
					writable: false
				};
			},

			set: () => false,

			defineProperty: () => false,

			deleteProperty: () => false
		});

		return Object.cast(proxy);
	}
}
