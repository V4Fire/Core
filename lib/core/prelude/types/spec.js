"use strict";

/* eslint-disable no-empty-function, no-new-func */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/prelude/types', () => {
  it('`Object.isTruly`', () => {
    expect(Object.isTruly(false)).toBe(false);
    expect(Object.isTruly(0)).toBe(false);
    expect(Object.isTruly('')).toBe(false);
    expect(Object.isTruly(undefined)).toBe(false);
    expect(Object.isTruly(null)).toBe(false);
    expect(Object.isTruly(Object(false))).toBe(true);
  });
  it('`Object.isPrimitive`', () => {
    expect(Object.isPrimitive('')).toBe(true);
    expect(Object.isPrimitive(Symbol('primitive'))).toBe(true);
    expect(Object.isPrimitive(false)).toBe(true);
    expect(Object.isPrimitive(0)).toBe(true);
    expect(Object.isPrimitive(null)).toBe(true);
    expect(Object.isPrimitive(undefined)).toBe(true);
    expect(Object.isPrimitive(Object(true))).toBe(false);
  });
  it('`Object.isUndef`', () => {
    expect(Object.isUndef(undefined)).toBe(true);
    expect(Object.isUndef(null)).toBe(false);
    expect(Object.isUndef(0)).toBe(false);
    expect(Object.isUndef('')).toBe(false);
  });
  it('`Object.isNull`', () => {
    expect(Object.isNull(null)).toBe(true);
    expect(Object.isNull(undefined)).toBe(false);
    expect(Object.isNull(0)).toBe(false);
    expect(Object.isNull('')).toBe(false);
  });
  it('`Object.isNullable`', () => {
    expect(Object.isNullable(null)).toBe(true);
    expect(Object.isNullable(undefined)).toBe(true);
    expect(Object.isNullable(0)).toBe(false);
    expect(Object.isNullable('')).toBe(false);
  });
  it('`Object.isString`', () => {
    expect(Object.isString('')).toBe(true);
    expect(Object.isString(Object(''))).toBe(false);
    expect(Object.isString(null)).toBe(false);
  });
  it('`Object.isNumber`', () => {
    expect(Object.isNumber(0)).toBe(true);
    expect(Object.isNumber(Infinity)).toBe(true);
    expect(Object.isNumber(NaN)).toBe(true);
    expect(Object.isNumber(Object(0))).toBe(false);
    expect(Object.isNumber(null)).toBe(false);

    if (typeof BigInt !== 'undefined') {
      expect(Object.isNumber(1n)).toBe(false);
    }
  });
  it('`Object.isBoolean`', () => {
    expect(Object.isBoolean(false)).toBe(true);
    expect(Object.isBoolean(Object(true))).toBe(false);
    expect(Object.isBoolean(1)).toBe(false);
    expect(Object.isBoolean(null)).toBe(false);
  });
  it('`Object.isSymbol`', () => {
    expect(Object.isSymbol(Symbol('symbol'))).toBe(true);
    expect(Object.isSymbol(Symbol.iterator)).toBe(true);
    expect(Object.isSymbol('foo')).toBe(false);
    expect(Object.isSymbol(null)).toBe(false);
  });
  it('`Object.isRegExp`', () => {
    expect(Object.isRegExp(/\d/)).toBe(true); // eslint-disable-next-line prefer-regex-literals

    expect(Object.isRegExp(new RegExp('\\d'))).toBe(true);
    expect(Object.isRegExp('foo')).toBe(false);
    expect(Object.isRegExp(null)).toBe(false);
  });
  it('`Object.isDate`', () => {
    expect(Object.isDate(new Date())).toBe(true);
    expect(Object.isDate(new Date(NaN))).toBe(true);
    expect(Object.isDate(Date.now())).toBe(false);
    expect(Object.isDate(null)).toBe(false);
  });
  it('`Object.isArray`', () => {
    expect(Object.isArray([])).toBe(true);
    expect(Object.isArray({
      length: 0
    })).toBe(false);
    expect(Object.isArray({
      length: 1,
      0: 1
    })).toBe(false);
    expect(Object.isArray('')).toBe(false);
    expect(Object.isArray('foo')).toBe(false);
    expect(Object.isArray(null)).toBe(false);
  });
  it('`Object.isArrayLike`', () => {
    expect(Object.isArrayLike([])).toBe(true);
    expect(Object.isArrayLike({
      length: 0
    })).toBe(true);
    expect(Object.isArrayLike({
      length: 1,
      0: 1
    })).toBe(true);
    expect(Object.isArrayLike('')).toBe(true);
    expect(Object.isArrayLike('foo')).toBe(true);
    expect(Object.isArrayLike({
      0: 1
    })).toBe(false);
    expect(Object.isArrayLike(null)).toBe(false);
  });
  it('`Object.isMap`', () => {
    expect(Object.isMap(new Map())).toBe(true);
    expect(Object.isMap(new WeakMap())).toBe(false);
    expect(Object.isMap(null)).toBe(false);
  });
  it('`Object.isWeakMap`', () => {
    expect(Object.isWeakMap(new WeakMap())).toBe(true);
    expect(Object.isWeakMap(new Map())).toBe(false);
    expect(Object.isWeakMap(null)).toBe(false);
  });
  it('`Object.isSet`', () => {
    expect(Object.isSet(new Set())).toBe(true);
    expect(Object.isSet(new WeakSet())).toBe(false);
    expect(Object.isSet(null)).toBe(false);
  });
  it('`Object.isWeakSet`', () => {
    expect(Object.isWeakSet(new WeakSet())).toBe(true);
    expect(Object.isWeakSet(new Set())).toBe(false);
    expect(Object.isWeakSet(null)).toBe(false);
  });
  it('`Object.isDictionary`', () => {
    class Foo {}

    expect(Object.isDictionary({})).toBe(true);
    expect(Object.isDictionary(Object.create(null))).toBe(true);
    expect(Object.isDictionary(Object.create({}))).toBe(true);
    expect(Object.isDictionary(Object.create(new Foo()))).toBe(false);
    expect(Object.isDictionary([])).toBe(false);
  });
  it('`Object.isPlainObject`', () => {
    class Foo {}

    expect(Object.isPlainObject({})).toBe(true);
    expect(Object.isPlainObject(Object.create(null))).toBe(true);
    expect(Object.isPlainObject(Object.create({}))).toBe(true);
    expect(Object.isPlainObject(Object.create(new Foo()))).toBe(false);
    expect(Object.isPlainObject([])).toBe(false);
  });
  it('`Object.isCustomObject`', () => {
    class Foo {}

    expect(Object.isCustomObject({})).toBe(true);
    expect(Object.isCustomObject(Object.create(null))).toBe(true);
    expect(Object.isCustomObject(new Foo())).toBe(true);
    expect(Object.isCustomObject(new Date())).toBe(false);
    expect(Object.isCustomObject([])).toBe(false);
  });
  it('`Object.isSimpleObject`', () => {
    class Foo {}

    expect(Object.isSimpleObject({})).toBe(true);
    expect(Object.isSimpleObject(Object.create(null))).toBe(true);
    expect(Object.isSimpleObject(new Foo())).toBe(true);
    expect(Object.isSimpleObject(new Date())).toBe(false);
    expect(Object.isSimpleObject([])).toBe(false);
    expect(Object.isSimpleObject({
      [Symbol.toStringTag]: 'boom'
    })).toBe(false);
  });
  it('`Object.isFunction`', () => {
    function foo() {}

    const bar = () => {};

    function* baz() {}

    expect(Object.isFunction(foo)).toBe(true);
    expect(Object.isFunction(bar)).toBe(true);
    expect(Object.isFunction(baz)).toBe(true);
    expect(Object.isFunction(null)).toBe(false);
  });
  it('`Object.isSimpleFunction`', () => {
    function foo() {}

    const bar = () => {};

    function* baz() {}

    expect(Object.isFunction(foo)).toBe(true);
    expect(Object.isFunction(bar)).toBe(true);
    expect(Object.isFunction(baz)).toBe(true);
    expect(Object.isFunction(null)).toBe(false);
  });
  it('`Object.isGenerator`', () => {
    function foo() {}

    const bar = new Function('return () => {}')(),
          baz = new Function('return function* baz() {}')();
    expect(Object.isGenerator(baz)).toBe(true);
    expect(Object.isGenerator(foo)).toBe(false);
    expect(Object.isGenerator(bar)).toBe(false);
    expect(Object.isGenerator(null)).toBe(false);
  });
  it('`Object.isIterator`', () => {
    function* baz() {}

    expect(Object.isIterator([].values())).toBe(true);
    expect(Object.isIterator([])).toBe(false);
    expect(Object.isIterator(baz)).toBe(false);
    expect(Object.isIterator(null)).toBe(false);
  });
  it('`Object.isIterable`', () => {
    expect(Object.isIterable([])).toBe(true);
    expect(Object.isIterable([].values())).toBe(true);
    expect(Object.isIterable('')).toBe(true);
    expect(Object.isIterable({})).toBe(false);
    expect(Object.isIterable(null)).toBe(false);
  });
  it('`Object.isPromise`', () => {
    expect(Object.isPromise(Promise.resolve())).toBe(true);
    expect(Object.isPromise({
      then: () => {},
      catch: () => {}
    })).toBe(true);
    expect(Object.isPromise({
      then: () => {}
    })).toBe(false);
    expect(Object.isPromise(null)).toBe(false);
  });
  it('`Object.isPromiseLike`', () => {
    expect(Object.isPromiseLike(Promise.resolve())).toBe(true);
    expect(Object.isPromiseLike({
      then: () => {}
    })).toBe(true);
    expect(Object.isPromiseLike(null)).toBe(false);
  });
});