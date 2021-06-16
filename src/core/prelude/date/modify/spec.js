/* eslint-disable max-lines-per-function, max-lines */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/date/modify', () => {
	const
		date = new Date(2015, 10, 11, 6);

	it('beginningOfDay', () => {
		expect(date.beginningOfDay()).not.toBe(date);
		expect(date.beginningOfDay()).toEqual(new Date(2015, 10, 11));
	});

	it('Date.beginningOfDay', () => {
		expect(Date.beginningOfDay(date)).not.toBe(date);
		expect(Date.beginningOfDay(date)).toEqual(new Date(2015, 10, 11));
	});

	it('endOfDay', () => {
		expect(date.endOfDay()).not.toBe(date);
		expect(date.endOfDay()).toEqual(new Date(2015, 10, 11, 23, 59, 59, 999));
	});

	it('Date.endOfDay', () => {
		expect(Date.endOfDay(date)).not.toBe(date);
		expect(Date.endOfDay(date)).toEqual(new Date(2015, 10, 11, 23, 59, 59, 999));
	});

	it('beginningOfWeek', () => {
		expect(date.beginningOfWeek()).not.toBe(date);
		expect(date.beginningOfWeek()).toEqual(new Date(2015, 10, 8));
	});

	it('Date.beginningOfWeek', () => {
		expect(Date.beginningOfWeek(date)).not.toBe(date);
		expect(Date.beginningOfWeek(date)).toEqual(new Date(2015, 10, 8));
	});

	it('endOfWeek', () => {
		expect(date.endOfWeek()).not.toBe(date);
		expect(date.endOfWeek()).toEqual(new Date(2015, 10, 14, 23, 59, 59, 999));
	});

	it('Date.endOfWeek', () => {
		expect(Date.endOfWeek(date)).not.toBe(date);
		expect(Date.endOfWeek(date)).toEqual(new Date(2015, 10, 14, 23, 59, 59, 999));
	});

	it('beginningOfMonth', () => {
		expect(date.beginningOfMonth()).not.toBe(date);
		expect(date.beginningOfMonth()).toEqual(new Date(2015, 10, 1));
	});

	it('Date.beginningOfMonth', () => {
		expect(Date.beginningOfMonth(date)).not.toBe(date);
		expect(Date.beginningOfMonth(date)).toEqual(new Date(2015, 10, 1));
	});

	it('endOfMonth', () => {
		expect(date.endOfMonth()).not.toBe(date);
		expect(date.endOfMonth()).toEqual(new Date(2015, 11, 0, 23, 59, 59, 999));
	});

	it('Date.endOfMonth', () => {
		expect(Date.endOfMonth(date)).not.toBe(date);
		expect(Date.endOfMonth(date)).toEqual(new Date(2015, 11, 0, 23, 59, 59, 999));
	});

	it('beginningOfYear', () => {
		expect(date.beginningOfYear()).not.toBe(date);
		expect(date.beginningOfYear()).toEqual(new Date(2015, 0));
	});

	it('Date.beginningOfYear', () => {
		expect(Date.beginningOfYear(date)).not.toBe(date);
		expect(Date.beginningOfYear(date)).toEqual(new Date(2015, 0));
	});

	it('endOfYear', () => {
		expect(date.endOfYear()).not.toBe(date);
		expect(date.endOfYear()).toEqual(new Date(2016, 0, 0, 23, 59, 59, 999));
	});

	it('Date.endOfYear', () => {
		expect(Date.endOfYear(date)).not.toBe(date);
		expect(Date.endOfYear(date)).toEqual(new Date(2016, 0, 0, 23, 59, 59, 999));
	});

	it('add', () => {
		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 11, 6, 0, 0, 1);

			expect(date.add({millisecond: 1})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 11, 6, 0, 2);

			expect(date.add({milliseconds: 2e3})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 11, 6, 0, 2);

			expect(date.add({second: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 11, 6, 1, 2);

			expect(date.add({seconds: 62})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 11, 6, 2);

			expect(date.add({minute: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 11, 7, 2);

			expect(date.add({minutes: 62})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 11, 8);

			expect(date.add({hour: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 12, 1);

			expect(date.add({hours: 19})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 13, 6);

			expect(date.add({day: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 11, 1, 6);

			expect(date.add({days: 20})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 11, 11, 6);

			expect(date.add({month: 1})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2016, 0, 11, 6);

			expect(date.add({months: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2016, 10, 11, 6);

			expect(date.add({year: 1})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2018, 10, 11, 6);

			expect(date.add({years: 3})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 11);

			expect(date.add({month: 1}, true)).toEqual(res);
			expect(date).toEqual(res);
		}
	});

	it('Date.add', () => {
		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 11, 6, 0, 0, 1);

			expect(Date.add(date, {millisecond: 1})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 11, 6, 0, 2);

			expect(Date.add({milliseconds: 2e3})(date)).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 13);

			expect(Date.add({days: 2}, true)(date)).toEqual(res);
			expect(date).toEqual(res);
		}
	});

	it('set', () => {
		{
			const
				date = new Date(2015, 10, 11, 6, 0, 0, 1),
				res = new Date(2015, 10, 11, 6, 0, 0, 2);

			expect(date.set({millisecond: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6, 0, 0, 1),
				res = new Date(2015, 10, 11, 6, 0, 2);

			expect(date.set({milliseconds: 2e3})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6, 0, 1),
				res = new Date(2015, 10, 11, 6, 0, 2);

			expect(date.set({second: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 11, 6, 1, 2);

			expect(date.set({seconds: 62})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6, 1),
				res = new Date(2015, 10, 11, 6, 2);

			expect(date.set({minute: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 11, 7, 2);

			expect(date.set({minutes: 62})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 11, 2);

			expect(date.set({hour: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 12, 1);

			expect(date.set({hours: 25})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 2, 6);

			expect(date.set({day: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 11, 1, 6);

			expect(date.set({days: 31})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 1, 11, 6);

			expect(date.set({month: 1})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2016, 0, 11, 6);

			expect(date.set({months: 12})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2016, 10, 11, 6);

			expect(date.set({year: 2016})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2018, 10, 11, 6);

			expect(date.set({years: 2018})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 1);

			expect(date.set({month: 1}, true)).toEqual(res);
			expect(date).toEqual(res);
		}
	});

	it('Date.set', () => {
		{
			const
				date = new Date(2015, 10, 11, 6, 0, 0, 2),
				res = new Date(2015, 10, 11, 6, 0, 0, 1);

			expect(Date.set(date, {millisecond: 1})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6, 0, 0, 4),
				res = new Date(2015, 10, 11, 6, 0, 2);

			expect(Date.set({milliseconds: 2e3})(date)).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11),
				res = new Date(2015, 10, 2);

			expect(Date.set({days: 2}, true)(date)).toEqual(res);
			expect(date).toEqual(res);
		}
	});

	it('rewind', () => {
		{
			const
				date = new Date(2015, 10, 11, 6, 0, 0, 2),
				res = new Date(2015, 10, 11, 6, 0, 0, 1);

			expect(date.rewind({millisecond: 1})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6, 0, 4),
				res = new Date(2015, 10, 11, 6, 0, 2);

			expect(date.rewind({milliseconds: 2e3})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6, 0, 4),
				res = new Date(2015, 10, 11, 6, 0, 2);

			expect(date.rewind({second: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6, 1, 4),
				res = new Date(2015, 10, 11, 6, 0, 2);

			expect(date.rewind({seconds: 62})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6, 4),
				res = new Date(2015, 10, 11, 6, 2);

			expect(date.rewind({minute: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6, 4),
				res = new Date(2015, 10, 11, 5, 2);

			expect(date.rewind({minutes: 62})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 11, 4);

			expect(date.rewind({hour: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 10, 23);

			expect(date.rewind({hours: 7})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 9, 6);

			expect(date.rewind({day: 2})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 0, 6);

			expect(date.rewind({days: 11})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 9, 11, 6);

			expect(date.rewind({month: 1})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2014, 11, 11, 6);

			expect(date.rewind({months: 11})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2014, 10, 11, 6);

			expect(date.rewind({year: 1})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2012, 10, 11, 6);

			expect(date.rewind({years: 3})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 9);

			expect(date.rewind({month: 1}, true)).toEqual(res);
			expect(date).toEqual(res);
		}
	});

	it('Date.rewind', () => {
		{
			const
				date = new Date(2015, 10, 11, 6, 0, 0, 3),
				res = new Date(2015, 10, 11, 6, 0, 0, 2);

			expect(Date.rewind(date, {millisecond: 1})).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6, 0, 4),
				res = new Date(2015, 10, 11, 6, 0, 2);

			expect(Date.rewind({milliseconds: 2e3})(date)).toEqual(res);
			expect(date).toEqual(res);
		}

		{
			const
				date = new Date(2015, 10, 11, 6),
				res = new Date(2015, 10, 9);

			expect(Date.rewind({days: 2}, true)(date)).toEqual(res);
			expect(date).toEqual(res);
		}
	});
});
