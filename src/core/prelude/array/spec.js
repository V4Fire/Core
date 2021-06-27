/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/array', () => {
	it('`union`', () => {
		expect([1, 2, 3].union([1, 5], [2, 4].values(), null, 6)).toEqual([1, 2, 3, 5, 4, 6]);
	});

	it('`Array.union`', () => {
		expect(Array.union([1, 2, 3], [1, 5], [2, 4].values(), null, 6)).toEqual([1, 2, 3, 5, 4, 6]);
		expect(Array.union([1, 2, 3])([1, 5], [2, 4].values(), null, 6)).toEqual([1, 2, 3, 5, 4, 6]);
	});

	it('`Array.concat`', () => {
		expect(Array.concat([1, 2])([2, 3], 4, null, 5)).toEqual([1, 2, 2, 3, 4, 5]);
		expect(Array.concat([1, 2], [2, 3], 4, null, 5)).toEqual([1, 2, 2, 3, 4, 5]);
	});
});
