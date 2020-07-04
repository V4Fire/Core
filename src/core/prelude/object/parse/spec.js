/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/object/parse', () => {
	it('parsing of primitives', () => {
		expect(Object.parse('1')).toBe(1);
		expect(Object.parse('"1"')).toBe('1');
		expect(Object.parse('"😃😡"')).toBe('😃😡');
		expect(Object.parse('😃😡')).toBe('😃😡');
		expect(Object.parse('true')).toBe(true);
		expect(Object.parse('null')).toBe(null);
		expect(Object.parse('undefined')).toBe(undefined);
	});

	it('parsing of objects', () => {
		expect(Object.parse('{a: 1}')).toBe('{a: 1}');
		expect(Object.parse('{"a": 1}')).toEqual({a: 1});
	});

	it('custom reviver', () => {
		expect(Object.parse('{"a": [1]}', (key, val) => key === 'a' ? new Set(val) : val))
			.toEqual({a: new Set([1])});
	});

	it('functional overloads', () => {
		expect(Object.parse((key, val) => key === 'a' ? new Set(val) : val)('{"a": [1]}'))
			.toEqual({a: new Set([1])});
	});
});
