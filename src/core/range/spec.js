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

	it('char range', () => {
		expect(new Range('a', 'e').toArray()).toEqual(['a', 'b', 'c', 'd', 'e']);
	});

	it('char range without including of bounds', () => {
		expect(new Range(['a'], ['e']).toArray()).toEqual(['b', 'c', 'd']);
	});

	it('char range (extended Unicode)', () => {
		expect(new Range('😁', '😅').toArray()).toEqual(['😁', '😂', '😃', '😄', '😅']);
		expect(new Range('😁').toArray()).toEqual(['😁']);
		expect(new Range('😁', '😅'.codePointAt(0) - 2).toArray()).toEqual(['😁', '😂', '😃']);
	});

	it('char range (extended Unicode) without including of bounds', () => {
		expect(new Range(['😁'], ['😅']).toArray()).toEqual(['😂', '😃', '😄']);
	});

	it('reversed char range', () => {
		expect(new Range('e', 'a').toArray()).toEqual(['e', 'd', 'c', 'b', 'a']);
	});

	it('reversed char range without including of bounds', () => {
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

	it('range span', () => {
		expect(new Range(0, 3).span()).toBe(4);
		expect(new Range(0).span()).toBe(Infinity);
		expect(new Range(3, 0).span()).toBe(4);
		expect(new Range('a', 'd').span()).toBe(4);
		expect(new Range(new Date(), new Date().add({milliseconds: 3})).span()).toBeGreaterThanOrEqual(4);
	});

	it('clamped element', () => {
		expect(new Range(0, 3).clamp(2)).toBe(2);
		expect(new Range(0, 3).clamp(20)).toBe(3);
		expect(new Range(0, 3).clamp(-20)).toBe(0);
		expect(new Range(0).clamp(20)).toBe(20);
		expect(new Range(40, 10).clamp(20)).toBe(20);
		expect(new Range(40, 10).clamp(0)).toBe(10);
	});

	it('checking of containment', () => {
		expect(new Range(0, 3).contains(1)).toBeTrue();
		expect(new Range(0, 3).contains(10)).toBeFalse();
		expect(new Range(0).contains(10)).toBeTrue();
		expect(new Range('a', 'd').contains('b')).toBeTrue();
		expect(new Range('a', 'd').contains('z')).toBeFalse();
	});

	it('intersection', () => {
		expect(new Range(0, 3).intersect(new Range(2, 10)).toArray()).toEqual([2, 3]);
		expect(new Range(5, -2).intersect(new Range(2, 10)).toArray()).toEqual([2, 3, 4, 5]);
		expect(new Range(-2, 5).intersect(new Range(10, 2)).toArray()).toEqual([2, 3, 4, 5]);
	});

	it('union', () => {
		expect(new Range(0, 3).union(new Range(2, 4)).toArray()).toEqual([0, 1, 2, 3, 4]);
		expect(new Range(5, -2).union(new Range(2, 3)).toArray()).toEqual([-2, -1, 0, 1, 2, 3, 4, 5]);
		expect(new Range(-2, 5).union(new Range(3, 2)).toArray()).toEqual([-2, -1, 0, 1, 2, 3, 4, 5]);
	});

	it('cloning', () => {
		const r = new Range(0, 1);
		expect(r.clone()).not.toBe(r);
		expect(r.clone().toArray()).toEqual(r.toArray());
	});

	it('validation', () => {
		expect(new Range(0, 2).isValid()).toBeTrue();
		expect(new Range(0, '2').isValid()).toBeTrue();
		expect(new Range(0, 'a').isValid()).toBeFalse();
		expect(new Range(new Date(), new Date('foo')).isValid()).toBeFalse();
	});

	it('toString', () => {
		expect(new Range(0, 10).toString()).toBe('0..10');
		expect(new Range(10, 0).toString()).toBe('10..0');
		expect(new Range('a', 'd').toString()).toBe('a..d');
	});

	it('toArray', () => {
		expect(new Range(0, 2).toArray()).toEqual([0, 1, 2]);
		expect(new Range(2, 0).toArray()).toEqual([2, 1, 0]);
		expect(new Range('a', 'd').toArray()).toEqual(['a', 'b', 'c', 'd']);
		expect(new Range('d', 'a').toArray()).toEqual(['d', 'c', 'b', 'a']);
	});

	it('toIterator', () => {
		const r = new Range(0, 2);
		expect(r[Symbol.iterator]().next()).toEqual({value: 0, done: false});
		expect(r.values().next()).toEqual({value: 0, done: false});
		expect([...r.values()]).toEqual([0, 1, 2]);
	});
});
