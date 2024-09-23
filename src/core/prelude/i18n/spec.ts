/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { pluralizeText, resolveTemplate } from 'core/prelude/i18n';

describe('core/prelude/i18n', () => {
	const rules = new Intl.PluralRules('en');

	const forms = {
		one: 'first form',
		two: 'second form',
		few: 'third form',
		many: 'fifth form',
		zero: 'zeroth form',
		other: 'others form'
	};

	const formNames = <Array<keyof typeof forms>>Object.keys(forms);

	describe('text pluralization', () => {
		it('using pluralization constants to choose the right form', () => {
			formNames.forEach((form) => {
				expect(pluralizeText(forms, form, rules)).toBe(forms[form]);
			});
		});

		it('using a number to choose the right form of pluralization', () => {
			const input = {
				forms,
				count: [1, 2, 100, 0]
			};

			[forms.one, forms.other, forms.other, forms.other].forEach((form, index) => {
				expect(pluralizeText(input.forms, input.count[index], rules)).toBe(form);
			});
		});
	});

	describe('substitution of variables and pluralization forms in a template', () => {
		it('template resolving without additional parameters', () => {
			expect(resolveTemplate('foo bar baz')).toBe('foo bar baz');
		});

		it('passing variables for template resolving', () => {
			const tpl = 'foo {macros} {macros2}';
			expect(resolveTemplate(tpl, {vars: {macros: 'bar', macros2: 'baz'}})).toBe('foo bar baz');
		});

		it('if the variable is not set, then it should be displayed as text', () => {
			const tpl = 'foo {macros} {macros2}';
			expect(resolveTemplate(tpl, {vars: {macros: 'bar'}})).toBe('foo bar macros2');
		});

		it('passing the `count` parameter for template resolving', () => {
			const res = resolveTemplate({
				one: 'one {count}',
				few: 'few {count}',
				many: 'many {count}',
				other: 'other {count}'
			}, {count: 5, rules});

			expect(res).toBe('other 5');
		});

		it('override `count` shortcut variable', () => {
			const res = resolveTemplate({
				one: 'one {count}',
				few: 'few {count}',
				many: 'many {count}',
				other: 'other {count}'
			}, {count: 5, rules, vars: {count: 12}});

			expect(res).toBe('other 12');
		});
	});

	describe('pluralization for cyrillic language', () => {
		it('russian language', () => {
			const
				rules = Intl.PluralRules('ru'),
				forms = {
					one: '{count} яблоко',
					few: '{count} яблока',
					many: '{count} яблок',
					zero: '{count} яблок'
				};

			expect(resolveTemplate(forms, {count: 2, rules})).toBe('2 яблока');
			expect(resolveTemplate(forms, {count: 0, rules})).toBe('0 яблок');
			expect(resolveTemplate(forms, {count: 12, rules})).toBe('12 яблок');
			expect(resolveTemplate(forms, {count: 22, rules})).toBe('22 яблока');
		});
	});
});
