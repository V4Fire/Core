/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { convertIfDate, evalWith } from 'core/json';

describe('core/json', () => {
	describe('`convertIfDate`', () => {
		['-', '.'].forEach((delimiter) => {
			describe(`with delimiter '${delimiter}'`, () => {
				testConvertIfDateCasesByDateParts(['YYYY', 'MM', 'DD'], [2015, 10, 12], delimiter, new Date(2015, 9, 12));

				testConvertIfDateCasesByDateParts(['YYYY', 'MM', 'DD'], [2021, '03', '01'], delimiter, new Date(2021, 2, 1));

				testConvertIfDateCasesByDateParts(['YYYY', 'M', 'D'], [2021, 6, 3], delimiter, [2021, 6, 3].join(delimiter));
			});
		});

		describe('ISO string', () => {
			const isoString = '2021-03-26T10:38:34.937604Z';

			it('is parsed as a date', () => {
				expect(JSON.parse(`"${isoString}"`, convertIfDate)).toEqual(Date.create(isoString));
			});

			it('with incorrect data is not parsed as a date', () => {
				const incorrectIsoString = '2021-26T10:38:34.937604Z';
				expect(JSON.parse(`"${incorrectIsoString}"`, convertIfDate)).toEqual(incorrectIsoString);
			});

			it('with prefix is not parsed as a date', () => {
				const strWithPrefix = `not-a-date-${isoString}`;
				expect(JSON.parse(`"${strWithPrefix}"`, convertIfDate)).toEqual(strWithPrefix);
			});

			it('with suffix is not parsed as a date', () => {
				const strWithSuffix = `${isoString}-not-a-date`;
				expect(JSON.parse(`"${strWithSuffix}"`, convertIfDate)).toEqual(strWithSuffix);
			});
		});
	});

	describe('`evalWith`', () => {
		const ctx = {
			a: 1,
			fn(def) {
				return def ?? 2;
			},

			b: {
				c: 3,
				nestedFn(def) {
					return def ?? 4;
				}
			}
		};

		describe('`call` expression', () => {
			it('default', () => {
				expect(JSON.parse('["call", "fn"]', evalWith(ctx))).toEqual(2);
			});

			it('with nested path', () => {
				expect(JSON.parse('["call", "b.nestedFn"]', evalWith(ctx))).toEqual(4);
			});

			describe('with args', () => {
				it('with regular values', () => {
					expect(JSON.parse('["call", "fn", [10, 20]]', evalWith(ctx))).toEqual([10, 20]);
				});

				it('with nested `get` expression', () => {
					expect(JSON.parse('["call", "fn", ["get", "b.c"]]', evalWith(ctx))).toEqual(3);
				});

				it('with nested `call` expression', () => {
					expect(JSON.parse('["call", "fn", ["call", "b.nestedFn"]]', evalWith(ctx))).toEqual(4);
				});
			});
		});

		describe('`get` expression', () => {
			it('default', () => {
				expect(JSON.parse('["get", "a"]', evalWith(ctx))).toEqual(1);
			});

			it('with nested path', () => {
				expect(JSON.parse('["get", "b.c"]', evalWith(ctx))).toEqual(3);
			});
		});
	});
});

function testConvertIfDateCasesByDateParts(templateParts, dateParts, delimiter, expectedDate) {
	const
		dateTemplate = templateParts.join(delimiter),
		dateString = dateParts.join(delimiter);

	it(`string ${dateTemplate} is parsed as a date`, () => {
		expect(JSON.parse(`"${dateString}"`, convertIfDate)).toEqual(expectedDate);
	});

	it('incorrect date string is not parsed as a date', () => {
		const dateString = dateParts.slice(0, 2).join(delimiter);
		expect(JSON.parse(`"${dateString}"`, convertIfDate)).toBe(dateString);
	});

	it(`string ${dateTemplate} with prefix is not parsed as a date`, () => {
		const str = `not-a-date-${dateString}`;
		expect(JSON.parse(`"${str}"`, convertIfDate)).toBe(str);
	});

	it(`string ${dateTemplate} with a suffix in not parsed as a date`, () => {
		const str = `${dateString}-not-a-date`;
		expect(JSON.parse(`"${str}"`, convertIfDate)).toBe(str);
	});
}
