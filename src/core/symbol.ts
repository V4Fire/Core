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
		obj = Object.createDict();

	if (typeof Proxy !== 'function') {
		return $C(fields).to(obj).reduce((obj, el) => {
			obj[el] = Symbol(el);
			return obj;
		});
	}

	return new Proxy(this, {
		get(target: typeof obj, prop: string): symbol {
			if (target[prop]) {
				return target[prop];
			}

			return target[prop] = typeof prop === 'symbol' ? prop : Symbol(prop);
		}
	});
}
