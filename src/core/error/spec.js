/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import BaseError from 'core/error';
import { TestError } from 'core/error/testing';

describe('BaseError', () => {
	describe('inheritance.', () => {
		it('BaseError is instance of Error', () => {
			const e = new BaseError();
			expect(e instanceof Error).toBeTrue();
		});

		it('BaseError is instance of itself', () => {
			const e = new BaseError();
			expect(e instanceof BaseError).toBeTrue();
		});

		it('An error derived from BaseError is instance of Error', () => {
			const e = new TestError();
			expect(e instanceof Error).toBeTrue();
		});

		it('An error derived from BaseError is instance of BaseError', () => {
			const e = new TestError();
			expect(e instanceof BaseError).toBeTrue();
		});

		it('An error derived from BaseError is instance of itself', () => {
			const e = new TestError();
			expect(e instanceof TestError).toBeTrue();
		});
	});

	describe('fields.', () => {
		it('BaseError has no enumerable fields', () => {
			const e = new BaseError();
			expect(Object.keys(e)).toEqual([]);
		});
	});
});
