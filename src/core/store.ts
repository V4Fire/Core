/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');

/**
 * Symbol generator
 */
export default class Store {
	/**
	 * @param fields - array of fields
	 */
	constructor(fields?: string[]) {
		if (typeof Proxy !== 'function') {
			return $C(fields).reduce((obj, el) => {
				obj[el] = Symbol(el);
				return obj;
			}, this);
		}

		return new Proxy(this, {
			get(target: Store, prop: string): symbol {
				if (target[prop]) {
					return target[prop];
				}

				return target[prop] = typeof prop === 'symbol' ? prop : Symbol(prop);
			}
		});
	}
}
