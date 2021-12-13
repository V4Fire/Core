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
import { resolveTarget, getRawValueFromStore, Descriptor } from 'core/object/proxy-clone/helpers';

export * from 'core/object/proxy-clone/const';

/**
 * Returns a clone of the specified object.
 * The function uses a Proxy object to create a clone. The process of cloning is a lazy operation.
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
				name: 'proxyClone',
				type: 'function',
				notice: 'An operation of proxy object cloning depends on the support of native Proxy API'
			});
		}

		const proxy = new Proxy(Object.cast<object>(obj), {
			get: (target, key, receiver) => {
				const originalTarget = target;
				target = resolveTarget(target, store).value;

				let
					valStore = store.get(target),
					val = getRawValueFromStore(key, valStore) ?? Reflect.get(target, key, receiver);

				if (val instanceof Descriptor) {
					val = val.getValue(receiver);
				}

				if (val === NULL) {
					val = undefined;
				}

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
					rawValue = getRawValueFromStore(key, store.get(resolvedTarget));

				if (rawValue instanceof Descriptor) {
					return rawValue.setValue(val, receiver);
				}

				const
					desc = Reflect.getOwnPropertyDescriptor(receiver, key);

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

					if (!(key in resolvedTarget)) {
						resolvedTarget[key] = undefined;
					}

					return true;
				}

				return Reflect.set(resolvedTarget, key, val);
			},

			defineProperty: (target, key, desc) => {
				const {
					value: resolvedTarget,
					needWrap
				} = resolveTarget(target, store);

				const
					rawValue = getRawValueFromStore(key, store.get(resolvedTarget)),
					oldDesc = Reflect.getOwnPropertyDescriptor(resolvedTarget, key);

				if (
					oldDesc?.configurable === false &&
					(oldDesc.writable === false || Object.size(desc) > 1 || !('value' in desc))
				) {
					return false;
				}

				const
					mergedDesc = {};

				if (oldDesc != null) {
					const baseDesc: PropertyDescriptor = {
						configurable: oldDesc.configurable,
						enumerable: oldDesc.enumerable
					};

					Object.assign(mergedDesc, baseDesc);

					if (rawValue instanceof Descriptor) {
						Object.assign(mergedDesc, rawValue.descriptor);
					}

					Object.assign(mergedDesc, desc);

					if (desc.get != null || desc.set != null) {
						delete mergedDesc['value'];
						delete mergedDesc['writable'];

					} else {
						delete mergedDesc['get'];
						delete mergedDesc['set'];
					}

				} else {
					Object.assign(mergedDesc, desc);
				}

				if (needWrap) {
					const
						valStore = store.get(resolvedTarget) ?? new Map();

					store.set(resolvedTarget, valStore);
					valStore.set(key, new Descriptor(mergedDesc));

					if (!(key in resolvedTarget)) {
						resolvedTarget[key] = undefined;
					}

					return true;
				}

				return Reflect.defineProperty(resolvedTarget, key, mergedDesc);
			},

			deleteProperty: (target, key) => {
				const {
					value: resolvedTarget,
					needWrap
				} = resolveTarget(target, store);

				const
					desc = Reflect.getOwnPropertyDescriptor(resolvedTarget, key);

				if (desc?.configurable === false) {
					return false;
				}

				if (needWrap) {
					const
						valStore = store.get(resolvedTarget) ?? new Map();

					store.set(resolvedTarget, valStore);
					valStore.set(key, NULL);

					return true;
				}

				return Reflect.deleteProperty(resolvedTarget, key);
			},

			has: (target, key) => {
				const
					resolvedTarget = resolveTarget(target, store).value,
					valStore = store.get(resolvedTarget);

				if (valStore?.has(key)) {
					return valStore.get(key) !== NULL;
				}

				return Reflect.has(resolvedTarget, key);
			},

			getOwnPropertyDescriptor: (target, key) => {
				const
					resolvedTarget = resolveTarget(target, store).value,
					desc = Reflect.getOwnPropertyDescriptor(resolvedTarget, key);

				if (desc == null) {
					return;
				}

				const
					rawVal = getRawValueFromStore(key, store.get(resolvedTarget));

				if (rawVal instanceof Descriptor) {
					const
						rawDesc = rawVal.descriptor;

					if (desc.configurable) {
						return rawVal.descriptor;
					}

					const
						mergedDesc = {...desc};

					if (rawDesc.get == null && rawDesc.set == null) {
						mergedDesc.value = rawVal.getValue(proxy);
					}

					return mergedDesc;
				}

				return desc;
			},

			ownKeys: (target) => {
				const
					resolvedTarget = resolveTarget(target, store).value;

				if (
					Object.isArray(resolvedTarget) ||
					Object.isMap(resolvedTarget) ||
					Object.isWeakMap(resolvedTarget) ||
					Object.isSet(resolvedTarget) ||
					Object.isWeakSet(resolvedTarget)
				) {
					return Reflect.ownKeys(resolvedTarget);
				}

				const
					keys = new Set(Reflect.ownKeys(resolvedTarget));

				Object.forEach(store.get(resolvedTarget)?.entries(), ([key, val]) => {
					if (val === NULL) {
						keys.delete(key);

					} else {
						keys.add(key);
					}
				});

				return [...keys];
			},

			preventExtensions: () => false
		});

		return Object.cast(proxy);
	}
}
