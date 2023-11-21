/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see [[ObjectConstructor.size]] */
extend(Object, 'size', (obj: unknown) => {
	if (!Object.isTruly(obj)) {
		return 0;
	}

	if (Object.isArray(obj) || Object.isString(obj) || Object.isFunction(obj)) {
		return obj.length;
	}

	if (Object.isNumber(obj)) {
		return isNaN(obj) ? 0 : obj;
	}

	if (typeof obj !== 'object') {
		return 0;
	}

	if (Object.isMap(obj) || Object.isSet(obj)) {
		return obj.size;
	}

	let
		length = 0;

	if (Object.isIterable(obj)) {
		for (const _ of obj) {
			length++;
		}

		return length;
	}

	if (Object.isDictionary(obj)) {
		return Object.keys(obj).length;
	}

	return 0;
});

/** @see [[ObjectConstructor.isEmpty]] */
extend(Object, 'isEmpty', (obj: unknown) => Object.size(obj) === 0);
