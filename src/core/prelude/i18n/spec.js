/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { pluralizeText, resolveTemplate } from 'core/prelude/i18n';

describe('core/prelude/i18n', () => {
	describe('pluralizeText', () => {
		it('works with pluralize forms', () => {
			const input = {
				forms: ['first form', 'second form', 'third form', 'fourth form'],
				count: ['one', 'some', 'many', 'none']
			};

			input.forms.forEach((form, index) => {
				const result = pluralizeText(input.forms, input.count[index]);

				expect(result).toBe(form);
			});
		});

		it('works with numbers', () => {
			const input = {
				forms: ['first form', 'second form', 'third form', 'fourth form'],
				count: [1, 2, 100, 0]
			};

			input.forms.forEach((form, index) => {
				const result = pluralizeText(input.forms, input.count[index]);

				expect(result).toBe(form);
			});
		});

		it('If count is invalid return default form', () => {
			const input = {
				forms: [true, false, false, false],
				count: 'Some invalid count'
			};

			const result = pluralizeText(input.forms, input.count);

			expect(result).toBe(true);
		});
	});

	describe('resolveTemplate', () => {
		it('work without second argument', () => {
			const
				string = 'foo bar baz',
				result = resolveTemplate(string);

			expect(result).toBe(string);
		});

		it('valid resolve macros', () => {
			const
				string = 'foo {macros} baz',
				result = resolveTemplate(string, {macros: 'bar'});

			expect(result).toBe('foo bar baz');
		});

		it('work with multiply macros', () => {
			const
				string = 'foo {macros} {macros2}',
				result = resolveTemplate(string, {macros: 'bar', macros2: 'baz'});

			expect(result).toBe('foo bar baz');
		});

		it('count with pluralize', () => {
			const
				result = resolveTemplate([
					'one {count}',
					'two {count}',
					'five {count}',
					'zero {count}'
				], {count: 5});

			expect(result).toBe('five 5');
		});

		it('if macros undeclared, used it as value', () => {
			const
				string = 'foo {macros} {macros2}',
				result = resolveTemplate(string, {macros: 'bar'});

			expect(result).toBe('foo bar macros2');
		});
	});
});
