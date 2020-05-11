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
		expect(check('1.2.9', '1.2.7', '>')).toBeTrue();
		expect(check('1.2.9', '1.2.9', '>')).toBeFalse();
		expect(check('1.0.0', '1.2.7', '>')).toBeFalse();

		expect(check('1.*', '1.2.7', '>')).toBeFalse();

		expect(check('1.3.0', '1.2.*', '>')).toBeTrue();
		expect(check('1.2.*', '1.3.0', '>')).toBeFalse();

		expect(check('1.2.7', '1.*', '>')).toBeFalse();
		expect(check('1.2.4', '1.2.*', '>')).toBeFalse();
	});

	it('greater than or equal (>=)', () => {
		expect(check('1.2.9', '1.2.7', '>=')).toBeTrue();
		expect(check('1.2.9', '1.2.9', '>=')).toBeTrue();
		expect(check('1.0.0', '1.2.7', '>=')).toBeFalse();

		expect(check('1.*', '1.2.7', '>=')).toBeTrue();

		expect(check('1.3.0', '1.2.*', '>=')).toBeTrue();
		expect(check('1.2.*', '1.3.0', '>=')).toBeFalse();

		expect(check('1.2.7', '1.*', '>=')).toBeTrue();
		expect(check('1.2.4', '1.2.*', '>=')).toBeTrue();
	});

	it('less than (<)', () => {
		expect(check('1.2.9', '1.2.7', '<')).toBeFalse();
		expect(check('1.2.9', '1.2.9', '<')).toBeFalse();
		expect(check('1.0.0', '1.2.7', '<')).toBeTrue();

		expect(check('1.*', '1.2.7', '<')).toBeFalse();
		expect(check('1.3.0', '1.2.*', '<')).toBeFalse();
		expect(check('1.2.7', '1.*', '<')).toBeFalse();
		expect(check('1.2.4', '1.2.*', '<')).toBeFalse();
	});

	it('less than or equal (<=)', () => {
		expect(check('1.3.0', '1.2.*', '<=')).toBeFalse();
		expect(check('1.2.9', '1.2.7', '<=')).toBeFalse();
		expect(check('1.2.9', '1.2.9', '<=')).toBeTrue();
		expect(check('1.0.0', '1.2.7', '<=')).toBeTrue();

		expect(check('1.*', '1.2.7', '<=')).toBeTrue();
		expect(check('1.3.*', '1.2.*', '<=')).toBeFalse();
		expect(check('1.2.7', '1.*', '<=')).toBeTrue();
		expect(check('1.2.4', '1.2.*', '<=')).toBeTrue();
	});

	it('equal (==)', () => {
		expect(check('1.3.0', '1.2.*', '==')).toBeFalse();
		expect(check('1.2.9', '1.2.7', '==')).toBeFalse();
		expect(check('1.2.9', '1.2.9', '==')).toBeTrue();
		expect(check('1.0.0', '1.2.7', '==')).toBeFalse();

		expect(check('1', '1.2.7', '==')).toBeTrue();
		expect(check('1.*', '1.2.7', '==')).toBeTrue();
		expect(check('1.2.7', '1.*', '==')).toBeTrue();
		expect(check('1.2.4', '1.2.*', '==')).toBeTrue();
	});

	it('caret range', () => {
		expect(check('0.8.3', '0.9.0', '^=')).toBeFalse();
		expect(check('0.0.1', '0.0.2', '^=')).toBeFalse();
		expect(check('2.1.0', '1.2.3', '^=')).toBeFalse();

		expect(check('1.2', '2.0', '^=')).toBeFalse();

		expect(check('1', '1.0.0', '^=')).toBeTrue();
		expect(check('2', '2.2.10', '^=')).toBeTrue();
		expect(check('3', '2.0.0', '^=')).toBeFalse();
		expect(check('5', '6', '^=')).toBeFalse();
	});

	it('caret range with x-range', () => {
		expect(check('*', '0.0.2', '^=')).toBeTrue();
		expect(check('1.*', '0.0.5', '^=')).toBeFalse();
		expect(check('1.*', '1.0.2', '^=')).toBeTrue();
		expect(check('1.*', '1.2.3', '^=')).toBeTrue();
		expect(check('1.2.*', '2.0.0', '^=')).toBeFalse();

		expect(check('1.2.*', '2.0.0', '^=')).toBeFalse();
		expect(check('1.2.3', '2.*', '^=')).toBeFalse();
		expect(check('1.2.3', '1.*', '^=')).toBeTrue();
		expect(check('2', '1.*', '^=')).toBeFalse();
	});

	it('expect error', () => {
		expect(() => check(' ', '0.0.2', '^=')).toThrowError(operandLengthErrorText);
		expect(() => check('', '2.0.0', '^=')).toThrowError(operandLengthErrorText);
		expect(() => check('2.0.0', '', '^=')).toThrowError(operandLengthErrorText);
		expect(() => check('', '', '^=')).toThrowError(operandLengthErrorText);
	});
});
