/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { funcCache } from 'core/prelude/object/const';

/** @see ObjectConstructor.fastCompare */
// tslint:disable-next-line:only-arrow-functions
extend(Object, 'fastCompare', function (a: any, b: any): boolean | AnyFunction {
	if (arguments.length < 2) {
		return (b) => Object.fastCompare(a, b);
	}

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
		!aIsArr &&
		!Object.isPlainObject(a) &&
		!Object.isDate(a) &&
		!Object.isRegExp(a) &&
		// tslint:disable-next-line:no-string-literal
		!Object.isFunction(a['toJSON']) ||

		!bIsArr &&
		!Object.isPlainObject(b) &&
		!Object.isDate(b) &&
		!Object.isRegExp(b) &&
		// tslint:disable-next-line:no-string-literal
		!Object.isFunction(b['toJSON'])
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

	const cache = new WeakMap();
	return JSON.stringify(a, createSerializer(a, b, cache)) === JSON.stringify(b, createSerializer(a, b, cache));
});

/** @see ObjectConstructor.fastHash */
extend(Object, 'fastHash', (obj) =>
	JSON.stringify(obj, createSerializer(obj, undefined, funcCache)) || 'null'
);

/**
 * Returns a function to serialize object values into strings
 *
 * @param a - first object to serialize
 * @param b - second object to serialize
 * @param funcMap - map to store functions
 */
export function createSerializer(
	a: unknown,
	b: unknown,
	funcMap: WeakMap<Function, string>
): JSONCb {
	let
		init = false;

	return (key, value) => {
		if (!value) {
			init = true;
			return value;
		}

		const
			isObj = typeof value === 'object';

		if (init && isObj) {
			if (value === a) {
				return '[[OBJ_REF:a]]';
			}

			if (value === b) {
				return '[[OBJ_REF:b]]';
			}
		}

		if (!init) {
			init = true;
		}

		if (typeof value === 'function') {
			const key = funcMap.get(value) || `[[FUNC_REF:${Math.random()}]]`;
			funcMap.set(value, key);
			return key;
		}

		if (isObj && (value instanceof Map || value instanceof Set)) {
			return [...value.entries()];
		}

		return value;
	};
}
