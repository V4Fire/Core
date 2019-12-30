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
 * @param [params]
 */
extend(Object, 'fromArray', (
	arr: unknown[],
	params?: ObjectFromArrayOptions
) => {
	const
		map = {};

	const p = {
		keyConverter: String,
		valueConverter: Boolean,
		...params
	};

	for (let i = 0; i < arr.length; i++) {
		map[p.keyConverter(arr[i])] = p.valueConverter(arr[i]);
	}

	return map;
});

/**
 * Returns values only for string fields (for converting enums)
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

/** @see Sugar.Object.select */
extend(Object, 'select', selectReject(true));

/** @see Sugar.Object.reject */
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
