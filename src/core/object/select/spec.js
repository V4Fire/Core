/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import select from 'core/object/select';

describe('core/object/select', () => {
	it('simple usage', () => {
		expect(select([{test: 1}], {where: {test: 1}}))
			.toEqual({test: 1});

		expect(select({test: 1}, {where: {test: 1}}))
			.toEqual({test: 1});

		expect(select({test: 2}, {where: [{test: 1}, {test: 2}]}))
			.toEqual({test: 2});

		expect(select([{test: 1}, {test: 2}], {where: {test: 2}}))
			.toEqual({test: 2});

		expect(select([{test: 1}, {test: 2}], {where: {test: 2}}))
			.toEqual({test: 2});

		expect(select({test: {t: 10}}, {where: {t: 10}, from: 'test'}))
			.toEqual({t: 10});
	});
});
