/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');

/**
 * Creates a generator for symbols
 * @param fields - array of fields
 */
export default function generator(fields?: string[]): Dictionary<symbol> {
	const
		obj = Object.createDict<symbol>();

	if (typeof Proxy !== 'function') {
		return $C(fields).to(obj).reduce((obj, el) => {
			obj[el] = Symbol(el);
			return obj;
		});
	}

	return new Proxy(obj, {
		get(target: typeof obj, prop: string): symbol {
			const
				val = target[prop];

			if (val) {
				return val;
			}

			return target[prop] = typeof prop === 'symbol' ? prop : Symbol(prop);
		}
	});
}
