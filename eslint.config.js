/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

'use strict';

const
	headerPlugin = require('eslint-plugin-header');

const
	base = require('@v4fire/linters/eslint.config');

const copyrightTemplate = [
	'!',
	' * V4Fire Core',
	' * https://github.com/V4Fire/Core',
	' *',
	' * Released under the MIT license',
	' * https://github.com/V4Fire/Core/blob/master/LICENSE',
	' '
];

base.forEach((item) => {
	item.ignores = ['**/*spec.js'];

	if (item.plugins) {
		item.plugins['header'] = headerPlugin;
	}

	if (item.rules) {
		item.rules['header/header'] = [2, 'block', copyrightTemplate];
	}
});

module.exports = base;
