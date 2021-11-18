/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/lazy/README.md]]
 * @packageDocumentation
 */

import type { ObjectScheme } from 'core/lazy/interface';

export default function makeLazy(constructor: Function, scheme: ObjectScheme): AnyFunction {
	const
		actions = [constructor];

	const mergedScheme = {
		...getSchemeFromProto(constructor.prototype),
		...scheme
	};

	setActions(applyActions, mergedScheme);
	applyActions.prototype = constructor.prototype;

	return applyActions;

	function applyActions(this: unknown, ...args: unknown[]): any {
		let
			ctx;

		if (new.target === applyActions) {
			ctx = new (<any>constructor)(...args);

		} else {
			ctx = constructor.call(this, ...args);
		}

		actions.slice(1).forEach((fn) => {
			fn.call(ctx);
		});

		actions.splice(1, actions.length);
		setActions(applyActions, mergedScheme);

		return ctx;
	}

	function getSchemeFromProto(obj: Nullable<object>, res: ObjectScheme = {}): ObjectScheme {
		if (obj == null) {
			return res;
		}

		const
			blackListRgxp = /^__\w+__$/;

		Object.getOwnPropertyNames(obj).forEach((key) => {
			if (blackListRgxp.test(key)) {
				return;
			}

			const
				val = Object.getOwnPropertyDescriptor(obj, key)?.value;

			if (Object.isFunction(val)) {
				res[key] = <any>Function;

			} else {
				res[key] = getSchemeFromProto(val);
			}
		});

		return getSchemeFromProto(Object.getPrototypeOf(obj), res);
	}

	function setActions(proxy: object, schema: ObjectScheme, breadcrumbs: string[] = []): void {
		Object.forEach(schema, (scheme, key) => {
			const
				fullPath = [...breadcrumbs, key];

			switch (typeof scheme) {
				case 'function': {
					Object.defineProperty(proxy, key, {
						configurable: true,

						value: (...args) => {
							actions.push(function method(this: object) {
								const
									obj = Object.get<Nullable<object>>(this, breadcrumbs);

								if (obj == null) {
									throw new ReferenceError(`A method by the specified path "${fullPath.join('.')}" is not defined`);
								}

								if (!Object.isFunction(obj[key])) {
									throw new ReferenceError(`A method by the specified path "${fullPath.join('.')}" is not a function`);
								}

								return obj[key](...args);
							});
						}
					});

					break;
				}

				default: {
					const
						store = Symbol(key);

					if (Object.isPrimitive(scheme)) {
						proxy[store] = scheme;

					} else if (Object.size(scheme) > 0) {
						const childProxy = {};
						setActions(childProxy, scheme, fullPath);
						proxy[store] = childProxy;
					}

					Object.defineProperty(proxy, key, {
						enumerable: true,
						configurable: true,

						get: () => proxy[store],

						set: (val) => {
							actions.push(function setter(this: object) {
								Object.set(this, fullPath, val);
								return val;
							});

							if (
								Object.isPrimitive(val) ||
								Object.isFunction(val) ||
								Object.size(scheme) === 0
							) {
								proxy[store] = val;
								return;
							}

							const childProxy = Object.create(val);
							setActions(childProxy, scheme, fullPath);
							proxy[store] = childProxy;
						}
					});

					break;
				}
			}
		});
	}
}
