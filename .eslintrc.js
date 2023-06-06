/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

'use strict';

const base = require('@v4fire/linters/.eslintrc');

const copyrightTemplate = [
	'!',
	' * V4Fire Core',
	' * https://github.com/V4Fire/Core',
	' *',
	' * Released under the MIT license',
	' * https://github.com/V4Fire/Core/blob/master/LICENSE',
	' '
];

base.rules['header/header'] = [2, 'block', copyrightTemplate];

module.exports = base;
