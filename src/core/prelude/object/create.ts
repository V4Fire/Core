/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/**
 * Creates a hash table without prototype
 * @param fields
 */
extend(Object, 'createDict', (...fields) => {
	if (fields.length) {
		return Object.assign(Object.create(null), ...fields);
	}

	return Object.create(null);
});

/**
 * Creates an object {key: value, value: key} from the specified
 * @param obj
 */
extend(Object, 'createMap', (obj: object) => {
	const
		map = {};

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
});

export interface FromArrayConverters {
	nameConverter: Function;
	valueConverter: Function;
}

/**
 * Creates an object from the specified array
 *
 * @param arr
 * @param [params]
 */
extend(Object, 'fromArray', (
	arr: unknown[],
	params: FromArrayConverters = {
		nameConverter: String,
		valueConverter: Boolean
	}
) => {
	const
		map = {};

	for (let i = 0; i < arr.length; i++) {
		map[params.nameConverter(arr[i])] = params.valueConverter(arr[i]);
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
