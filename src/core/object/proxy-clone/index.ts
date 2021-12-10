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
import { store, SELF, NULL } from 'core/object/proxy-clone/const';

export * from 'core/object/proxy-clone/const';

/**
 * Returns a clone of the specified object.
 * To clone an object, the function creates a Proxy object, i.e., the process of cloning is a lazy operation.
 *
 * @param obj
 */
export default function proxyClone<T>(obj: T): T {
	if (Object.isPrimitive(obj)) {
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
		get(target: object, key: string | symbol, receiver: object): unknown {
			target = resolveTarget(target).resolvedTarget;

			const
				valStore = store.get(target);

			let
				val;

			if (valStore?.has(key)) {
				val = valStore.get(key);
				val = val === NULL ? undefined : val;

			} else {
				val = Reflect.get(target, key, receiver);
			}

			if (Object.isPrimitive(val) || Object.isFrozen(val)) {
				return val;
			}

			const needBind =
				Object.isFunction(val) &&
				!Object.isCustomObject(val) &&
				!Object.isArray(target);

			if (needBind) {
				return val.bind(target);
			}

			return proxyClone(resolveTarget(val).resolvedTarget);
		},

		set(target: object, key: string | symbol, val: unknown, receiver: object): boolean {
			const
				{resolvedTarget, needWrap} = resolveTarget(target);

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
				const valStore = store.get(resolvedTarget) ?? new Map();
				store.set(resolvedTarget, valStore);

				valStore.set(key, val);
				return true;
			}

			return Reflect.set(resolvedTarget, key, val);
		},

		deleteProperty(target: object, key: string | symbol): boolean {
			const
				{resolvedTarget, needWrap} = resolveTarget(target);

			const
				desc = Reflect.getOwnPropertyDescriptor(resolvedTarget, key);

			if (desc != null) {
				if (desc.writable === false || desc.get != null && desc.set == null) {
					return false;
				}
			}

			if (needWrap) {
				const valStore = store.get(resolvedTarget) ?? new Map();
				store.set(resolvedTarget, valStore);
				valStore.set(key, NULL);

				return true;
			}

			return Reflect.deleteProperty(target, key);
		},

		has(target: object, key: string | symbol): boolean {
			const
				{resolvedTarget} = resolveTarget(target);

			const
				valStore = store.get(resolvedTarget);

			if (valStore?.has(key)) {
				return valStore.get(key) !== NULL;
			}

			return Reflect.has(resolvedTarget, key);
		}
	});

	return Object.cast(proxy);

	function resolveTarget<T>(target: T): {resolvedTarget: T; needWrap: boolean} {
		if (Object.isPrimitive(target) || Object.isFrozen(target)) {
			return {
				resolvedTarget: target,
				needWrap: false
			};
		}

		const
			obj = Object.cast<object>(target);

		let
			clonedObj: CanUndef<typeof obj> = undefined,
			valStore = store.get(obj);

		if (valStore?.has(SELF)) {
			return {
				resolvedTarget: Object.cast(valStore.get(SELF)),
				needWrap: false
			};
		}

		if (Object.isArray(obj)) {
			clonedObj = obj.slice();

		} else if (Object.isMap(obj) || Object.isSet(obj)) {
			clonedObj = new (Object.cast<ObjectConstructor>(obj.constructor))(obj);
		}

		if (clonedObj != null) {
			valStore ??= new Map();
			store.set(obj, valStore);

			valStore.set(SELF, clonedObj);
			store.set(clonedObj, valStore);

			return {
				resolvedTarget: Object.cast(clonedObj),
				needWrap: false
			};
		}

		return {
			resolvedTarget: Object.cast(obj),
			needWrap: true
		};
	}
}
