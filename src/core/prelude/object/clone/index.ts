/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import type { ValMap } from 'core/prelude/object/clone/interface';

const
	objRef = '{@link OBJ_REF:base}',
	valRef = '[[VAL_REF:';

/** @see {@link ObjectConstructor.fastClone} */
extend(Object, 'fastClone', (obj, opts?: FastCloneOptions) => {
	if (!Object.isTruly(obj)) {
		if (opts !== undefined) {
			return (obj) => Object.fastClone(obj, opts);
		}

		return obj;
	}

	if (typeof obj === 'function') {
		return obj;
	}

	if (typeof obj === 'object') {
		const
			p = opts ?? {};

		if (Object.isFrozen(obj) && p.freezable !== false) {
			return obj;
		}

		let
			clone;

		if (Object.isFunction(p.reviver) || Object.isFunction(p.replacer)) {
			clone = jsonBasedClone(obj, opts);

		} else {
			try {
				clone = structuredClone(obj);

			} catch {
				clone = jsonBasedClone(obj, opts);
			}
		}

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

	function jsonBasedClone(obj: object, opts?: FastCloneOptions): object {
		if (obj instanceof Map) {
			const
				map = new Map();

			for (let o = obj.entries(), el = o.next(); !el.done; el = o.next()) {
				const val = el.value;
				map.set(val[0], Object.fastClone(val[1], opts));
			}

			return map;
		}

		if (obj instanceof Set) {
			const
				set = new Set();

			for (let o = obj.values(), el = o.next(); !el.done; el = o.next()) {
				set.add(Object.fastClone(el.value, opts));
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

		if (Object.keys(obj).length === 0) {
			return {};
		}

		const
			p = opts ?? {},
			valMap: ValMap = new Map();

		const
			// eslint-disable-next-line @typescript-eslint/unbound-method
			dateToJSON = Date.prototype.toJSON,
			functionToJSON = Function.prototype['toJSON'];

		// eslint-disable-next-line func-style
		const toJSON = function toJSON(this: Date | Function) {
			const key = valMap.get(this) ?? `${valRef}${Math.random()}]]`;
			valMap.set(this, key);
			valMap.set(key, this);
			return <string>key;
		};

		Date.prototype.toJSON = toJSON;
		Function.prototype['toJSON'] = toJSON;

		const
			replacer = createSerializer(obj, valMap, p.replacer),
			reviver = createParser(obj, valMap, p.reviver);

		const
			clone = JSON.parse(JSON.stringify(obj, replacer), reviver);

		Date.prototype.toJSON = dateToJSON;
		Function.prototype['toJSON'] = functionToJSON;

		return clone;
	}
});

/**
 * Returns a function to serialize object values into strings
 *
 * @param base - base object
 * @param valMap - map to store non-clone values
 * @param replacer - additional replacer
 */
export function createSerializer(
	base: unknown,
	valMap: ValMap,
	replacer?: JSONCb
): JSONCb {
	let
		init = false;

	return (key, value) => {
		if (init && value === base) {
			value = objRef;

		} else {
			if (!init) {
				init = true;
			}

			if (replacer) {
				value = replacer(key, value);
			}
		}

		return Object.unwrapProxy(value);
	};
}

/**
 * Returns a function to parse object values from strings
 *
 * @param base - base object
 * @param valMap - map that stores non-clone values
 * @param reviver - additional reviewer
 */
export function createParser(
	base: unknown,
	valMap: ValMap,
	reviver?: JSONCb | false
): JSONCb {
	return (key, value) => {
		if (value === objRef) {
			return base;
		}

		if (typeof value === 'string' && value.startsWith(valRef)) {
			const
				resolvedValue = valMap.get(value);

			if (resolvedValue !== undefined) {
				return resolvedValue;
			}
		}

		if (Object.isFunction(reviver)) {
			return reviver(key, value);
		}

		return value;
	};
}
