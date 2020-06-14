/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { convertIfDate } from 'core/json';

/** @see ObjectConstructor.fastClone */
extend(Object, 'fastClone', (obj, opts?: FastCloneOptions) => {
	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if (!obj || typeof obj === 'function') {
		if (opts !== undefined) {
			return (obj) => Object.fastClone(obj, opts);
		}

		return obj;
	}

	if (typeof obj === 'object') {
		if (obj instanceof Map) {
			const
				map = new Map();

			for (let o = obj.entries(), el = o.next(); !el.done; el = o.next()) {
				const val = el.value;
				map.set(val[0], Object.fastClone(val[1]));
			}

			return map;
		}

		if (obj instanceof Set) {
			const
				set = new Set();

			for (let o = obj.values(), el = o.next(); !el.done; el = o.next()) {
				set.add(Object.fastClone(el.value));
			}

			return set;
		}

		if (Array.isArray(obj)) {
			if (obj.length === 0) {
				return [];
			}

			if (obj.length < 10) {
				const
					slice = obj.slice();

				let
					isSimple = true;

				for (let i = 0; i < obj.length; i++) {
					const
						el = obj[i];

					if (typeof el === 'object') {
						if (el instanceof Date) {
							slice[i] = new Date(el);

						} else {
							isSimple = false;
							break;
						}
					}
				}

				if (isSimple) {
					return slice;
				}
			}
		}

		if (obj instanceof Date) {
			return new Date(obj);
		}

		const
			constr = obj.constructor;

		if ((constr == null || constr === Object) && Object.keys(obj).length === 0) {
			return {};
		}

		const
			p = opts ?? {},
			funcMap = new Map();

		const
			replacer = createSerializer(obj, funcMap, p.replacer),
			reviewer = createParser(obj, funcMap, p.reviver);

		const clone = JSON.parse(
			JSON.stringify(obj, replacer),
			reviewer
		);

		if (p.freezable !== false) {
			if (!Object.isExtensible(obj)) {
				Object.preventExtensions(clone);
			}

			if (Object.isSealed(obj)) {
				Object.seal(clone);
			}

			if (Object.isFrozen(obj)) {
				Object.freeze(clone);
			}
		}

		return clone;
	}

	return obj;
});

const
	objRef = '[[OBJ_REF:base]]',
	funcRef = '[[FUNC_REF:';

/**
 * Returns a function to serialize object values into strings
 *
 * @param base - base object
 * @param funcMap - map to store functions
 * @param replacer - additional replacer
 */
export function createSerializer(
	base: unknown,
	funcMap: Map<Function | string, Function | string>,
	replacer?: JSONCb
): JSONCb {
	let
		init = false;

	return (key, value) => {
		if (init && value === base) {
			return objRef;
		}

		if (!init) {
			init = true;
		}

		if (typeof value === 'function') {
			const key = funcMap.get(value) ?? `${funcRef}${Math.random()}]]`;
			funcMap.set(value, key);
			funcMap.set(key, value);
			return key;
		}

		if (replacer) {
			return replacer(key, value);
		}

		return value;
	};
}

/**
 * Returns a function to parse object values from strings
 *
 * @param base - base object
 * @param funcMap - map that stores functions
 * @param reviewer - additional reviewer
 */
export function createParser(
	base: unknown,
	funcMap: Map<Function | string, Function | string>,
	reviewer?: JSONCb | false
): JSONCb {
	return (key, value) => {
		if (value === objRef) {
			return base;
		}

		if (typeof value === 'string' && value.startsWith(funcRef)) {
			const
				fn = funcMap.get(value);

			if (typeof fn === 'function') {
				return fn;
			}
		}

		if (reviewer !== false) {
			value = convertIfDate(key, value);
		}

		if (Object.isFunction(reviewer)) {
			return reviewer(key, value);
		}

		return value;
	};
}
