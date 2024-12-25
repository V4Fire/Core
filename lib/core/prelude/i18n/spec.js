"use strict";

var _i18n = require("../../../core/prelude/i18n");
var _helpers = require("../../../core/prelude/i18n/helpers");
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
  const formNames = Object.keys(forms);
  describe('pluralization forms detection', () => {
    it('detecting plural form without Intl rules', () => {
      expect((0, _helpers.getPluralFormName)(0)).toBe('zero');
      expect((0, _helpers.getPluralFormName)(1)).toBe('one');
      expect((0, _helpers.getPluralFormName)(2)).toBe('few');
      expect((0, _helpers.getPluralFormName)(5)).toBe('many');
    });
    it('detecting plural form using Intl rules', () => {
      expect((0, _helpers.getPluralFormName)(0, rules)).toBe('other');
      expect((0, _helpers.getPluralFormName)(1, rules)).toBe('one');
      expect((0, _helpers.getPluralFormName)(2, rules)).toBe('other');
      expect((0, _helpers.getPluralFormName)(5, rules)).toBe('other');
    });
  });
  describe('text pluralization', () => {
    it('using pluralization constants to choose the right form', () => {
      formNames.forEach(form => {
        expect((0, _i18n.pluralizeText)(forms, form, {
          pluralRules: rules
        })).toBe(forms[form]);
      });
    });
    it('using a number to choose the right form of pluralization', () => {
      const input = {
        forms,
        count: [1, 2, 100, 0]
      };
      [forms.one, forms.other, forms.other, forms.other].forEach((form, index) => {
        expect((0, _i18n.pluralizeText)(input.forms, input.count[index], {
          pluralRules: rules
        })).toBe(form);
      });
    });
    it('returns "one" form when required plural form is missing', () => {
      const input = {
        forms,
        count: [1, 2, 100, 0]
      };
      [forms.one, forms.one, forms.one, forms.one].forEach((form, index) => {
        expect((0, _i18n.pluralizeText)({
          one: input.forms.one
        }, input.count[index], {
          pluralRules: rules
        })).toBe(form);
      });
    });
    it('returns "one" form when count is invalid', () => {
      const input = {
        forms
      };
      [forms.one, forms.one, forms.one, forms.one].forEach(form => {
        expect((0, _i18n.pluralizeText)({
          one: input.forms.one
        }, undefined, {
          pluralRules: rules
        })).toBe(form);
      });
    });
  });
  describe('substitution of variables and pluralization forms in a template', () => {
    it('template resolving without additional parameters', () => {
      expect((0, _i18n.resolveTemplate)('foo bar baz')).toBe('foo bar baz');
    });
    it('passing variables for template resolving', () => {
      const tpl = 'foo {macros} {macros2}';
      expect((0, _i18n.resolveTemplate)(tpl, {
        macros: 'bar',
        macros2: 'baz'
      })).toBe('foo bar baz');
    });
    it('if the variable is not set, then it should be displayed as text', () => {
      const tpl = 'foo {macros} {macros2}';
      expect((0, _i18n.resolveTemplate)(tpl, {
        macros: 'bar'
      })).toBe('foo bar macros2');
    });
    it('passing the `count` parameter for template resolving', () => {
      const res1 = (0, _i18n.resolveTemplate)({
        one: 'one {count}',
        few: 'few {count}',
        many: 'many {count}',
        other: 'other {count}'
      }, {
        count: 5
      }, {
        pluralRules: rules
      });
      const res2 = (0, _i18n.resolveTemplate)({
        one: 'one {count}',
        few: 'few {count}',
        many: 'many {count}',
        other: 'other {count}'
      }, {
        count: 1
      }, {
        pluralRules: rules
      });
      expect(res1).toBe('other 5');
      expect(res2).toBe('one 1');
    });
  });
  describe('pluralization for cyrillic language', () => {
    it('russian language with Intl', () => {
      const cyrillicRules = new Intl.PluralRules('ru'),
        forms = {
          one: '{count} яблоко',
          few: '{count} яблока',
          many: '{count} яблок',
          zero: '{count} яблок'
        };
      expect((0, _i18n.resolveTemplate)(forms, {
        count: 1
      }, {
        pluralRules: cyrillicRules
      })).toBe('1 яблоко');
      expect((0, _i18n.resolveTemplate)(forms, {
        count: 2
      }, {
        pluralRules: cyrillicRules
      })).toBe('2 яблока');
      expect((0, _i18n.resolveTemplate)(forms, {
        count: 0
      }, {
        pluralRules: cyrillicRules
      })).toBe('0 яблок');
      expect((0, _i18n.resolveTemplate)(forms, {
        count: 12
      }, {
        pluralRules: cyrillicRules
      })).toBe('12 яблок');
      expect((0, _i18n.resolveTemplate)(forms, {
        count: 22
      }, {
        pluralRules: cyrillicRules
      })).toBe('22 яблока');
    });
    it('russian language without Intl', () => {
      const forms = {
        one: '{count} яблоко',
        few: '{count} яблока',
        many: '{count} яблок',
        zero: '{count} яблок'
      };
      expect((0, _i18n.resolveTemplate)(forms, {
        count: 1
      })).toBe('1 яблоко');
      expect((0, _i18n.resolveTemplate)(forms, {
        count: 2
      })).toBe('2 яблока');
      expect((0, _i18n.resolveTemplate)(forms, {
        count: 0
      })).toBe('0 яблок');
      expect((0, _i18n.resolveTemplate)(forms, {
        count: 12
      })).toBe('12 яблок');
      expect((0, _i18n.resolveTemplate)(forms, {
        count: 22
      })).toBe('22 яблок');
    });
  });
});