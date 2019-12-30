/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { deprecate } from 'core/meta/deprecation';

/**
 * Creates a hash table without any prototype and returns it
 *
 * @param objects - extension objects:
 *   all key from these objects is merged to the target
 *
 * @example
 * Object.createDict({a: 1}, {b: 2}) // {a: 1, b: 2, __proto__: null}
 */
extend(Object, 'createDict', (...objects) => {
	if (objects.length) {
		return Object.assign(Object.create(null), ...objects);
	}

	return Object.create(null);
});

/**
 * Takes the enum-like object and converts it to a dictionary:
 * number values from the object is skipped
 *
 * @param obj
 */
extend(Object, 'convertEnumToDict', (obj: Dictionary) => {
	const
		res = {};

	for (let keys = Object.keys(obj), i = 0; i < keys.length; i++) {
		const
			key = keys[i],
			el = obj[key];

		if (isNaN(Number(el))) {
			continue;
		}

		res[key] = key;
	}

	return res;
});

/**
 * Creates an object which has the similar structure to TS enum objects and returns it
 *
 * @param obj - base object: it can be a dictionary or an array
 * @example
 *   Object.createEnumLike({a: 1}) // {a: 1, 1: 'a', __proto__: null}
 */
extend(Object, 'createEnumLike', createEnumLike);

/**
 * @deprecated
 * @see Object.createEnumLike
 */
extend(Object, 'createMap', deprecate({renamedTo: 'createEnum'}, createEnumLike));

function createEnumLike(obj: object): Dictionary {
	const
		map = Object.createDict();

	if (Object.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			const el = obj[i];
			map[i] = el;
			map[<string>el] = i;
		}

	} else {
		const
			keys = Object.keys(obj);

		for (let i = 0; i < keys.length; i++) {
			const
				key = keys[i],
				el = obj[key];

			map[key] = el;
			map[el] = key;
		}
	}

	return map;
}

/**
 * Creates an object from the specified array
 *
 * @param arr
 * @param [opts] - additional options:
 *   *) [keyConverter] - function that returns a key value
 *   *) [valueConverter] - function that returns an element value
 */
extend(Object, 'fromArray', (
	arr: unknown[],
	opts?: ObjectFromArrayOptions
) => {
	const
		map = {};

	const p = {
		keyConverter: String,
		valueConverter: Boolean,
		...opts
	};

	for (let i = 0; i < arr.length; i++) {
		map[p.keyConverter(i, arr[i])] = p.valueConverter(arr[i], i);
	}

	return map;
});

/**
 * Returns a new object based on the specified, but only with fields which match to the specified condition
 *
 * @param ob
 * @param condition - whitelist of keys (it can be represented as an array or an object) or a regular expression
 */
extend(Object, 'select', selectReject(true));

/**
 * Returns a new object based on the specified, but without fields which match to the specified condition
 *
 * @param ob
 * @param condition - whitelist of keys (it can be represented as an array or an object) or a regular expression
 */
extend(Object, 'reject', selectReject(false));

function selectReject(select: boolean): Function {
	return (obj: Dictionary, condition: CanArray<string> | Dictionary | RegExp) => {
		const
			res = {};

		if (Object.isRegExp(condition)) {
			for (let keys = Object.keys(obj), i = 0; i < keys.length; i++) {
				const
					key = keys[i],
					test = condition.test(key);

				if (select ? test : !test) {
					res[key] = obj[key];
				}
			}

			return res;
		}

		const
			map = Object.isObject(condition) ? condition : Object.createDict();

		if (Object.isString(condition)) {
			map[condition] = true;

		} else if (Object.isArray(condition)) {
			for (let i = 0; i < condition.length; i++) {
				map[condition[i]] = true;
			}
		}

		for (let keys = Object.keys(obj), i = 0; i < keys.length; i++) {
			const
				key = keys[i],
				test = map[key];

			if (select ? test : !test) {
				res[key] = obj[key];
			}
		}

		return res;
	};
}
