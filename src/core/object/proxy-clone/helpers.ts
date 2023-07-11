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
 * Class to create a custom property descriptor
 */
export class Descriptor {
	/**
	 * Original property descriptor
	 */
	descriptor: PropertyDescriptor;

	constructor(value: PropertyDescriptor) {
		this.descriptor = value;
	}

	/**
	 * Returns a value from the descriptor
	 * @param receiver - receiver for a get method
	 */
	getValue<T = unknown>(receiver: object): T {
		const
			{descriptor} = this;

		// eslint-disable-next-line @typescript-eslint/unbound-method
		if (Object.isFunction(descriptor.get)) {
			return descriptor.get.call(receiver);
		}

		return descriptor.value;
	}

	/**
	 * Sets a new value to the descriptor
	 *
	 * @param value
	 * @param receiver - receiver for a set method
	 */
	setValue(value: unknown, receiver: object): boolean {
		const
			{descriptor} = this;

		if (descriptor.set != null) {
			descriptor.set.call(receiver, value);
			return true;
		}

		if (descriptor.get != null) {
			return false;
		}

		descriptor.value = value;
		return descriptor.value === value;
	}
}

/**
 * Returns a raw value by a key from the specified store
 *
 * @param key
 * @param valStore
 */
export function getRawValueFromStore(key: PropertyKey, valStore: CanUndef<Map<unknown, unknown>>): unknown {
	let
		val;

	if (valStore?.has(key)) {
		val = valStore.get(key);
	}

	return val;
}

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
