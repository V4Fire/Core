/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import check from 'core/semver';

describe('core/semver', () => {
	it('gt', () => {
		expect(check('1.4.1', '1.5.2', '>')).toBeFalse();
		expect(check('1.5.3', '1.5.2', '>')).toBeTrue();
	});

	it('gte', () => {
		expect(check('1.4.1', '1.5.2', '>=')).toBeFalse();
		expect(check('1.5.2', '1.5.2', '>=')).toBeTrue();
	});

	it('lt', () => {
		expect(check('1.4.1', '1.5.2', '<')).toBeTrue();
		expect(check('1.5.3', '1.5.2', '<')).toBeFalse();
	});

	it('lte', () => {
		expect(check('1.5.2', '1.5.2', '<=')).toBeTrue();
		expect(check('1.5.3', '1.5.2', '<=')).toBeFalse();
	});

	it('eq', () => {
		expect(check('1.5.2', '1.5.2', '==')).toBeTrue();
		expect(check('1.5.3', '1.5.2', '==')).toBeFalse();
	});

	it('liquid eq', () => {
		expect(check('1.0.0', '1.5.2', '^=')).toBeTrue();
		expect(check('1.0.0', '2.5.2', '^=')).toBeFalse();
		expect(check('0.8.1', '0.9.0', '^=')).toBeFalse();
		expect(check('0.0.1', '0.0.2', '^=')).toBeFalse();
	});
});
