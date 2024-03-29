/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { funcCache } from 'core/prelude/object/const';

/** @see [[ObjectConstructor.fastCompare]] */
extend(Object, 'fastCompare', function fastCompare(a: unknown, b: unknown): boolean | AnyFunction {
	if (arguments.length < 2) {
		return (b) => Object.fastCompare(a, b);
	}

	a = Object.unwrapProxy(a);
	b = Object.unwrapProxy(b);

	const
		isEqual = a === b;

	if (isEqual) {
		return true;
	}

	const
		typeA = typeof a,
		typeB = typeof b;

	if (typeA !== typeB) {
		return false;
	}

	if (typeA !== 'object' || typeB !== 'object' || a == null || b == null) {
		return isEqual;
	}

	const
		objA = Object.cast<object>(a),
		objB = Object.cast<object>(b);

	if (objA.constructor !== objB.constructor) {
		return false;
	}

	if (Object.isRegExp(a)) {
		return a.toString() === objB.toString();
	}

	if (Object.isDate(a)) {
		return a.valueOf() === objB.valueOf();
	}

	const
		isArr = Object.isArray(a),
		isMap = !isArr && Object.isMap(a),
		isSet = !isMap && Object.isSet(a);

	const cantJSONCompare = !isArr && !Object.isDictionary(a) && (
		!Object.isFunction(objA['toJSON']) ||
		!Object.isFunction(objB['toJSON'])
	);

	if (cantJSONCompare) {
		if ((isMap || isSet)) {
			const
				setA = Object.cast<Set<unknown>>(a),
				setB = Object.cast<Set<unknown>>(b);

			if (setA.size !== setB.size) {
				return false;
			}

			if (setA.size === 0) {
				return true;
			}

			const
				aIter = setA.entries(),
				bIter = setB.entries();

			for (let aEl = aIter.next(), bEl = bIter.next(); !aEl.done; aEl = aIter.next(), bEl = bIter.next()) {
				const
					aVal = aEl.value,
					bVal = bEl.value;

				if (!Object.fastCompare(aVal[0], bVal[0]) || !Object.fastCompare(aVal[1], bVal[1])) {
					return false;
				}
			}

			return true;
		}

		return isEqual;
	}

	let
		length1,
		length2;

	if (isArr) {
		length1 = objA['length'];
		length2 = objB['length'];

	} else if (isMap || isSet) {
		length1 = objA['size'];
		length2 = objB['size'];

	} else {
		length1 = objA['length'] ?? Object.keys(objA).length;
		length2 = objB['length'] ?? Object.keys(objB).length;
	}

	if (length1 !== length2) {
		return false;
	}

	if (length1 === 0 && length2 === 0) {
		return true;
	}

	const cache = new WeakMap();
	return JSON.stringify(a, createSerializer(a, b, cache)) === JSON.stringify(b, createSerializer(a, b, cache));
});

/** @see [[ObjectConstructor.fastHash]] */
extend(Object, 'fastHash', (obj) => {
	const res = JSON.stringify(obj, createSerializer(obj, undefined, funcCache));
	return Object.isTruly(res) ? res : 'null';
});

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
		if (value == null) {
			init = true;
			return Object.unwrapProxy(value);
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
			const key = funcMap.get(value) ?? `[[FUNC_REF:${Math.random()}]]`;
			funcMap.set(value, key);
			return key;
		}

		if (isObj && (value instanceof Map || value instanceof Set)) {
			return [...Object.unwrapProxy(value).entries()];
		}

		return Object.unwrapProxy(value);
	};
}
