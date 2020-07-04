/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/object/property/get', () => {
	it('simple get', () => {
		expect(Object.get({a: 1}, 'a')).toBe(1);
		expect(Object.get({a: {b: 1}}, 'a.b')).toBe(1);
		expect(Object.get({a: {b: [{c: 1}]}}, 'a.b.0.c')).toBe(1);
		expect(Object.get({a: {b: [{c: 1}]}}, 'a.b.1.c.3.e')).toBeUndefined();
	});

	it('array as a path', () => {
		const key = {};
		expect(Object.get({a: {b: new Map([[key, 1]])}}, ['a', 'b', key])).toBe(1);
		expect(Object.get({a: {b: new WeakMap([[key, 1]])}}, ['a', 'b', key])).toBe(1);
		expect(Object.get({a: {b: new WeakMap([[key, 1]])}}, ['a', 'b', null, 1, 2])).toBeUndefined();
	});

	it('custom separator', () => {
		expect(Object.get({a: {b: 1}}, 'a:b', {separator: ':'})).toBe(1);
	});

	it('functional overloads', () => {
		expect(Object.get({a: 1})('a')).toBe(1);
		expect(Object.get({a: {b: 1}}, {separator: ':'})('a:b')).toBe(1);

		expect(Object.get('a')({a: 1})).toBe(1);
		expect(Object.get('a:b', {separator: ':'})({a: {b: 1}})).toBe(1);
	});
});

describe('core/prelude/object/property/has', () => {
	it('simple has', () => {
		expect(Object.has({a: 1}, 'a')).toBeTrue();
		expect(Object.has({a: 1}, 'b')).toBeFalse();
		expect(Object.has({a: {b: 1}}, 'a.b')).toBeTrue();
		expect(Object.has({a: {b: 1}}, 'a.b.c.e')).toBeFalse();
		expect(Object.has({a: {b: [{c: 1}]}}, 'a.b.0.c')).toBeTrue();
		expect(Object.has({a: {b: [{c: 1}]}}, 'a.b.1.c')).toBeFalse();
	});

	it('array as a path', () => {
		const key = {};
		expect(Object.has({a: {b: new Map([[key, 1]])}}, ['a', 'b', key])).toBeTrue();
		expect(Object.has({a: {b: new Map([[key, 1]])}}, ['a', 'b', {}])).toBeFalse();
		expect(Object.has({a: {b: new WeakMap([[key, 1]])}}, ['a', 'b', key])).toBeTrue();
		expect(Object.has({a: {b: new WeakMap([[key, 1]])}}, ['a', 'b', 1, 5])).toBeFalse();
	});

	it('custom separator', () => {
		expect(Object.has({a: {b: 1}}, 'a:b', {separator: ':'})).toBeTrue();
	});

	it('functional overloads', () => {
		expect(Object.has({a: 1})('a')).toBeTrue();
		expect(Object.has({a: {b: 1}}, {separator: ':'})('a:b')).toBeTrue();

		expect(Object.has('a')({a: 1})).toBeTrue();
		expect(Object.has('a:b', {separator: ':'})({a: {b: 1}})).toBeTrue();
	});
});

describe('core/prelude/object/property/hasOwnProperty', () => {
	it('simple hasOwnProperty', () => {
		expect(Object.hasOwnProperty({a: 1}, 'a')).toBeTrue();
		expect(Object.hasOwnProperty({__proto__: {a: 1}}, 'a')).toBeFalse();
	});

	it('functional overloads', () => {
		expect(Object.hasOwnProperty({a: 1})('a')).toBeTrue();
		expect(Object.hasOwnProperty('a')({__proto__: {a: 1}})).toBeFalse();
	});
});

describe('core/prelude/object/property/set', () => {
	it('simple set', () => {
		{
			const obj = {a: 1};
			expect(Object.set(obj, 'a', 2)).toBe(2);
			expect(Object.get(obj, 'a')).toBe(2);
		}

		{
			const obj = {a: {b: 1}};
			expect(Object.set(obj, 'a.b', 2)).toBe(2);
			expect(Object.get(obj, 'a.b')).toBe(2);
		}

		{
			const obj = {a: {b: [{c: 1}]}};
			expect(Object.set(obj, 'a.b.0.c', 2)).toBe(2);
			expect(Object.get(obj, 'a.b.0.c')).toBe(2);
		}

		{
			const obj = {a: {b: [{c: 1}]}};
			expect(Object.set(obj, 'a.b.0.c.f.0', 2)).toBe(2);
			expect(Object.get(obj, 'a.b.0.c.f.0')).toBe(2);
			expect(obj).toEqual({
				a: {
					b: [
						{
							c: {
								f: [2]
							}
						}
					]
				}
			});
		}
	});

	it('array as a path', () => {
		const
			key = {};

		{
			const
				obj = {a: {b: new Map([[key, 1]])}},
				path = ['a', 'b', key];

			expect(Object.set(obj, path, 2)).toBe(2);
			expect(Object.get(obj, path)).toBe(2);
		}

		{
			const
				obj = {a: {b: new Map([[key, 1]])}},
				path = ['a', 'b', key, {}, 'ff'];

			expect(Object.set(obj, path, 2)).toBe(2);
			expect(Object.get(obj, path)).toBe(2);
		}

		{
			const
				obj = {a: {b: new WeakMap([[key, 1]])}},
				path = ['a', 'b', key];

			expect(Object.set(obj, path, 2)).toBe(2);
			expect(Object.get(obj, path)).toBe(2);
		}

		{
			const
				obj = {a: {b: new WeakMap([[key, 1]])}},
				path = ['a', 'b', null, '1'];

			expect(Object.set(obj, path, 2)).toBeUndefined();
			expect(Object.get(obj, path)).toBeUndefined();
		}
	});

	it('custom separator', () => {
		const obj = {a: {b: 1}};
		expect(Object.set(obj, 'a:b', 2, {separator: ':'})).toBe(2);
		expect(Object.get(obj, 'a:b', {separator: ':'})).toBe(2);
	});

	it('concatenation of values', () => {
		const obj = {a: {b: 1}};
		expect(Object.set(obj, 'a.b', 2, {concat: true})).toBe(2);
		expect(Object.get(obj, 'a.b')).toEqual([1, 2]);
	});

	it('functional overloads', () => {
		const
			obj = {a: 1};

		expect(Object.set(obj)('a', 2)).toEqual({a: 2});
		expect(Object.get(obj, 'a')).toBe(2);

		expect(Object.set('a')(obj, 3)).toEqual({a: 3});
		expect(Object.get(obj, 'a')).toBe(3);

		expect(Object.set(obj, {separator: ':'})('b:c', 4)).toEqual({a: 3, b: {c: 4}});
		expect(Object.get(obj, 'b:c', {separator: ':'})).toBe(4);

		expect(Object.set(obj, {separator: ':'}, 5)('b:c')).toEqual({a: 3, b: {c: 5}});
		expect(Object.get(obj, 'b:c', {separator: ':'})).toBe(5);

		expect(Object.set('b:c', {separator: ':'})(obj, 6)).toEqual({a: 3, b: {c: 6}});
		expect(Object.get(obj, 'b:c', {separator: ':'})).toBe(6);

		expect(Object.set('b:c', {separator: ':'}, 7)(obj)).toEqual({a: 3, b: {c: 7}});
		expect(Object.get(obj, 'b:c', {separator: ':'})).toBe(7);
	});
});
