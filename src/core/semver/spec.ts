/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import check, { operandLengthErrorText } from 'core/semver';

describe('core/semver', () => {
	it('greater than (>)', () => {
		expect(check('1.1.1', '2.1.1', '>')).toBe(false);
		expect(check('1.1.1', '1.2.1', '>')).toBe(false);
		expect(check('1.1.1', '1.1.2', '>')).toBe(false);
		expect(check('1.1.2', '2.1.1', '>')).toBe(false);
		expect(check('1.1.2', '1.2.1', '>')).toBe(false);
		expect(check('1.1.3', '2.1.1', '>')).toBe(false);
		expect(check('1.1.3', '1.2.1', '>')).toBe(false);
		expect(check('1.2.1', '2.1.1', '>')).toBe(false);
		expect(check('1.3.1', '2.1.1', '>')).toBe(false);

		expect(check('2.1.1', '1.1.1', '>')).toBe(true);
		expect(check('1.2.1', '1.1.1', '>')).toBe(true);
		expect(check('1.1.2', '1.1.1', '>')).toBe(true);
		expect(check('2.1.1', '1.1.2', '>')).toBe(true);
		expect(check('1.2.1', '1.1.2', '>')).toBe(true);
		expect(check('2.1.1', '1.1.3', '>')).toBe(true);
		expect(check('1.2.1', '1.1.3', '>')).toBe(true);
		expect(check('2.1.1', '1.2.1', '>')).toBe(true);
		expect(check('2.1.1', '1.3.1', '>')).toBe(true);

		expect(check('1.1.2', '1.1.2', '>')).toBe(false);

		expect(check('1.0.0', '1.2.7', '>')).toBe(false);

		expect(check('1.*', '1.2.7', '>')).toBe(false);

		expect(check('1.3.0', '1.2.*', '>')).toBe(true);
		expect(check('1.2.*', '1.3.0', '>')).toBe(false);

		expect(check('1.2.7', '1.*', '>')).toBe(false);
		expect(check('1.2.4', '1.2.*', '>')).toBe(false);
	});

	it('greater than or equal (>=)', () => {
		expect(check('1.1.1', '2.1.1', '>=')).toBe(false);
		expect(check('1.1.1', '1.2.1', '>=')).toBe(false);
		expect(check('1.1.1', '1.1.2', '>=')).toBe(false);
		expect(check('1.1.2', '2.1.1', '>=')).toBe(false);
		expect(check('1.1.2', '1.2.1', '>=')).toBe(false);
		expect(check('1.1.3', '2.1.1', '>=')).toBe(false);
		expect(check('1.1.3', '1.2.1', '>=')).toBe(false);
		expect(check('1.2.1', '2.1.1', '>=')).toBe(false);
		expect(check('1.3.1', '2.1.1', '>=')).toBe(false);

		expect(check('2.1.1', '1.1.1', '>=')).toBe(true);
		expect(check('1.2.1', '1.1.1', '>=')).toBe(true);
		expect(check('1.1.2', '1.1.1', '>=')).toBe(true);
		expect(check('2.1.1', '1.1.2', '>=')).toBe(true);
		expect(check('1.2.1', '1.1.2', '>=')).toBe(true);
		expect(check('2.1.1', '1.1.3', '>=')).toBe(true);
		expect(check('1.2.1', '1.1.3', '>=')).toBe(true);
		expect(check('2.1.1', '1.2.1', '>=')).toBe(true);
		expect(check('2.1.1', '1.3.1', '>=')).toBe(true);

		expect(check('1.1.2', '1.1.2', '>=')).toBe(true);

		expect(check('1.*', '1.2.7', '>=')).toBe(true);

		expect(check('1.3.0', '1.2.*', '>=')).toBe(true);
		expect(check('1.2.*', '1.3.0', '>=')).toBe(false);

		expect(check('1.2.7', '1.*', '>=')).toBe(true);
		expect(check('1.2.4', '1.2.*', '>=')).toBe(true);
	});

	it('less than (<)', () => {
		expect(check('1.1.1', '2.1.1', '<')).toBe(true);
		expect(check('1.1.1', '1.2.1', '<')).toBe(true);
		expect(check('1.1.1', '1.1.2', '<')).toBe(true);
		expect(check('1.1.2', '2.1.1', '<')).toBe(true);
		expect(check('1.1.2', '1.2.1', '<')).toBe(true);
		expect(check('1.1.3', '2.1.1', '<')).toBe(true);
		expect(check('1.1.3', '1.2.1', '<')).toBe(true);
		expect(check('1.2.1', '2.1.1', '<')).toBe(true);
		expect(check('1.3.1', '2.1.1', '<')).toBe(true);

		expect(check('2.1.1', '1.1.1', '<')).toBe(false);
		expect(check('1.2.1', '1.1.1', '<')).toBe(false);
		expect(check('1.1.2', '1.1.1', '<')).toBe(false);
		expect(check('2.1.1', '1.1.2', '<')).toBe(false);
		expect(check('1.2.1', '1.1.2', '<')).toBe(false);
		expect(check('2.1.1', '1.1.3', '<')).toBe(false);
		expect(check('1.2.1', '1.1.3', '<')).toBe(false);
		expect(check('2.1.1', '1.2.1', '<')).toBe(false);
		expect(check('2.1.1', '1.3.1', '<')).toBe(false);

		expect(check('1.1.2', '1.1.2', '<')).toBe(false);

		expect(check('1.0.0', '1.2.7', '<')).toBe(true);

		expect(check('1.*', '1.2.7', '<')).toBe(false);
		expect(check('1.3.0', '1.2.*', '<')).toBe(false);
		expect(check('1.2.7', '1.*', '<')).toBe(false);
		expect(check('1.2.4', '1.2.*', '<')).toBe(false);
	});

	it('less than or equal (<=)', () => {
		expect(check('1.1.1', '2.1.1', '<=')).toBe(true);
		expect(check('1.1.1', '1.2.1', '<=')).toBe(true);
		expect(check('1.1.1', '1.1.2', '<=')).toBe(true);
		expect(check('1.1.2', '2.1.1', '<=')).toBe(true);
		expect(check('1.1.2', '1.2.1', '<=')).toBe(true);
		expect(check('1.1.3', '2.1.1', '<=')).toBe(true);
		expect(check('1.1.3', '1.2.1', '<=')).toBe(true);
		expect(check('1.2.1', '2.1.1', '<=')).toBe(true);
		expect(check('1.3.1', '2.1.1', '<=')).toBe(true);

		expect(check('2.1.1', '1.1.1', '<=')).toBe(false);
		expect(check('1.2.1', '1.1.1', '<=')).toBe(false);
		expect(check('1.1.2', '1.1.1', '<=')).toBe(false);
		expect(check('2.1.1', '1.1.2', '<=')).toBe(false);
		expect(check('1.2.1', '1.1.2', '<=')).toBe(false);
		expect(check('2.1.1', '1.1.3', '<=')).toBe(false);
		expect(check('1.2.1', '1.1.3', '<=')).toBe(false);
		expect(check('2.1.1', '1.2.1', '<=')).toBe(false);
		expect(check('2.1.1', '1.3.1', '<=')).toBe(false);

		expect(check('1.1.2', '1.1.2', '<=')).toBe(true);

		expect(check('1.3.0', '1.2.*', '<=')).toBe(false);
		expect(check('1.0.0', '1.2.7', '<=')).toBe(true);

		expect(check('1.*', '1.2.7', '<=')).toBe(true);
		expect(check('1.3.*', '1.2.*', '<=')).toBe(false);
		expect(check('1.2.7', '1.*', '<=')).toBe(true);
		expect(check('1.2.4', '1.2.*', '<=')).toBe(true);
	});

	it('equal (==)', () => {
		expect(check('1.3.0', '1.2.*', '==')).toBe(false);
		expect(check('1.2.9', '1.2.7', '==')).toBe(false);
		expect(check('1.2.9', '1.2.9', '==')).toBe(true);
		expect(check('1.0.0', '1.2.7', '==')).toBe(false);

		expect(check('1', '1.2.7', '==')).toBe(true);
		expect(check('1.*', '1.2.7', '==')).toBe(true);
		expect(check('1.2.7', '1.*', '==')).toBe(true);
		expect(check('1.2.4', '1.2.*', '==')).toBe(true);
	});

	it('caret range', () => {
		expect(check('0.8.3', '0.9.0', '^=')).toBe(false);
		expect(check('0.0.1', '0.0.2', '^=')).toBe(false);
		expect(check('2.1.0', '1.2.3', '^=')).toBe(false);

		expect(check('1.2', '2.0', '^=')).toBe(false);

		expect(check('1', '1.0.0', '^=')).toBe(true);
		expect(check('2', '2.2.10', '^=')).toBe(true);
		expect(check('3', '2.0.0', '^=')).toBe(false);
		expect(check('5', '6', '^=')).toBe(false);
	});

	it('tilda range', () => {
		expect(check('0.8.3', '0.9.0', '~=')).toBe(false);
		expect(check('0.0.1', '0.0.2', '~=')).toBe(false);
		expect(check('2.0.2', '1.0.1', '~=')).toBe(false);

		expect(check('0.0.2', '0.0.1', '~=')).toBe(true);
		expect(check('1.2.4', '1.2.3', '~=')).toBe(true);
		expect(check('1.5.2', '1', '~=')).toBe(true);
	});

	it('caret range with x-range', () => {
		expect(check('*', '0.0.2', '^=')).toBe(true);
		expect(check('1.*', '0.0.5', '^=')).toBe(false);
		expect(check('1.*', '1.0.2', '^=')).toBe(true);
		expect(check('1.*', '1.2.3', '^=')).toBe(true);
		expect(check('1.2.*', '2.0.0', '^=')).toBe(false);

		expect(check('1.2.*', '2.0.0', '^=')).toBe(false);
		expect(check('1.2.3', '2.*', '^=')).toBe(false);
		expect(check('1.2.3', '1.*', '^=')).toBe(true);
		expect(check('2', '1.*', '^=')).toBe(false);
	});

	it('expect error', () => {
		expect(() => check(' ', '0.0.2', '^=')).toThrowError(operandLengthErrorText);
		expect(() => check('', '2.0.0', '^=')).toThrowError(operandLengthErrorText);
		expect(() => check('2.0.0', '', '^=')).toThrowError(operandLengthErrorText);
		expect(() => check('', '', '^=')).toThrowError(operandLengthErrorText);
	});
});
