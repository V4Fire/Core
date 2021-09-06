/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { convertIfDate } from 'core/json';

describe('core/json', () => {
	describe('`convertIfDate`', () => {
		['-', '.'].forEach((delimiter) => {
			describe(`with delimiter '${delimiter}'`, () => {
				testConvertIfDateCases(['YYYY', 'MM', 'DD'], [2015, 10, 12], delimiter, new Date(2015, 9, 12));

				testConvertIfDateCases(['YYYY', 'MM', 'DD'], [2021, '03', '01'], delimiter, new Date(2021, 2, 1));

				testConvertIfDateCases(['YYYY', 'M', 'D'], [2021, 6, 3], delimiter, [2021, 6, 3].join(delimiter));
			});
		});
	});
});

function testConvertIfDateCases(templateParts, dateParts, delimiter, expectedDate) {
	const
		dateTemplate = templateParts.join(delimiter),
		dateString = dateParts.join(delimiter);

	it(`string ${dateTemplate} is parsed as date`, () => {
		expect(JSON.parse(`"${dateString}"`, convertIfDate)).toEqual(expectedDate);
	});

	it('incorrect date string is not parsed as date', () => {
		const dateString = dateParts.slice(0, 2).join(delimiter);
		expect(JSON.parse(`"${dateString}"`, convertIfDate)).toBe(dateString);
	});

	it(`string ${dateTemplate} with prefix is not parsed as date`, () => {
		const str = `not-a-date-${dateString}`;
		expect(JSON.parse(`"${str}"`, convertIfDate)).toBe(str);
	});

	it(`string ${dateTemplate} with suffix in not parsed as date`, () => {
		const str = `${dateString}-not-a-date`;
		expect(JSON.parse(`"${str}"`, convertIfDate)).toBe(str);
	});
}
