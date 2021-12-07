"use strict";

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/prelude/regexp', () => {
  it('`RegExp.escape`', () => {
    expect(RegExp.escape('(\\d+[a-z].*)')).toBe('\\(\\\\d\\+\\[a\\-z\\]\\.\\*\\)');
  });
  it('`RegExp.test`', () => {
    const rgxp = /\d/g;
    expect(RegExp.test(rgxp, '12')).toBe(true);
    expect(RegExp.test(rgxp, '1d')).toBe(true);
    expect(RegExp.test('1d')(rgxp)).toBe(true);
    expect(RegExp.test(rgxp)('d1d')).toBe(true);
    expect(RegExp.test(/\d/, 'd1d')).toBe(true);
  });
  it('`addFlags`', () => {
    expect(/1/.addFlags('g').flags).toBe('g');
    expect(/1/i.addFlags('gm', 'si', 'y', 'i').flags).toBe('gimsy');
  });
  it('`RegExp.addFlags`', () => {
    expect(RegExp.addFlags(/1/, 'g').flags).toBe('g');
    expect(RegExp.addFlags(/1/i)('gm', 'si', 'y', 'i').flags).toBe('gimsy');
    expect(RegExp.addFlags('g')(/1/m).flags).toBe('gm');
  });
  it('`removeFlags`', () => {
    expect(/1/gi.removeFlags('g').flags).toBe('i');
    expect(/1/gimsy.removeFlags('gm', 'si', 'i').flags).toBe('y');
  });
  it('`RegExp.removeFlags`', () => {
    expect(RegExp.removeFlags(/1/gi, 'g').flags).toBe('i');
    expect(RegExp.removeFlags(/1/gimsy)('gm', 'si', 'i').flags).toBe('y');
    expect(RegExp.removeFlags('g')(/1/i).flags).toBe('i');
  });
  it('`setFlags`', () => {
    expect(/1/gi.setFlags('g').flags).toBe('g');
    expect(/1/y.setFlags('gm', 'si', 'i').flags).toBe('gims');
  });
  it('`RegExp.setFlags`', () => {
    expect(RegExp.setFlags(/1/gi, 'g').flags).toBe('g');
    expect(RegExp.setFlags(/1/u)('gm', 'si', 'i').flags).toBe('gims');
    expect(RegExp.setFlags('g')(/1/i).flags).toBe('g');
  });
});