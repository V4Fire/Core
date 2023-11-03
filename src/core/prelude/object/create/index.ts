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

import {

	isArray,
	isWeakSet,
	isTruly,
	isFunction,
	isRegExp,
	cast,
	isSet,
	isIterable,
	isPrimitive

} from 'core/prelude/types';

import { set } from 'core/prelude/object/property';
import { forEach } from 'core/prelude/object/iterators';

/** @see [[ObjectConstructor.createDict]] */
export const createDict = extend<typeof Object.createDict>(Object, 'createDict', (...objects) => {
	if (objects.length > 0) {
		return Object.assign(Object.create(null), ...objects);
	}

	return Object.create(null);
});

/** @see [[ObjectConstructor.convertEnumToDict]] */
export const convertEnumToDict = extend(Object, 'convertEnumToDict', (obj) => {
	const
		res = createDict();

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
export const createEnumLike = extend(Object, 'createEnumLike', createEnumLikeFunc);

/**
 * @deprecated
 * @see [[ObjectConstructor.createEnumLike]]
 */
extend(Object, 'createMap', deprecate({renamedTo: 'createEnum'}, createEnumLikeFunc));

/** @see [[ObjectConstructor.createEnumLike]] */
export function createEnumLikeFunc(obj: Nullable<object>): Dictionary {
	const
		map = createDict();

	if (obj == null) {
		return map;
	}

	if (isArray(obj)) {
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
export const fromArray = extend(Object, 'fromArray', (
	arr: Nullable<unknown[]>,
	opts?: ObjectFromArrayOptions
) => {
	const
		map = createDict();

	if (arr == null) {
		return map;
	}

	const p: ObjectFromArrayOptions = {
		key: String,
		value: () => true,
		...opts
	};

	if (p.keyConverter != null) {
		p.key = (el, i) => {
			deprecate({type: 'property', name: 'keyConverter', renamedTo: 'key'});
			return p.keyConverter!(i, el);
		};
	}

	if (p.valueConverter != null) {
		p.value = (el, i) => {
			deprecate({type: 'property', name: 'valueConverter', renamedTo: 'value'});
			return p.valueConverter!(el, i);
		};
	}

	for (let i = 0; i < arr.length; i++) {
		map[<string>p.key!(arr[i], i)] = p.value!(arr[i], i);
	}

	return map;
});

/** @see [[ObjectConstructor.select]] */
export const select = extend(Object, 'select', selectReject(true));

/** @see [[ObjectConstructor.reject]] */
export const reject = extend(Object, 'reject', selectReject(false));

/**
 * Factory to create select/reject functions
 * @param select
 */
export function selectReject(select: boolean): AnyFunction {
	return function wrapper(
		obj: Nullable<object>,
		condition: Iterable<unknown> | Dictionary | RegExp | Function
	): unknown {
		if (arguments.length === 1) {
			condition = cast(obj);
			return (obj) => wrapper(obj, condition);
		}

		const
			res = getSameAs(obj);

		if (res == null) {
			return {};
		}

		const
			filter = new Set();

		if (!isRegExp(condition) && !isFunction(condition)) {
			if (isPrimitive(condition)) {
				filter.add(condition);

			} else if (isIterable(condition)) {
				forEach(condition, (el) => {
					filter.add(el);
				});

			} else {
				forEach(condition, (el, key) => {
					if (isTruly(el)) {
						filter.add(key);
					}
				});
			}
		}

		forEach(obj, (el, key) => {
			let
				test: boolean;

			if (isFunction(condition)) {
				test = isTruly(condition(key, el));

			} else if (isRegExp(condition)) {
				test = condition.test(String(key));

			} else {
				test = filter.has(key);
			}

			if (select ? test : !test) {
				if (isArray(res)) {
					res.push(el);

				} else if (isSet(res) || isWeakSet(res)) {
					res.add(<object>key);

				} else {
					set(res, [key], el);
				}
			}
		});

		return res;
	};
}
