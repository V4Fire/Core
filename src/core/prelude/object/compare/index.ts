/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { funcCache } from 'core/prelude/object/const';

import {

	unwrapProxy,
	cast,
	isMap,
	isSet,
	isArray,
	isRegExp,
	isDictionary,
	isDate,
	isTruly,
	isFunction

} from 'core/prelude/types';

/** @see [[ObjectConstructor.fastCompare]] */
export const fastCompare = extend<typeof Object.fastCompare>(Object, 'fastCompare', function fastCompare(a: unknown, b: unknown): boolean | AnyFunction {
	if (arguments.length < 2) {
		return (b) => fastCompare(a, b);
	}

	a = unwrapProxy(a);
	b = unwrapProxy(b);

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
		objA = cast<object>(a),
		objB = cast<object>(b);

	if (objA.constructor !== objB.constructor) {
		return false;
	}

	if (isRegExp(a)) {
		return a.toString() === objB.toString();
	}

	if (isDate(a)) {
		return a.valueOf() === objB.valueOf();
	}

	const
		isValArr = isArray(a),
		isValMap = !isValArr && isMap(a),
		isValSet = !isValMap && isSet(a);

	const cantJSONCompare = !isValArr && !isDictionary(a) && (
		!isFunction(objA['toJSON']) ||
		!isFunction(objB['toJSON'])
	);

	if (cantJSONCompare) {
		if ((isValMap || isValSet)) {
			const
				setA = cast<Set<unknown>>(a),
				setB = cast<Set<unknown>>(b);

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

				// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
				if (!fastCompare(aVal[0], bVal[0]) || !fastCompare(aVal[1], bVal[1])) {
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

	if (isValArr) {
		length1 = objA['length'];
		length2 = objB['length'];

	} else if (isValMap || isValSet) {
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
	return isTruly(res) ? res : 'null';
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
			return unwrapProxy(value);
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
			return [...unwrapProxy(value).entries()];
		}

		return unwrapProxy(value);
	};
}
