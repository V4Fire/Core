/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { deprecate } from 'core/functools';

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
		res = Object.createDict();

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

/** @see ObjectConstructor.createEnumLike */
// tslint:disable-next-line:completed-docs
export function createEnumLike(obj: object): Dictionary {
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
		map = Object.createDict<any>();

	const p = <ObjectFromArrayOptions>{
		key: String,
		value: Boolean,
		...opts
	};

	if (p.keyConverter) {
		p.key = (el, i) => {
			deprecate({type: 'property', name: 'keyConverter', renamedTo: 'key'});
			return p.keyConverter!(i, el);
		};
	}

	if (p.valueConverter) {
		p.value = (el, i) => {
			deprecate({type: 'property', name: 'valueConverter', renamedTo: 'value'});
			return <any>p.valueConverter!(el, i);
		};
	}

	for (let i = 0; i < arr.length; i++) {
		map[<string>p.key!(arr[i], i)] = p.value!(arr[i], i);
	}

	return map;
});

/** @see ObjectConstructor.select */
extend(Object, 'select', selectReject(true));

/** @see ObjectConstructor.reject */
extend(Object, 'reject', selectReject(false));

/**
 * Factory to create Object.select/reject functions
 * @param select
 */
export function selectReject(select: boolean): AnyFunction {
	// tslint:disable-next-line:only-arrow-functions
	return function wrapper(obj: Dictionary, condition: CanArray<string> | Dictionary | RegExp): unknown {
		if (arguments.length === 1) {
			condition = obj;
			return (obj) => wrapper(obj, condition);
		}

		const
			res = Object.createDict();

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
			map = Object.isPlainObject(condition) ? condition : Object.createDict();

		if (Object.isString(condition)) {
			map[condition] = true;

		} else if (Object.isArray(condition)) {
			for (let i = 0; i < condition.length; i++) {
				map[String(condition[i])] = true;
			}

		} else if (Object.isIterable(condition)) {
			Object.forEach(condition, (key) => {
				map[String(key)] = true;
			});
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
