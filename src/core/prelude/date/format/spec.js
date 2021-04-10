/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/date/format', () => {
	const
		date = Date.create('18.10.1989 10:10:10');

	it('short', () => {
		expect(date.short('en')).toBe('10/18/1989');
	});

	it('Date.short', () => {
		expect(Date.short('en')(date)).toBe('10/18/1989');
	});

	it('medium', () => {
		expect(date.medium('en')).toBe('October 18, 1989');
	});

	it('Date.medium', () => {
		expect(Date.medium('en')(date)).toBe('October 18, 1989');
	});

	it('long', () => {
		expect(date.long('en')).toBe('October 18, 1989, 10:10:10 AM');
	});

	it('Date.long', () => {
		expect(Date.long('en')(date)).toBe('October 18, 1989, 10:10:10 AM');
	});

	it('format', () => {
		expect(date.format('Y;M:2-digit', 'en')).toBe('10/1989');
		expect(date.format({year: 'numeric'})).toBe('1989');
	});

	it('format with optional values', () => {
		expect(date.format('Y?;M?:2-digit', 'en')).toBe('10/18/1989');
		expect(new Date(new Date().setDate(2)).format('Y?;M?:2-digit;d', 'en')).toBe('02');
	});

	it('Date.format', () => {
		expect(Date.format('Y;M:2-digit', 'en')(date)).toBe('10/1989');
		expect(Date.format({year: 'numeric'})(date)).toBe('1989');
	});

	it('toHTMLDateString', () => {
		expect(date.toHTMLDateString()).toBe('1989-10-18');
		expect(date.toHTMLDateString({date: false})).toBe('1989-10-01');
		expect(date.toHTMLDateString({month: false})).toBe('1989-01-01');
	});

	it('Date.toHTMLDateString', () => {
		expect(Date.toHTMLDateString(date)).toBe('1989-10-18');
		expect(Date.toHTMLDateString(date, {date: false})).toBe('1989-10-01');
		expect(Date.toHTMLDateString({month: false})(date)).toBe('1989-01-01');
	});

	it('toHTMLTimeString', () => {
		expect(date.toHTMLTimeString()).toBe('10:10:10.0');
		expect(date.toHTMLTimeString({milliseconds: false})).toBe('10:10:10');
		expect(date.toHTMLTimeString({seconds: false})).toBe('10:10');
		expect(date.toHTMLTimeString({minutes: false})).toBe('10:00');
	});

	it('Date.toHTMLTimeString', () => {
		expect(Date.toHTMLTimeString(date)).toBe('10:10:10.0');
		expect(Date.toHTMLTimeString(date, {milliseconds: false})).toBe('10:10:10');
		expect(Date.toHTMLTimeString({seconds: false})(date)).toBe('10:10');
	});

	it('toHTMLString', () => {
		expect(date.toHTMLString()).toBe('1989-10-18T10:10:10.0');
		expect(date.toHTMLString({date: false})).toBe('1989-10-01T10:10:10.0');
		expect(date.toHTMLString({month: false})).toBe('1989-01-01T10:10:10.0');
		expect(date.toHTMLString({month: false, milliseconds: false})).toBe('1989-01-01T10:10:10');
		expect(date.toHTMLString({month: false, seconds: false})).toBe('1989-01-01T10:10');
		expect(date.toHTMLString({month: false, minutes: false})).toBe('1989-01-01T10:00');
	});

	it('Date.toHTMLString', () => {
		expect(Date.toHTMLString(date)).toBe('1989-10-18T10:10:10.0');
		expect(Date.toHTMLString(date, {date: false})).toBe('1989-10-01T10:10:10.0');
		expect(Date.toHTMLString({month: false})(date)).toBe('1989-01-01T10:10:10.0');
	});
});
