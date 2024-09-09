/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/date/create', () => {
	describe('`create`', () => {
		const
			today = Date.create('today'),
			date = new Date();

		it('new date without base', () => {
			const date = new Date();
			expect(Date.create().is(date, 10e3)).toBe(true);

			for (let v = [null, undefined, ''], i = 0; i < v.length; i++) {
				expect(Date.create(v[i]).is(date, 10e3)).toBe(true);
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

		it('new date based on templates without leading zeros', () => {
			const dates = [
				{date: '25.3.1989', withZeroes: '25.03.1989'},
				{date: '3.03.1989', withZeroes: '03.03.1989'},
				{date: '1989.3.25', withZeroes: '1989.03.25'},
				{date: '1989.03.3', withZeroes: '1989.03.03'}
			];

			dates.forEach(({date, withZeroes}) => {
				const replaceDot = (val, to) => val.replace(/\./g, to);

				expect(Date.create(date))
					.toEqual(Date.create(withZeroes));

				expect(Date.create(replaceDot(date, '-')))
					.toEqual(Date.create(replaceDot(withZeroes, '-')));

				expect(Date.create(replaceDot(date, '/')))
					.toEqual(Date.create(replaceDot(withZeroes, '/')));
			});
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

	describe('creation new dates from other ones', () => {
		const
			date = new Date(2015, 10, 11, 6);

		it('`beginningOfDay`', () => {
			expect(date.beginningOfDay()).not.toBe(date);
			expect(date.beginningOfDay()).toEqual(new Date(2015, 10, 11));
		});

		it('`Date.beginningOfDay`', () => {
			expect(Date.beginningOfDay(date)).not.toBe(date);
			expect(Date.beginningOfDay(date)).toEqual(new Date(2015, 10, 11));
		});

		it('`endOfDay`', () => {
			expect(date.endOfDay()).not.toBe(date);
			expect(date.endOfDay()).toEqual(new Date(2015, 10, 11, 23, 59, 59, 999));
		});

		it('`Date.endOfDay`', () => {
			expect(Date.endOfDay(date)).not.toBe(date);
			expect(Date.endOfDay(date)).toEqual(new Date(2015, 10, 11, 23, 59, 59, 999));
		});

		it('`beginningOfWeek`', () => {
			expect(date.beginningOfWeek()).not.toBe(date);
			expect(date.beginningOfWeek()).toEqual(new Date(2015, 10, 8));
		});

		it('`Date.beginningOfWeek`', () => {
			expect(Date.beginningOfWeek(date)).not.toBe(date);
			expect(Date.beginningOfWeek(date)).toEqual(new Date(2015, 10, 8));
		});

		it('`endOfWeek`', () => {
			expect(date.endOfWeek()).not.toBe(date);
			expect(date.endOfWeek()).toEqual(new Date(2015, 10, 14, 23, 59, 59, 999));
		});

		it('`Date.endOfWeek`', () => {
			expect(Date.endOfWeek(date)).not.toBe(date);
			expect(Date.endOfWeek(date)).toEqual(new Date(2015, 10, 14, 23, 59, 59, 999));
		});

		it('`beginningOfMonth`', () => {
			expect(date.beginningOfMonth()).not.toBe(date);
			expect(date.beginningOfMonth()).toEqual(new Date(2015, 10, 1));
		});

		it('`Date.beginningOfMonth`', () => {
			expect(Date.beginningOfMonth(date)).not.toBe(date);
			expect(Date.beginningOfMonth(date)).toEqual(new Date(2015, 10, 1));
		});

		it('`endOfMonth`', () => {
			expect(date.endOfMonth()).not.toBe(date);
			expect(date.endOfMonth()).toEqual(new Date(2015, 11, 0, 23, 59, 59, 999));
		});

		it('`Date.endOfMonth`', () => {
			expect(Date.endOfMonth(date)).not.toBe(date);
			expect(Date.endOfMonth(date)).toEqual(new Date(2015, 11, 0, 23, 59, 59, 999));
		});

		it('`beginningOfYear`', () => {
			expect(date.beginningOfYear()).not.toBe(date);
			expect(date.beginningOfYear()).toEqual(new Date(2015, 0));
		});

		it('`Date.beginningOfYear`', () => {
			expect(Date.beginningOfYear(date)).not.toBe(date);
			expect(Date.beginningOfYear(date)).toEqual(new Date(2015, 0));
		});

		it('`endOfYear`', () => {
			expect(date.endOfYear()).not.toBe(date);
			expect(date.endOfYear()).toEqual(new Date(2016, 0, 0, 23, 59, 59, 999));
		});

		it('`Date.endOfYear`', () => {
			expect(Date.endOfYear(date)).not.toBe(date);
			expect(Date.endOfYear(date)).toEqual(new Date(2016, 0, 0, 23, 59, 59, 999));
		});
	});

	describe('working with timezones', () => {
		let originGetTimeZone;

		beforeAll(() => {
			originGetTimeZone = Date.prototype.getTimezoneOffset;
		});

		afterAll(() => {
			Date.prototype.getTimezoneOffset = originGetTimeZone;
		});

		it('UTC +9:30', () => {
			Date.prototype.getTimezoneOffset = () => -(9 * 60 + 30);

			expect(Date.create('2021-11-11')).toEqual(new Date('2021-11-10T14:30:00.000Z'));
			expect(Date.create('2021-11-11 10:00:00')).toEqual(new Date('2021-11-11T00:30:00.000Z'));
		});

		it('UTC +8:45', () => {
			Date.prototype.getTimezoneOffset = () => -(8 * 60 + 45);

			expect(Date.create('2021-11-11')).toEqual(new Date('2021-11-10T15:15:00.000Z'));
			expect(Date.create('2021-11-11 10:00:00')).toEqual(new Date('2021-11-11T01:15:00.000Z'));
		});

		it('UTC −03:30', () => {
			Date.prototype.getTimezoneOffset = () => (3 * 60 + 30);

			expect(Date.create('2021-11-11')).toEqual(new Date('2021-11-11T03:30:00.000Z'));
			expect(Date.create('2021-11-11 10:00:00')).toEqual(new Date('2021-11-11T13:30:00.000Z'));
		});

		it('between 1991 and 2011 UTC +02:00 other UTC +03:00', () => {
			Date.prototype.getTimezoneOffset = function getTimezoneOffset() {
				const year = this.getFullYear();
				if (year >= 1991 && year <= 2011) {
					return -(2 * 60);
				}

				return -(3 * 60);
			};

			expect(Date.create('2021-11-11')).toEqual(new Date('2021-11-10T21:00:00.000Z'));
			expect(Date.create('2000-11-11')).toEqual(new Date('2000-11-10T22:00:00.000Z'));
			expect(Date.create('1990-11-11')).toEqual(new Date('1990-11-10T21:00:00.000Z'));
		});

		it('should consider a time when getting the timezone', () => {
			Date.prototype.getTimezoneOffset = function getTimezoneOffset() {
				const dateISO = this.toISOString();

				if (dateISO.startsWith('1992-01-18T22:00:00')) {
					return -(2 * 60);
				}

				return -(3 * 60);
			}

			expect(Date.create('19.01.1992')).toEqual(new Date('1992-01-18T22:00:00.000Z'));
			expect(Date.create('19.01.1992 10:00:00')).toEqual(new Date('1992-01-19T07:00:00.000Z'))
		})
	});
});
