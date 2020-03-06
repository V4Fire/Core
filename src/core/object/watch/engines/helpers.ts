/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { toOriginalObject } from 'core/object/watch/const';

/**
 * Unwraps the specified value to watch and returns a raw object to watch
 * @param value
 */
export function unwrap(value: unknown): CanUndef<object> {
	value = value && typeof value === 'object' && value![toOriginalObject] || value;
	return value && typeof value === 'object' && !Object.isFrozen(value) ? value! : undefined;
}

/**
 * Returns a type of data to watch or false
 * @param obj
 */
export function proxyType(obj: unknown): string | false {
	if (Object.isDictionary(obj)) {
		return 'dictionary';
	}

	if (Object.isArray(obj)) {
		return 'array';
	}

	if (Object.isMap(obj) || Object.isWeakMap(obj)) {
		return 'map';
	}

	if (Object.isSet(obj) || Object.isWeakSet(obj)) {
		return 'set';
	}

	return false;
}
