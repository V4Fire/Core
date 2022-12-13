/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { pluralizeText, resolveTemplate } from 'core/prelude/i18n';

describe('core/prelude/i18n', () => {
	describe('text pluralization', () => {
		it('using pluralization constants to choose the right form', () => {
			const input = {
				forms: ['first form', 'second form', 'third form', 'fourth form'],
				count: ['one', 'some', 'many', 'none']
			};

			input.forms.forEach((form, index) => {
				expect(pluralizeText(input.forms, input.count[index])).toBe(form);
			});
		});

		it('using a number to choose the right form of pluralization', () => {
			const input = {
				forms: ['first form', 'second form', 'third form', 'fourth form'],
				count: [1, 2, 100, 0]
			};

			input.forms.forEach((form, index) => {
				expect(pluralizeText(input.forms, input.count[index])).toBe(form);
			});
		});

		it('if the `count` parameter is invalid, then the default pluralization form should be returned', () => {
			const input = {
				forms: [true, false, false, false],
				count: 'Some invalid count'
			};

			expect(pluralizeText(input.forms, input.count)).toBe(true);
		});
	});

	describe('substitution of variables and pluralization forms in a template', () => {
		it('template resolving without additional parameters', () => {
			expect(resolveTemplate('foo bar baz')).toBe('foo bar baz');
		});

		it('passing variables for template resolving', () => {
			const tpl = 'foo {macros} {macros2}';
			expect(resolveTemplate(tpl, {macros: 'bar', macros2: 'baz'})).toBe('foo bar baz');
		});

		it('if the variable is not set, then it should be displayed as text', () => {
			const tpl = 'foo {macros} {macros2}';
			expect(resolveTemplate(tpl, {macros: 'bar'})).toBe('foo bar macros2');
		});

		it('passing the `count` parameter for template resolving', () => {
			const res = resolveTemplate([
				'one {count}',
				'two {count}',
				'five {count}',
				'zero {count}'
			], {count: 5});

			expect(res).toBe('five 5');
		});
	});
});
