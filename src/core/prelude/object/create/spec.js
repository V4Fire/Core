/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/object/create', () => {
	it('Object.createDict', () => {
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

	it('Object.convertEnumToDict', () => {
		const dict = Object.convertEnumToDict({
			0: 'bla',
			bla: 0
		});

		expect(dict).toEqual({bla: 'bla'});
		expect(Object.getPrototypeOf(dict)).toBeNull();
	});

	it('Object.createEnumLike', () => {
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

	it('Object.fromArray', () => {
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

	it('Object.select', () => {
		{
			const dict = Object.select({a: 1, b: 2}, 'a');
			expect(dict).toEqual({a: 1});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}

		{
			const dict = Object.select({a: 1, b: 2, c: 3}, ['a', 'b']);
			expect(dict).toEqual({a: 1, b: 2});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}

		{
			const dict = Object.select({a: 1, b: 2, c: 3}, ['a', 'b'].values());
			expect(dict).toEqual({a: 1, b: 2});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}

		{
			const dict = Object.select({a: 1, b: 2, c: 3}, /[ab]/);
			expect(dict).toEqual({a: 1, b: 2});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}

		{
			const dict = Object.select({a: 1, b: 2, c: 3}, {a: true, b: false});
			expect(dict).toEqual({a: 1});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}

		{
			const dict = Object.select({a: 1, b: 2, c: 3}, (key) => /[ab]/.test(key));
			expect(dict).toEqual({a: 1, b: 2});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}
	});

	it('Object.reject', () => {
		{
			const dict = Object.reject({a: 1, b: 2}, 'a');
			expect(dict).toEqual({b: 2});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}

		{
			const dict = Object.reject({a: 1, b: 2, c: 3}, ['a', 'b']);
			expect(dict).toEqual({c: 3});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}

		{
			const dict = Object.reject({a: 1, b: 2, c: 3}, ['a', 'b'].values());
			expect(dict).toEqual({c: 3});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}

		{
			const dict = Object.reject({a: 1, b: 2, c: 3}, /[ab]/);
			expect(dict).toEqual({c: 3});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}

		{
			const dict = Object.reject({a: 1, b: 2, c: 3}, {a: true, b: true});
			expect(dict).toEqual({c: 3});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}

		{
			const dict = Object.reject({a: 1, b: 2, c: 3}, (key) => /[ab]/.test(key));
			expect(dict).toEqual({c: 3});
			expect(Object.getPrototypeOf(dict)).toBeNull();
		}
	});
});
