"use strict";

var _json = require("../../core/json");
describe('core/json', () => {
  describe('`convertIfDate`', () => {
    ['-', '.'].forEach(delimiter => {
      describe(`with delimiter '${delimiter}'`, () => {
        testConvertIfDateCasesByDateParts(['YYYY', 'MM', 'DD'], [2015, 10, 12], delimiter, new Date(2015, 9, 12));
        testConvertIfDateCasesByDateParts(['YYYY', 'MM', 'DD'], [2021, '03', '01'], delimiter, new Date(2021, 2, 1));
        testConvertIfDateCasesByDateParts(['YYYY', 'M', 'D'], [2021, 6, 3], delimiter, [2021, 6, 3].join(delimiter));
      });
    });
    describe('ISO string', () => {
      const isoString = '2021-03-26T10:38:34.937604Z';
      it('is parsed as a date', () => {
        expect(JSON.parse(`"${isoString}"`, _json.convertIfDate)).toEqual(Date.create(isoString));
      });
      it('with incorrect data is not parsed as a date', () => {
        const incorrectIsoString = '2021-26T10:38:34.937604Z';
        expect(JSON.parse(`"${incorrectIsoString}"`, _json.convertIfDate)).toEqual(incorrectIsoString);
      });
      it('with prefix is not parsed as a date', () => {
        const strWithPrefix = `not-a-date-${isoString}`;
        expect(JSON.parse(`"${strWithPrefix}"`, _json.convertIfDate)).toEqual(strWithPrefix);
      });
      it('with suffix is not parsed as a date', () => {
        const strWithSuffix = `${isoString}-not-a-date`;
        expect(JSON.parse(`"${strWithSuffix}"`, _json.convertIfDate)).toEqual(strWithSuffix);
      });
    });
  });
});
function testConvertIfDateCasesByDateParts(templateParts, dateParts, delimiter, expectedDate) {
  const dateTemplate = templateParts.join(delimiter),
    dateString = dateParts.join(delimiter);
  it(`string ${dateTemplate} is parsed as a date`, () => {
    expect(JSON.parse(`"${dateString}"`, _json.convertIfDate)).toEqual(expectedDate);
  });
  it('incorrect date string is not parsed as a date', () => {
    const dateString = dateParts.slice(0, 2).join(delimiter);
    expect(JSON.parse(`"${dateString}"`, _json.convertIfDate)).toBe(dateString);
  });
  it(`string ${dateTemplate} with prefix is not parsed as a date`, () => {
    const str = `not-a-date-${dateString}`;
    expect(JSON.parse(`"${str}"`, _json.convertIfDate)).toBe(str);
  });
  it(`string ${dateTemplate} with a suffix in not parsed as a date`, () => {
    const str = `${dateString}-not-a-date`;
    expect(JSON.parse(`"${str}"`, _json.convertIfDate)).toBe(str);
  });
}