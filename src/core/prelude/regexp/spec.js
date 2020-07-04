/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/regexp', () => {
	it('escaping', () => {
		expect(RegExp.escape('(\\d+[a-z].*)')).toBe('\\(\\\\d\\+\\[a\\-z\\]\\.\\*\\)');
	});
});
