/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see ObjectConstructor.size */
extend(Object, 'size', (obj: unknown) => {
	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if (!obj) {
		return 0;
	}

	if (Object.isArray(obj) || Object.isString(obj) || Object.isFunction(obj)) {
		return obj.length;
	}

	if (Object.isNumber(obj)) {
		return obj;
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

	if (Object.isSimpleObject(obj)) {
		return Object.keys(obj).length;
	}

	return length;
});
