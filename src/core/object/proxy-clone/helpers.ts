/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { SELF } from 'core/object/proxy-clone/const';
import type { Store, ResolvedTarget } from 'core/object/proxy-clone/interface';

/**
 * Resolves the specified target by a value from the store and returns it
 *
 * @param store
 * @param target
 */
export function resolveTarget<T>(target: T, store: Store): ResolvedTarget<T> {
	if (Object.isPrimitive(target) || Object.isFrozen(target)) {
		return {
			value: target,
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
			value: Object.cast(valStore.get(SELF)),
			needWrap: false
		};
	}

	if (Object.isArray(obj)) {
		clonedObj = obj.slice();

	} else if (Object.isMap(obj) || Object.isSet(obj)) {
		clonedObj = new (Object.cast<ObjectConstructor>(obj.constructor))(obj);

	} else if (Object.isWeakMap(obj) || Object.isWeakSet(obj)) {
		clonedObj = new (Object.cast<ObjectConstructor>(obj.constructor))();
	}

	if (clonedObj != null) {
		valStore ??= new Map();
		store.set(obj, valStore);

		valStore.set(SELF, clonedObj);
		store.set(clonedObj, valStore);

		return {
			value: Object.cast(clonedObj),
			needWrap: false
		};
	}

	return {
		value: Object.cast(obj),
		needWrap: true
	};
}
