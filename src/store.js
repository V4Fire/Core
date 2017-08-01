'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	$C = require('collection.js');

/**
 * Symbol generator
 */
export default class Store {
	/**
	 * @param fields - array of fields
	 */
	constructor(fields?: Array) {
		if (typeof Proxy !== 'function') {
			return $C(fields).reduce((obj, el) => {
				obj[el] = Symbol(el);
				return obj;
			}, this);
		}

		return new Proxy(this, {
			get(target, prop) {
				if (target[prop]) {
					return target[prop];
				}

				return target[prop] = typeof prop === 'symbol' ? prop : Symbol(prop);
			}
		});
	}
}
