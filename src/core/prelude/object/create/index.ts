/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

import { deprecate } from 'core/functools';
import { getSameAs } from 'core/prelude/object/helpers';

/** @see [[ObjectConstructor.createDict]] */
extend(Object, 'createDict', (...objects) => {
	if (objects.length > 0) {
		return Object.assign(Object.create(null), ...objects);
	}

	return Object.create(null);
});

/** @see [[ObjectConstructor.convertEnumToDict]] */
extend(Object, 'convertEnumToDict', (obj) => {
	const
		res = Object.createDict();

	if (obj == null) {
		return res;
	}

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

/** @see [[ObjectConstructor.createEnumLike]] */
extend(Object, 'createEnumLike', createEnumLike);

/**
 * @deprecated
 * @see [[ObjectConstructor.createEnumLike]]
 */
extend(Object, 'createMap', deprecate({renamedTo: 'createEnum'}, createEnumLike));

/** @see [[ObjectConstructor.createEnumLike]] */
export function createEnumLike(obj: Nullable<object>): Dictionary {
	const
		map = Object.createDict();

	if (obj == null) {
		return map;
	}

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

/** @see [[ObjectConstructor.fromArray]] */
extend(Object, 'fromArray', (
	arr: Nullable<unknown[]>,
	opts?: ObjectFromArrayOptions
) => {
	const
		map = Object.createDict<any>();

	if (arr == null) {
		return map;
	}

	const p = <ObjectFromArrayOptions>{
		key: String,
		value: () => true,
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

/** @see [[ObjectConstructor.select]] */
extend(Object, 'select', selectReject(true));

/** @see [[ObjectConstructor.reject]] */
extend(Object, 'reject', selectReject(false));

/**
 * Factory to create Object.select/reject functions
 * @param select
 */
export function selectReject(select: boolean): AnyFunction {
	return function wrapper(
		obj: Nullable<object>,
		condition: Iterable<unknown> | Dictionary | RegExp | Function
	): unknown {
		if (arguments.length === 1) {
			condition = <any>obj;
			return (obj) => wrapper(obj, condition);
		}

		const
			res = getSameAs(obj);

		if (res == null) {
			return res;
		}

		const
			filter = new Set();

		if (!Object.isRegExp(condition) && !Object.isFunction(condition)) {
			if (Object.isPrimitive(condition)) {
				filter.add(condition);

			} else if (Object.isIterable(condition)) {
				Object.forEach(condition, (el) => {
					filter.add(el);
				});

			} else {
				Object.forEach(condition, (el, key) => {
					if (Object.isTruly(el)) {
						filter.add(key);
					}
				});
			}
		}

		Object.forEach(obj, (el, key) => {
			let
				test: boolean;

			if (Object.isFunction(condition)) {
				test = Object.isTruly((<Function>condition)(key, el));

			} else if (Object.isRegExp(condition)) {
				test = condition.test(String(key));

			} else {
				test = filter.has(key);
			}

			if (select ? test : !test) {
				if (Object.isArray(res)) {
					res.push(el);

				} else if (Object.isSet(res) || Object.isWeakSet(res)) {
					res.add(<any>key);

				} else {
					Object.set(res, [key], el);
				}
			}
		});

		return res;
	};
}
