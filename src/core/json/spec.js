/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { convertIfDate } from 'core/json';

describe('core/json', () => {
	it('`convertIfDate`', () => {
		expect(JSON.parse('"2015-10-12"', convertIfDate).is(new Date(2015, 9, 12))).toBeTrue();
		expect(JSON.parse('"2015-10"', convertIfDate)).toBe('2015-10');
	});
});
