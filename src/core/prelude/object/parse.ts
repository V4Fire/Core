/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { canParse } from 'core/prelude/object/const';

/** @see ObjectConstructor.parse */
extend(Object, 'parse', (value, reviver?: JSONCb) => {
	if (Object.isFunction(value)) {
		reviver = value;
		return (value) => Object.parse(value, reviver);
	}

	if (Object.isString(value)) {
		if (value === 'undefined') {
			return;
		}

		if (canParse.test(value)) {
			try {
				return JSON.parse(value, reviver);
			} catch {}
		}
	}

	return value;
});
