/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/date/relative', () => {
	it('relative', () => {
		expect(new Date().rewind({seconds: 10}).relative()).toEqual({
			type: 'seconds',
			value: 10,
			diff: (10).seconds()
		});

		expect(new Date().rewind({minutes: 10}).relative()).toEqual({
			type: 'minutes',
			value: 10,
			diff: (10).minutes()
		});

		expect(new Date().rewind({hours: 10}).relative()).toEqual({
			type: 'hours',
			value: 10,
			diff: (10).hours()
		});

		expect(new Date().rewind({days: 4}).relative()).toEqual({
			type: 'days',
			value: 4,
			diff: (4).days()
		});

		expect(new Date(Date.now() - (2).weeks()).relative()).toEqual({
			type: 'weeks',
			value: 2,
			diff: (2).weeks()
		});

		{
			const
				date = new Date().rewind({months: 2});

			expect(date.relative()).toEqual({
				type: 'months',
				value: 2,
				diff: Date.now().valueOf() - date.valueOf()
			});
		}

		{
			const
				date = new Date().rewind({years: 2});

			expect(date.relative()).toEqual({
				type: 'years',
				value: 2,
				diff: Date.now().valueOf() - date.valueOf()
			});
		}
	});

	it('Date.relative', () => {
		expect(Date.relative(new Date().rewind({minutes: 10}))).toEqual({
			type: 'minutes',
			value: 10,
			diff: (10).minutes()
		});
	});

	it('relativeTo', () => {
		expect(new Date().rewind({seconds: 10}).relativeTo(new Date())).toEqual({
			type: 'seconds',
			value: 10,
			diff: (10).seconds()
		});

		expect(new Date().rewind({minutes: 10}).relativeTo(new Date())).toEqual({
			type: 'minutes',
			value: 10,
			diff: (10).minutes()
		});

		expect(new Date().rewind({hours: 10}).relativeTo(new Date())).toEqual({
			type: 'hours',
			value: 10,
			diff: (10).hours()
		});

		expect(new Date().rewind({days: 4}).relativeTo(new Date())).toEqual({
			type: 'days',
			value: 4,
			diff: (4).days()
		});

		expect(new Date(Date.now() - (2).weeks()).relativeTo(new Date())).toEqual({
			type: 'weeks',
			value: 2,
			diff: (2).weeks()
		});

		{
			const
				date = new Date().rewind({months: 2});

			expect(date.relativeTo(new Date())).toEqual({
				type: 'months',
				value: 2,
				diff: Date.now().valueOf() - date.valueOf()
			});
		}

		{
			const
				date = new Date().rewind({years: 2});

			expect(date.relativeTo(new Date())).toEqual({
				type: 'years',
				value: 2,
				diff: Date.now().valueOf() - date.valueOf()
			});
		}
	});

	it('Date.relativeTo', () => {
		expect(Date.relativeTo(new Date().rewind({minutes: 10}), new Date())).toEqual({
			type: 'minutes',
			value: 10,
			diff: (10).minutes()
		});

		expect(Date.relativeTo(new Date().rewind({minutes: 10}))(new Date())).toEqual({
			type: 'minutes',
			value: 10,
			diff: (10).minutes()
		});
	});
});
