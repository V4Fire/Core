/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/**
 * Compares two specified objects and returns the result
 *
 * @param a
 * @param b
 */
extend(Object, 'fastCompare', (a, b) => {
	if (a === b) {
		return true;
	}

	if (!a || typeof a !== 'object' || !b || typeof b !== 'object') {
		return a === b;
	}

	const
		aIsArr = Object.isArray(a),
		aIsMap = !aIsArr && Object.isMap(a),
		aIsSet = !aIsMap && Object.isSet(a),
		bIsArr = Object.isArray(b),
		bIsMap = !bIsArr && Object.isMap(b),
		bIsSet = !bIsMap && Object.isSet(b);

	if (
		!aIsArr && !Object.isObject(a) && !Object.isDate(a) && !Object.isRegExp(a) && !Object.isFunction(a.toJSON) ||
		!bIsArr && !Object.isObject(b) && !Object.isDate(b) && !Object.isRegExp(b) && !Object.isFunction(b.toJSON)
	) {
		if ((aIsMap && bIsMap || aIsSet && bIsSet) && a.size === 0 && b.size === 0) {
			return true;
		}

		return a === b;
	}

	let
		length1,
		length2;

	if (aIsArr) {
		length1 = a.length;

	} else if (aIsMap || aIsSet) {
		length1 = a.size;

	} else {
		length1 = typeof a.length === 'number' ? a.length : Object.keys(a).length;
	}

	if (bIsArr) {
		length2 = b.length;

	} else if (bIsMap || bIsSet) {
		length2 = b.size;

	} else {
		length2 = typeof b.length === 'number' ? b.length : Object.keys(b).length;
	}

	if (length1 !== length2) {
		return false;
	}

	if ((aIsArr && bIsArr || aIsMap && bIsMap || aIsSet && bIsSet) && length1 === 0) {
		return true;
	}

	return JSON.stringify(a) === JSON.stringify(b);
});
