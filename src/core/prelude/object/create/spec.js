/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/object/create', () => {
	it('`Object.createDict`', () => {
		{
			const dict = Object.createDict();
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}

		{
			const dict = Object.createDict({a: 1});
			expect(dict).toEqual({a: 1});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}
	});

	it('`Object.convertEnumToDict`', () => {
		const dict = Object.convertEnumToDict({
			0: 'bla',
			bla: 0
		});

		expect(dict).toEqual({bla: 'bla'});
		expect(Object.getPrototypeOf(dict)).toBeNull();
	});

	it('`Object.createEnumLike`', () => {
		{
			const dict = Object.createEnumLike(['foo']);
			expect(dict).toEqual({0: 'foo', foo: 0});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}

		{
			const dict = Object.createEnumLike({foo: 'bar'});
			expect(dict).toEqual({foo: 'bar', bar: 'foo'});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}
	});

	it('`Object.fromArray`', () => {
		{
			const dict = Object.fromArray(['foo']);
			expect(dict).toEqual({foo: true});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}

		{
			const dict = Object.fromArray(['foo'], {
				key: (el, i) => i,
				value: (el, i) => i
			});

			expect(dict).toEqual({0: 0});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}
	});

	describe('`Object.select`', () => {
		it('supported conditions to filter', () => {
			{
				const dict = Object.select({a: 1, b: 2}, 'a');
				expect(dict).toEqual({a: 1});
			}

			{
				const dict = Object.select({a: 1, b: 2, c: 3}, ['a', 'b']);
				expect(dict).toEqual({a: 1, b: 2});
				expect(dict.__proto__).toBe(Object.prototype);
			}

			{
				const dict = Object.select({a: 1, b: 2, c: 3, __proto__: null}, ['a', 'b']);
				expect(dict).toEqual({a: 1, b: 2});
				expect(dict.__proto__).toBeFalsy();
			}

			{
				const dict = Object.select({a: 1, b: 2, c: 3}, ['a', 'b'].values());
				expect(dict).toEqual({a: 1, b: 2});
			}

			{
				const dict = Object.select({a: 1, b: 2, c: 3}, /[ab]/);
				expect(dict).toEqual({a: 1, b: 2});
			}

			{
				const dict = Object.select({a: 1, b: 2, c: 3}, {a: true, b: false});
				expect(dict).toEqual({a: 1});
			}

			{
				const dict = Object.select({a: 1, b: 2, c: 3}, (key) => /[ab]/.test(key));
				expect(dict).toEqual({a: 1, b: 2});
			}
		});

		it('supported values to filter', () => {
			expect(Object.select(null, [0, 2])).toEqual({});
			expect(Object.select(undefined, [0, 2])).toEqual({});
			expect(Object.select({a: 1, b: 2}, 'a')).toEqual({a: 1});
			expect(Object.select(new Set(['a', 'b']), 'a')).toEqual(new Set(['a']));
			expect(Object.select(new Map([['a', 1], ['b', 2]]), 'a')).toEqual(new Map([['a', 1]]));
			expect(Object.select(['a', 'b', 'c'], [0, 2])).toEqual(['a', 'c']);
		});
	});

	describe('`Object.reject`', () => {
		it('supported conditions to filter', () => {
			{
				const dict = Object.reject({a: 1, b: 2}, 'a');
				expect(dict).toEqual({b: 2});
			}

			{
				const dict = Object.reject({a: 1, b: 2, c: 3}, ['a', 'b']);
				expect(dict).toEqual({c: 3});
				expect(dict.__proto__).toBe(Object.prototype);
			}

			{
				const dict = Object.reject({a: 1, b: 2, c: 3, __proto__: null}, ['a', 'b']);
				expect(dict).toEqual({c: 3});
				expect(dict.__proto__).toBeFalsy();
			}

			{
				const dict = Object.reject({a: 1, b: 2, c: 3}, ['a', 'b'].values());
				expect(dict).toEqual({c: 3});
			}

			{
				const dict = Object.reject({a: 1, b: 2, c: 3}, /[ab]/);
				expect(dict).toEqual({c: 3});
			}

			{
				const dict = Object.reject({a: 1, b: 2, c: 3}, {a: true, b: true});
				expect(dict).toEqual({c: 3});
			}

			{
				const dict = Object.reject({a: 1, b: 2, c: 3}, (key) => /[ab]/.test(key));
				expect(dict).toEqual({c: 3});
			}
		});

		it('supported values to filter', () => {
			expect(Object.reject(null, [0, 2])).toEqual({});
			expect(Object.reject(undefined, [0, 2])).toEqual({});
			expect(Object.reject({a: 1, b: 2}, 'a')).toEqual({b: 2});
			expect(Object.reject(new Set(['a', 'b']), 'a')).toEqual(new Set(['b']));
			expect(Object.reject(new Map([['a', 1], ['b', 2]]), 'a')).toEqual(new Map([['b', 2]]));
			expect(Object.reject(['a', 'b', 'c'], [0, 2])).toEqual(['b']);
		});
	});
});
