/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { pluralizeText, resolveTemplate } from 'core/prelude/i18n';
import { getPluralFormName } from 'core/prelude/i18n/helpers';

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

	describe('pluralization forms detection', () => {
		it('detecting plural form without Intl rules', () => {
			expect(getPluralFormName(0)).toBe('zero');
			expect(getPluralFormName(1)).toBe('one');
			expect(getPluralFormName(2)).toBe('few');
			expect(getPluralFormName(5)).toBe('many');
		});

		it('detecting plural form using Intl rules', () => {
			expect(getPluralFormName(0, rules)).toBe('other');
			expect(getPluralFormName(1, rules)).toBe('one');
			expect(getPluralFormName(2, rules)).toBe('other');
			expect(getPluralFormName(5, rules)).toBe('other');
		});
	});

	describe('text pluralization', () => {
		it('using pluralization constants to choose the right form', () => {
			formNames.forEach((form) => {
				expect(pluralizeText(forms, {count: form, rules})).toBe(forms[form]);
			});
		});

		it('using a number to choose the right form of pluralization', () => {
			const input = {
				forms,
				count: [1, 2, 100, 0]
			};

			[forms.one, forms.other, forms.other, forms.other].forEach((form, index) => {
				expect(pluralizeText(input.forms, {count: input.count[index], rules})).toBe(form);
			});
		});

		it('return one form if correct form does not exists', () => {
			const input = {
				forms,
				count: [1, 2, 100, 0]
			};

			[forms.one, forms.one, forms.one, forms.one].forEach((form, index) => {
				expect(pluralizeText({one: input.forms.one}, {count: input.count[index], rules})).toBe(form);
			});
		});
	});

	describe('substitution of variables and pluralization forms in a template', () => {
		it('template resolving without additional parameters', () => {
			expect(resolveTemplate('foo bar baz')).toBe('foo bar baz');
		});

		it('passing variables for template resolving', () => {
			const tpl = 'foo {macros} {macros2}';
			expect(resolveTemplate(tpl, {params: {macros: 'bar', macros2: 'baz'}})).toBe('foo bar baz');
		});

		it('if the variable is not set, then it should be displayed as text', () => {
			const tpl = 'foo {macros} {macros2}';
			expect(resolveTemplate(tpl, {params: {macros: 'bar'}})).toBe('foo bar macros2');
		});

		it('passing the `count` parameter for template resolving', () => {
			const res1 = resolveTemplate({
				one: 'one {count}',
				few: 'few {count}',
				many: 'many {count}',
				other: 'other {count}'
			}, {params: {count: 5}, pluralRules: rules});

			const res2 = resolveTemplate({
				one: 'one {count}',
				few: 'few {count}',
				many: 'many {count}',
				other: 'other {count}'
			}, {params: {count: 1}, pluralRules: rules});

			expect(res1).toBe('other 5');
			expect(res2).toBe('one 1');
		});
	});

	describe('pluralization for cyrillic language', () => {
		it('russian language with Intl', () => {
			const
				cyrillicRules = new Intl.PluralRules('ru'),
				forms = {
					one: '{count} яблоко',
					few: '{count} яблока',
					many: '{count} яблок',
					zero: '{count} яблок'
				};

			expect(resolveTemplate(forms, {params: {count: 1}, pluralRules: cyrillicRules})).toBe('1 яблоко');
			expect(resolveTemplate(forms, {params: {count: 2}, pluralRules: cyrillicRules})).toBe('2 яблока');
			expect(resolveTemplate(forms, {params: {count: 0}, pluralRules: cyrillicRules})).toBe('0 яблок');
			expect(resolveTemplate(forms, {params: {count: 12}, pluralRules: cyrillicRules})).toBe('12 яблок');
			expect(resolveTemplate(forms, {params: {count: 22}, pluralRules: cyrillicRules})).toBe('22 яблока');
		});

		it('russian language without Intl', () => {
			const
				forms = {
					one: '{count} яблоко',
					few: '{count} яблока',
					many: '{count} яблок',
					zero: '{count} яблок'
				};

			expect(resolveTemplate(forms, {params: {count: 1}})).toBe('1 яблоко');
			expect(resolveTemplate(forms, {params: {count: 2}})).toBe('2 яблока');
			expect(resolveTemplate(forms, {params: {count: 0}})).toBe('0 яблок');
			expect(resolveTemplate(forms, {params: {count: 12}})).toBe('12 яблок');
			expect(resolveTemplate(forms, {params: {count: 22}})).toBe('22 яблок');
		});
	});
});
