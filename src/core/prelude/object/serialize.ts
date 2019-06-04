/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

//#if runtime has Object->toSource

import toSource = require('tosource');

/**
 * Object.toSource implementation
 */
extend(Object.prototype, 'toSource', function (): string {
	return toSource(this);
});

//#endif

/**
 * Parses the specified value as a JSON / JS object and returns the result
 * @param value
 */
extend(Object, 'parse', (value) => {
	try {
		return new Function(`return ${value}`)();
	} catch {}

	return undefined;
});
