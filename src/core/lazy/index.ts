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

import { IS_SSR } from 'core/env';
import type { ObjectScheme, Hooks } from 'core/lazy/interface';

let
	lazyContexts: object[] = [];

/**
 * Removes the specified context from the lazy contexts storage, thereby discontinuing its laziness
 *
 * > There are better methods available, such as not maintaining a strong reference.
 * However, these alternatives are not viable until we adopt TypeScript 5.x.x or make use of `WeakRef`.
 * The use of `WeakRef` is currently avoided due to its poor support in browser environments.
 * Therefore, when these more efficient solutions become accessible,
 * they should be preferred over the use of `disposeLazy`.
 *
 * @param context - the context object to be removed from the lazy storage
 */
export function disposeLazy(context: object): void {
	lazyContexts = lazyContexts.filter((currentContext) => currentContext !== context);
}

/**
 * Creates a new function based on the passed function or class and returns it.
 * The new function accumulates all method and properties actions into a queue.
 * The queue will drain after invoking the created function.
 *
 * @param constructor
 * @param [scheme] - additional scheme of the structure to create
 * @param [hooks] - dictionary of hook handlers
 */
export function makeLazy<T extends ClassConstructor | AnyFunction>(
	constructor: T,
	scheme?: ObjectScheme,
	hooks?: Hooks<T extends ClassConstructor ? InstanceType<T> : T extends (...args: infer A) => infer R ? R : object>
):
	T extends ClassConstructor ?
		T & InstanceType<T> :
		T extends (...args: infer A) => infer R ? {(...args: A): R; new (...args: A): R} & R : never {

	const
		actions: Function[] = [];

	const mergedScheme = {
		...getSchemeFromProto(constructor.prototype),
		...scheme
	};

	setActions(applyActions, mergedScheme);
	applyActions.prototype = constructor.prototype;

	return Object.cast(applyActions);

	function applyActions(this: unknown, ...args: unknown[]): unknown {
		let
			ctx;

		if (new.target === applyActions) {
			ctx = new (Object.cast<ClassConstructor>(constructor))(...args);

		} else {
			ctx = constructor.call(this, ...args);
		}

		if (hooks != null) {
			lazyContexts.push(ctx);
		}

		actions.forEach((fn) => {
			fn.call(ctx);
		});

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
				res[key] = Object.cast(Function);

			} else {
				res[key] = getSchemeFromProto(val);
			}
		});

		return getSchemeFromProto(Object.getPrototypeOf(obj), res);
	}

	function setActions(proxy: object, scheme: ObjectScheme, breadcrumbs: string[] = []): void {
		Object.forEach(scheme, (scheme, key) => {
			const
				fullPath = [...breadcrumbs, key];

			switch (typeof scheme) {
				case 'function': {
					Object.defineProperty(proxy, key, {
						configurable: true,

						get: () => (...args) => {
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

							if (lazyContexts.length > 0 && hooks?.call != null) {
								return hooks.call[fullPath.join('.')]?.(Object.cast(lazyContexts), ...args);
							}
						},

						set: (fn) => {
							actions.push(function setter(this: object) {
								Object.set(this, fullPath, fn);
								return fn;
							});

							if (lazyContexts.length > 0 && hooks?.set != null) {
								hooks.set[fullPath.join('.')]?.(Object.cast(lazyContexts), fn);
							}
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
						configurable: true,
						enumerable: true,

						get: () => {
							const
								path = fullPath.join('.');

							if (lazyContexts.length > 0 && hooks?.get?.[path] != null) {
								return hooks.get[path]!(Object.cast(lazyContexts));
							}

							return proxy[store];
						},

						set: (val) => {
							actions.push(function setter(this: object) {
								Object.set(this, fullPath, val);
								return val;
							});

							if (lazyContexts.length > 0 && hooks?.set != null) {
								hooks.set[fullPath.join('.')]?.(Object.cast(lazyContexts), val);
							}

							if (
								Object.isPrimitive(val) ||
								Object.isFunction(val) ||
								Object.size(scheme) === 0
							) {
								proxy[store] = val;
								return;
							}

							const childProxy = Object.create(val);
							setActions(childProxy, Object.cast(scheme), fullPath);
							proxy[store] = childProxy;
						}
					});
				}
			}
		});
	}
}
