/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Range from 'core/range';

describe('core/range', () => {
	it('number range', () => {
		expect(new Range(0, 3).toArray()).toEqual([0, 1, 2, 3]);
	});

	it('number range without including of bounds', () => {
		expect(new Range([0], [3]).toArray()).toEqual([1, 2]);
	});

	it('reversed number range', () => {
		expect(new Range(3, 0).toArray()).toEqual([3, 2, 1, 0]);
	});

	it('reversed number range without including of bounds', () => {
		expect(new Range([3], [0]).toArray()).toEqual([2, 1]);
	});

	it('string range', () => {
		expect(new Range('a', 'e').toArray()).toEqual(['a', 'b', 'c', 'd', 'e']);
		expect(new Range('a', 'e'.codePointAt(0) - 2).toArray()).toEqual(['a', 'b', 'c']);
		expect(new Range('a'.codePointAt(0) + 2, 'e').toArray()).toEqual(['c', 'd', 'e']);
	});

	it('string range without including of bounds', () => {
		expect(new Range(['a'], ['e']).toArray()).toEqual(['b', 'c', 'd']);
	});

	it('string range (extended Unicode)', () => {
		expect(new Range('😁', '😅').toArray()).toEqual(['😁', '😂', '😃', '😄', '😅']);
		expect(new Range('😁', '😅'.codePointAt(0) - 2).toArray()).toEqual(['😁', '😂', '😃']);
	});

	it('string range (extended Unicode) without including of bounds', () => {
		expect(new Range(['😁'], ['😅']).toArray()).toEqual(['😂', '😃', '😄']);
	});

	it('reversed string range', () => {
		expect(new Range('e', 'a').toArray()).toEqual(['e', 'd', 'c', 'b', 'a']);
	});

	it('reversed string range without including of bounds', () => {
		expect(new Range(['e'], ['a']).toArray()).toEqual(['d', 'c', 'b']);
	});

	it('date range', () => {
		expect(new Range(Date.create('today'), Date.create('tomorrow')).toArray((12).hours())).toEqual([
			Date.create('today'),
			Date.create('today').set({hours: 12}),
			Date.create('tomorrow')
		]);
	});

	it('date range without including of bounds', () => {
		expect(new Range([Date.create('today')], [Date.create('tomorrow')]).toArray((12).hours())).toEqual([
			Date.create('today').set({milliseconds: 1}),
			Date.create('today').set({milliseconds: 1, hours: 12})
		]);
	});

	it('reversed date range', () => {
		expect(new Range(Date.create('tomorrow'), Date.create('today')).toArray((12).hours())).toEqual([
			Date.create('tomorrow'),
			Date.create('today').set({hours: 12}),
			Date.create('today')
		]);
	});

	it('reversed date range without including of bounds', () => {
		expect(new Range([Date.create('tomorrow')], [Date.create('today')]).toArray((12).hours())).toEqual([
			Date.create('today').endOfDay(),
			Date.create('today').add({milliseconds: -1, hours: 12})
		]);
	});

	it('span', () => {
		expect(new Range(0, 3).span()).toBe(4);
		expect(new Range(0).span()).toBe(Infinity);
		expect(new Range(3, 0).span()).toBe(4);
		expect(new Range('a', 'd').span()).toBe(4);
		expect(new Range(new Date(), new Date().add({milliseconds: 3})).span()).toBeGreaterThanOrEqual(4);
	});

	it('infinity ranges', () => {
		expect(new Range().span()).toBePositiveInfinity();
		expect(new Range().toString()).toBe('..');
		expect(new Range().contains(-10)).toBeTrue();
		expect(() => new Range().toArray())
			.toThrowError("Can't create an array of the infinitive range. Use an iterator instead.");

		expect(new Range(0).span()).toBePositiveInfinity();
		expect(new Range(0).toString()).toBe('0..');
		expect(new Range(0).contains(-10)).toBeFalse();
		expect(new Range(0).contains(10)).toBeTrue();
		expect(new Range(0).contains(0)).toBeTrue();
		expect(new Range([0]).contains(0)).toBeFalse();

		expect(new Range(null, 0).span()).toBePositiveInfinity();
		expect(new Range(-Infinity, 0).toString()).toBe('..0');
		expect(new Range(null, 0).contains(-10)).toBeTrue();
		expect(new Range(null, 0).contains(10)).toBeFalse();
		expect(new Range(null, 0).contains(0)).toBeTrue();
		expect(new Range(null, [0]).contains(0)).toBeFalse();

		expect(new Range(new Date()).span()).toBePositiveInfinity();

		expect(new Range('a').span()).toBePositiveInfinity();
		expect(new Range('a').toString()).toBe('a..');
		expect(new Range('a').contains('0')).toBeFalse();
		expect(new Range('a').contains('c')).toBeTrue();
		expect(new Range('a').contains('a')).toBeTrue();
		expect(new Range(['a']).contains('a')).toBeFalse();

		expect(new Range(null, 'a').span()).toBePositiveInfinity();
		expect(new Range(-Infinity, 'a').toString()).toBe('..a');
		expect(new Range(null, 'a').contains('0')).toBeTrue();
		expect(new Range(null, 'a').contains('c')).toBeFalse();
		expect(new Range(null, 'a').contains('a')).toBeTrue();
		expect(new Range(null, ['a']).contains('a')).toBeFalse();
	});

	it('clamp', () => {
		expect(new Range(0, 3).clamp(2)).toBe(2);
		expect(new Range(0, 3).clamp(20)).toBe(3);
		expect(new Range(0, 3).clamp(-20)).toBe(0);

		expect(new Range(0).clamp(20)).toBe(20);
		expect(new Range(null, 3).clamp(-20)).toBe(-20);

		expect(new Range(0).clamp(20)).toBe(20);
		expect(new Range(40, 10).clamp(20)).toBe(20);
		expect(new Range(40, 10).clamp(0)).toBe(10);
	});

	it('checking of containment', () => {
		expect(new Range(0, 3).contains(1)).toBeTrue();
		expect(new Range(0, 3).contains(10)).toBeFalse();
		expect(new Range(0).contains(10)).toBeTrue();

		expect(new Range(1, 10).contains(new Range(4, 6))).toBeTrue();
		expect(new Range(1, 10).contains(new Range(4, 12))).toBeFalse();

		expect(new Range(1).contains(new Range(4, 6))).toBeTrue();
		expect(new Range(1, 10).contains(new Range(4))).toBeFalse();

		expect(new Range(1, 10).contains(new Range('a', 'z'))).toBeFalse();

		expect(new Range('a', 'd').contains('b')).toBeTrue();
		expect(new Range('a', 'd').contains('z')).toBeFalse();
	});

	it('intersection', () => {
		expect(new Range(0, 3).intersect(new Range(2, 10)).toArray())
			.toEqual([2, 3]);

		expect(new Range(5, -2).intersect(new Range(2, 10)).toArray())
			.toEqual([5, 4, 3, 2]);

		expect(new Range(-2, 5).intersect(new Range(10, 2)).toArray())
			.toEqual([2, 3, 4, 5]);

		expect(new Range(-1, 1).intersect(new Range(1, 2)).toArray())
			.toEqual([1]);

		expect(new Range(-1, 1).intersect(new Range([1], 2)).toArray())
			.toEqual([]);

		expect(new Range(1).intersect(new Range([1], 3)).toArray())
			.toEqual([2, 3]);

		expect(new Range(1, 10000).intersect(new Range('a', 'z')).toArray())
			.toEqual([]);
	});

	it('union', () => {
		expect(new Range(0, 3).union(new Range(2, 4)).toArray())
			.toEqual([0, 1, 2, 3, 4]);

		expect(new Range(5, -2).union(new Range(2, 3)).toArray())
			.toEqual([5, 4, 3, 2, 1, 0, -1, -2]);

		expect(new Range(-2, 5).union(new Range(3, 2)).toArray())
			.toEqual([-2, -1, 0, 1, 2, 3, 4, 5]);

		expect(new Range([-2], [5]).union(new Range(3, 2)).toArray())
			.toEqual([-1, 0, 1, 2, 3, 4]);

		expect(new Range(2).union(new Range(3, 2)).toString())
			.toBe('2..');

		expect(new Range(1, 10000).union(new Range('a', 'z')).toArray())
			.toEqual([]);
	});

	it('clone', () => {
		const r = new Range(0, 1);
		expect(r.clone()).not.toBe(r);
		expect(r.clone().toArray()).toEqual(r.toArray());
		expect(new Range(0, [0]).clone().toArray()).toEqual([]);
	});

	it('reverse', () => {
		const r = new Range(0, [3]);
		expect(r.reverse()).not.toBe(r);
		expect(r.reverse().toArray()).toEqual(r.toArray().reverse());
		expect(new Range(0, [0]).reverse().toArray()).toEqual([]);
	});

	it('isValid', () => {
		expect(new Range(0, 2).isValid()).toBeTrue();
		expect(new Range(0, '2').isValid()).toBeTrue();
		expect(new Range(0, 'a').isValid()).toBeTrue();
		expect(new Range(new Date(), new Date('foo')).isValid()).toBeFalse();
	});

	it('toString', () => {
		expect(new Range(0, 10).toString()).toBe('0..10');
		expect(new Range(10, 0).toString()).toBe('10..0');

		expect(new Range(0, 0).toString()).toBe('0..0');
		expect(new Range(0, [0]).toString()).toBe('');
		expect(new Range([0], 0).toString()).toBe('');

		expect(new Range('a', 'd').toString()).toBe('a..d');
		expect(new Range(['a'], 'd').toString()).toBe('b..d');

		expect(new Range('a').toString()).toBe('a..');
		expect(new Range(null, 'a').toString()).toBe('..a');
	});

	it('toArray', () => {
		expect(new Range(0, 2).toArray()).toEqual([0, 1, 2]);
		expect(new Range(2, 0).toArray()).toEqual([2, 1, 0]);
		expect(new Range('a', 'd').toArray()).toEqual(['a', 'b', 'c', 'd']);
		expect(new Range('d', 'a').toArray()).toEqual(['d', 'c', 'b', 'a']);
	});

	it('toIterator', () => {
		const
			r = new Range(0, 2);

		expect(r[Symbol.iterator]().next()).toEqual({value: 0, done: false});
		expect(r.values().next()).toEqual({value: 0, done: false});
		expect([...r.values()]).toEqual([0, 1, 2]);
	});

	it('values', () => {
		const
			r = new Range(0, 4);

		expect([...r.values()]).toEqual([0, 1, 2, 3, 4]);
		expect([...r.values(2)]).toEqual([0, 2, 4]);
		expect([...r.values(3)]).toEqual([0, 3]);
	});

	it('entries', () => {
		const
			r = new Range([4], 0);

		expect([...r.entries()]).toEqual([[0, 3], [1, 2], [2, 1], [3, 0]]);
		expect([...r.entries(2)]).toEqual([[0, 3], [1, 1]]);
		expect([...r.entries(3)]).toEqual([[0, 3], [1, 0]]);
	});

	it('keys', () => {
		const
			r = new Range([4], [0]);

		expect([...r.keys()]).toEqual([0, 1, 2]);
		expect([...r.keys(2)]).toEqual([0, 1]);
		expect([...r.keys(3)]).toEqual([0]);
	});
});
