/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/date/create', () => {
	const
		today = Date.create('today'),
		date = new Date();

	it('new date without base', () => {
		const date = new Date();
		expect(Date.create().is(date, 10e3)).toBeTrue();

		for (let v = [null, undefined, ''], i = 0; i < v.length; i++) {
			expect(Date.create(v[i]).is(date, 10e3)).toBeTrue();
		}
	});

	it('new date based on another date', () => {
		expect(Date.create(date)).not.toBe(date);
		expect(Date.create(date)).toEqual(date);
	});

	it('new date based on milliseconds', () => {
		const ms = date.valueOf();
		expect(Date.create(ms)).toEqual(date);
	});

	it('new date based on seconds', () => {
		const s = date.valueOf() / 1000;
		expect(Date.create(s)).toEqual(date);
	});

	it('new date based on an placeholder', () => {
		const
			yesterday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
			tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

		expect(Date.create('yesterday')).toEqual(yesterday);
		expect(Date.create('today')).toEqual(today);
		expect(Date.create('tomorrow')).toEqual(tomorrow);
	});

	it('new date based on templates: xxxx[.-/]xx[.-/]xx | xx[.-/]xx[.-/]xxxx', () => {
		const chunks = [
			today.getFullYear(),
			(today.getMonth() + 1).toString().padStart(2, 0),
			today.getDate().toString().padStart(2, 0)
		];

		expect(Date.create(chunks.join('.'))).toEqual(today);
		expect(Date.create(chunks.slice().reverse().join('.'))).toEqual(today);

		expect(Date.create(chunks.join('-'))).toEqual(today);
		expect(Date.create(chunks.slice().reverse().join('-'))).toEqual(today);

		expect(Date.create(chunks.join('/'))).toEqual(today);
		expect(Date.create(chunks.slice().reverse().join('/'))).toEqual(today);
	});

	it('new date based on standard templates', () => {
		expect(Date.create(today.toString())).toEqual(today);
		expect(Date.create(today.toISOString())).toEqual(today);
	});

	it('new date based on non-standard templates', () => {
		const
			date = new Date(2015, 9, 11, 10, 0, 0),
			fixedUTCDate = new Date(date.valueOf() - (date.getTimezoneOffset() + 4 * 60) * 60 * 1e3),
			utcDate = new Date(date.valueOf() - date.getTimezoneOffset() * 60 * 1e3);

		expect(Date.create('2015.10.11 10:00:00')).toEqual(date);
		expect(Date.create('2015.10.11 10:00:00.100')).toEqual(new Date(date.valueOf() + 100));
		expect(Date.create('2015/10/11T10:00:00')).toEqual(date);
		expect(Date.create('2015-10-11 T10:00:00')).toEqual(date);
		expect(Date.create('2015-10-11 10:00:00+0400')).toEqual(fixedUTCDate);
		expect(Date.create('2015-10-11 10:00:00+04:00')).toEqual(fixedUTCDate);
		expect(Date.create('2015-10-11 10:00:00+00:00')).toEqual(utcDate);
		expect(Date.create('2015-10-11 10:00:00+0000')).toEqual(utcDate);
		expect(Date.create('2015-10-11 10:00:00Z')).toEqual(utcDate);
	});
});
