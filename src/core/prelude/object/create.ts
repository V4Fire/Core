/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { deprecate } from 'core/meta/deprecation';

/** @see ObjectConstructor.createDict */
extend(Object, 'createDict', (...objects) => {
	if (objects.length) {
		return Object.assign(Object.create(null), ...objects);
	}

	return Object.create(null);
});

/** @see ObjectConstructor.convertEnumToDict */
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

/** @see ObjectConstructor.createEnumLike */
extend(Object, 'createEnumLike', createEnumLike);

/**
 * @deprecated
 * @see ObjectConstructor.createEnumLike
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

/** @see ObjectConstructor.fromArray */
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

/** @see ObjectConstructor.select */
extend(Object, 'select', selectReject(true));

/** @see ObjectConstructor.reject */
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
