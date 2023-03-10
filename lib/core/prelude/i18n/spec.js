"use strict";

var _i18n = require("../../../core/prelude/i18n");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/prelude/i18n', () => {
  describe('text pluralization', () => {
    it('using pluralization constants to choose the right form', () => {
      const input = {
        forms: ['first form', 'second form', 'third form', 'fourth form'],
        count: ['one', 'some', 'many', 'none']
      };
      input.forms.forEach((form, index) => {
        expect((0, _i18n.pluralizeText)(input.forms, input.count[index])).toBe(form);
      });
    });
    it('using a number to choose the right form of pluralization', () => {
      const input = {
        forms: ['first form', 'second form', 'third form', 'fourth form'],
        count: [1, 2, 100, 0]
      };
      input.forms.forEach((form, index) => {
        expect((0, _i18n.pluralizeText)(input.forms, input.count[index])).toBe(form);
      });
    });
    it('if the `count` parameter is invalid, then the default pluralization form should be returned', () => {
      const input = {
        forms: [true, false, false, false],
        count: 'Some invalid count'
      };
      expect((0, _i18n.pluralizeText)(input.forms, input.count)).toBe(true);
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
      const res = (0, _i18n.resolveTemplate)(['one {count}', 'two {count}', 'five {count}', 'zero {count}'], {
        count: 5
      });
      expect(res).toBe('five 5');
    });
  });
});