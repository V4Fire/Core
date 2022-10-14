/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

import {

	isTruly,
	isArray,
	isString,
	isFunction,
	isNumber,
	isMap,
	isSet,
	isIterable,
	isDictionary

} from 'core/prelude/types';

/** @see [[ObjectConstructor.size]] */
export const size: typeof Object.size = extend(Object, 'size', (obj: unknown) => {
	if (!isTruly(obj)) {
		return 0;
	}

	if (isArray(obj) || isString(obj) || isFunction(obj)) {
		return obj.length;
	}

	if (isNumber(obj)) {
		return isNaN(obj) ? 0 : obj;
	}

	if (typeof obj !== 'object') {
		return 0;
	}

	if (isMap(obj) || isSet(obj)) {
		return obj.size;
	}

	let
		length = 0;

	if (isIterable(obj)) {
		for (const _ of obj) {
			length++;
		}

		return length;
	}

	if (isDictionary(obj)) {
		return Object.keys(obj).length;
	}

	return 0;
});
