/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see ObjectConstructor.parse */
extend(Object, 'parse', (value) => {
	try {
		return new Function(`return ${value}`)();
	} catch {}

	return undefined;
});
