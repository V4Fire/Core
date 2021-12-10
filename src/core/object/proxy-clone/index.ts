/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/object/proxy-clone/README.md]]
 * @packageDocumentation
 */

import { unimplement } from 'core/functools/implementation';
import { NULL } from 'core/object/proxy-clone/const';
import { resolveTarget } from 'core/object/proxy-clone/helpers';

export * from 'core/object/proxy-clone/const';

/**
 * Returns a clone of the specified object.
 * To clone an object, the function creates a Proxy object, i.e., the process of cloning is a lazy operation.
 *
 * @param obj
 */
export default function proxyClone<T>(obj: T): T {
	const store = new WeakMap<object, Map<unknown, unknown>>();
	return clone(obj);

	function clone<T>(obj: T): T {
		if (Object.isPrimitive(obj) || Object.isFrozen(obj)) {
			return obj;
		}

		if (typeof Proxy !== 'function') {
			unimplement({
				name: 'clone',
				type: 'function',
				notice: 'An operation of proxy object cloning depends on the support of native Proxy API'
			});
		}

		const proxy = new Proxy(Object.cast<object>(obj), {
			get: (target, key, receiver) => {
				const originalTarget = target;
				target = resolveTarget(target, store).value;

				let
					valStore = store.get(target);

				let
					val;

				if (valStore?.has(key)) {
					val = valStore.get(key);
					val = val === NULL ? undefined : val;

				} else {
					val = Reflect.get(target, key, receiver);
				}

				const needBindFunc =
					Object.isFunction(val) &&
					!Object.isCustomObject(val) &&
					!Object.isArray(target);

				if (needBindFunc) {
					if (Object.isMap(target) || Object.isSet(target)) {
						switch (key) {
							case 'get':
								return (...args) => {
									const val = target[key](...args);
									return clone(val);
								};

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
												value: clone(res.value)
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
									if (valStore == null || !valStore.has(prop)) {
										return clone(Object.cast<Map<unknown, unknown>>(originalTarget).get(prop));
									}

									const val = target[key](prop);
									return clone(val);
								};

							case 'set':
								return (prop, val) => {
									valStore ??= new Map();
									valStore.set(prop, val);
									return target[key](prop, val);
								};

							case 'add':
								return (prop) => {
									valStore ??= new Map();
									valStore.set(prop, true);
									return target[key](prop);
								};

							case 'has':
								return (prop) => {
									if (valStore == null || !valStore.has(prop)) {
										return Object.cast<Set<unknown>>(originalTarget).has(prop);
									}

									return target[key](prop);
								};

							default:
								return val.bind(target);
						}
					}

					return val.bind(target);
				}

				return clone(val);
			},

			set: (target, key, val, receiver) => {
				const {
					value: resolvedTarget,
					needWrap
				} = resolveTarget(target, store);

				const
					desc = Reflect.getOwnPropertyDescriptor(resolvedTarget, key);

				if (desc != null) {
					if (desc.writable === false || desc.get != null && desc.set == null) {
						return false;
					}

					if (desc.set != null) {
						desc.set.call(receiver, val);
						return true;
					}
				}

				if (needWrap) {
					const
						valStore = store.get(resolvedTarget) ?? new Map();

					store.set(resolvedTarget, valStore);
					valStore.set(key, val);

					return true;
				}

				return Reflect.set(resolvedTarget, key, val);
			},

			deleteProperty: (target, key) => {
				const {
					value: resolvedTarget,
					needWrap
				} = resolveTarget(target, store);

				const
					desc = Reflect.getOwnPropertyDescriptor(resolvedTarget, key);

				if (desc != null) {
					if (desc.writable === false || desc.get != null && desc.set == null) {
						return false;
					}
				}

				if (needWrap) {
					const
						valStore = store.get(resolvedTarget) ?? new Map();

					store.set(resolvedTarget, valStore);
					valStore.set(key, NULL);

					return true;
				}

				return Reflect.deleteProperty(target, key);
			},

			has: (target, key) => {
				const
					resolvedTarget = resolveTarget(target, store).value,
					valStore = store.get(resolvedTarget);

				if (valStore?.has(key)) {
					return valStore.get(key) !== NULL;
				}

				return Reflect.has(resolvedTarget, key);
			}
		});

		return Object.cast(proxy);
	}
}
