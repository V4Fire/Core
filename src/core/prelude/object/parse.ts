/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

const
	canParse = /^[[{"]|^(?:true|false|null|\d+)$/;

/** @see ObjectConstructor.parse */
extend(Object, 'parse', (value, reviver?: JSONCb) => {
	if (Object.isString(value)) {
		if (value === 'undefined') {
			return undefined;
		}

		if (canParse.test(value)) {
			try {
				return JSON.parse(value, reviver);
			} catch {}
		}
	}

	return value;
});
