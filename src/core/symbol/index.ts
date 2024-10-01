/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/symbol/README.md]]
 * @packageDocumentation
 */

import { PROXY, READONLY } from 'core/prelude/types/const';

/**
 * Returns a factory for flexible creation of unique symbols by the first touch
 * @param fields - list of predefined fields (it can be useful to shim the Proxy API)
 */
export default function generator(fields?: string[]): StrictDictionary<symbol> {
	const dict = <StrictDictionary<symbol>>Object.createDict();

	if (fields != null) {
		fields.forEach((field) => {
			Object.defineProperty(dict, field, {
				value: Symbol(field)
			});
		});
	}

	if (typeof Proxy !== 'function') {
		return dict;
	}

	Object.setPrototypeOf(dict, new Proxy(Object.createDict(), {
		get: (target, key) => {
			if (key === PROXY) {
				return target;
			}

			if (key in target) {
				return target[key];
			}

			return target[key] = typeof key === 'symbol' ? key : Symbol(key);
		},

		set: () => false,
		defineProperty: () => false,
		deleteProperty: () => false,

		has: (target, key) => {
			if (key === READONLY || key === PROXY) {
				return true;
			}

			return Reflect.has(target, key);
		}
	}));

	return dict;
}
