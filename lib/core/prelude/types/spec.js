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
    expect(Object.isTruly(false)).toBeFalse();
    expect(Object.isTruly(0)).toBeFalse();
    expect(Object.isTruly('')).toBeFalse();
    expect(Object.isTruly(undefined)).toBeFalse();
    expect(Object.isTruly(null)).toBeFalse();
    expect(Object.isTruly(Object(false))).toBeTrue();
  });
  it('`Object.isPrimitive`', () => {
    expect(Object.isPrimitive('')).toBeTrue();
    expect(Object.isPrimitive(Symbol('primitive'))).toBeTrue();
    expect(Object.isPrimitive(false)).toBeTrue();
    expect(Object.isPrimitive(0)).toBeTrue();
    expect(Object.isPrimitive(null)).toBeTrue();
    expect(Object.isPrimitive(undefined)).toBeTrue();
    expect(Object.isPrimitive(Object(true))).toBeFalse();
  });
  it('`Object.isUndef`', () => {
    expect(Object.isUndef(undefined)).toBeTrue();
    expect(Object.isUndef(null)).toBeFalse();
    expect(Object.isUndef(0)).toBeFalse();
    expect(Object.isUndef('')).toBeFalse();
  });
  it('`Object.isNull`', () => {
    expect(Object.isNull(null)).toBeTrue();
    expect(Object.isNull(undefined)).toBeFalse();
    expect(Object.isNull(0)).toBeFalse();
    expect(Object.isNull('')).toBeFalse();
  });
  it('`Object.isNullable`', () => {
    expect(Object.isNullable(null)).toBeTrue();
    expect(Object.isNullable(undefined)).toBeTrue();
    expect(Object.isNullable(0)).toBeFalse();
    expect(Object.isNullable('')).toBeFalse();
  });
  it('`Object.isString`', () => {
    expect(Object.isString('')).toBeTrue();
    expect(Object.isString(Object(''))).toBeFalse();
    expect(Object.isString(null)).toBeFalse();
  });
  it('`Object.isNumber`', () => {
    expect(Object.isNumber(0)).toBeTrue();
    expect(Object.isNumber(Infinity)).toBeTrue();
    expect(Object.isNumber(NaN)).toBeTrue();
    expect(Object.isNumber(Object(0))).toBeFalse();
    expect(Object.isNumber(null)).toBeFalse();

    if (typeof BigInt !== 'undefined') {
      expect(Object.isNumber(1n)).toBeFalse();
    }
  });
  it('`Object.isBoolean`', () => {
    expect(Object.isBoolean(false)).toBeTrue();
    expect(Object.isBoolean(Object(true))).toBeFalse();
    expect(Object.isBoolean(1)).toBeFalse();
    expect(Object.isBoolean(null)).toBeFalse();
  });
  it('`Object.isSymbol`', () => {
    expect(Object.isSymbol(Symbol('symbol'))).toBeTrue();
    expect(Object.isSymbol(Symbol.iterator)).toBeTrue();
    expect(Object.isSymbol('foo')).toBeFalse();
    expect(Object.isSymbol(null)).toBeFalse();
  });
  it('`Object.isRegExp`', () => {
    expect(Object.isRegExp(/\d/)).toBeTrue(); // eslint-disable-next-line prefer-regex-literals

    expect(Object.isRegExp(new RegExp('\\d'))).toBeTrue();
    expect(Object.isRegExp('foo')).toBeFalse();
    expect(Object.isRegExp(null)).toBeFalse();
  });
  it('`Object.isDate`', () => {
    expect(Object.isDate(new Date())).toBeTrue();
    expect(Object.isDate(new Date(NaN))).toBeTrue();
    expect(Object.isDate(Date.now())).toBeFalse();
    expect(Object.isDate(null)).toBeFalse();
  });
  it('`Object.isArray`', () => {
    expect(Object.isArray([])).toBeTrue();
    expect(Object.isArray({
      length: 0
    })).toBeFalse();
    expect(Object.isArray({
      length: 1,
      0: 1
    })).toBeFalse();
    expect(Object.isArray('')).toBeFalse();
    expect(Object.isArray('foo')).toBeFalse();
    expect(Object.isArray(null)).toBeFalse();
  });
  it('`Object.isArrayLike`', () => {
    expect(Object.isArrayLike([])).toBeTrue();
    expect(Object.isArrayLike({
      length: 0
    })).toBeTrue();
    expect(Object.isArrayLike({
      length: 1,
      0: 1
    })).toBeTrue();
    expect(Object.isArrayLike('')).toBeTrue();
    expect(Object.isArrayLike('foo')).toBeTrue();
    expect(Object.isArrayLike({
      0: 1
    })).toBeFalse();
    expect(Object.isArrayLike(null)).toBeFalse();
  });
  it('`Object.isMap`', () => {
    expect(Object.isMap(new Map())).toBeTrue();
    expect(Object.isMap(new WeakMap())).toBeFalse();
    expect(Object.isMap(null)).toBeFalse();
  });
  it('`Object.isWeakMap`', () => {
    expect(Object.isWeakMap(new WeakMap())).toBeTrue();
    expect(Object.isWeakMap(new Map())).toBeFalse();
    expect(Object.isWeakMap(null)).toBeFalse();
  });
  it('`Object.isSet`', () => {
    expect(Object.isSet(new Set())).toBeTrue();
    expect(Object.isSet(new WeakSet())).toBeFalse();
    expect(Object.isSet(null)).toBeFalse();
  });
  it('`Object.isWeakSet`', () => {
    expect(Object.isWeakSet(new WeakSet())).toBeTrue();
    expect(Object.isWeakSet(new Set())).toBeFalse();
    expect(Object.isWeakSet(null)).toBeFalse();
  });
  it('`Object.isDictionary`', () => {
    class Foo {}

    expect(Object.isDictionary({})).toBeTrue();
    expect(Object.isDictionary(Object.create(null))).toBeTrue();
    expect(Object.isDictionary(Object.create({}))).toBeTrue();
    expect(Object.isDictionary(Object.create(new Foo()))).toBeFalse();
    expect(Object.isDictionary([])).toBeFalse();
  });
  it('`Object.isPlainObject`', () => {
    class Foo {}

    expect(Object.isPlainObject({})).toBeTrue();
    expect(Object.isPlainObject(Object.create(null))).toBeTrue();
    expect(Object.isPlainObject(Object.create({}))).toBeTrue();
    expect(Object.isPlainObject(Object.create(new Foo()))).toBeFalse();
    expect(Object.isPlainObject([])).toBeFalse();
  });
  it('`Object.isCustomObject`', () => {
    class Foo {}

    expect(Object.isCustomObject({})).toBeTrue();
    expect(Object.isCustomObject(Object.create(null))).toBeTrue();
    expect(Object.isCustomObject(new Foo())).toBeTrue();
    expect(Object.isCustomObject(new Date())).toBeFalse();
    expect(Object.isCustomObject([])).toBeFalse();
  });
  it('`Object.isSimpleObject`', () => {
    class Foo {}

    expect(Object.isSimpleObject({})).toBeTrue();
    expect(Object.isSimpleObject(Object.create(null))).toBeTrue();
    expect(Object.isSimpleObject(new Foo())).toBeTrue();
    expect(Object.isSimpleObject(new Date())).toBeFalse();
    expect(Object.isSimpleObject([])).toBeFalse();
    expect(Object.isSimpleObject({
      [Symbol.toStringTag]: 'boom'
    })).toBeFalse();
  });
  it('`Object.isFunction`', () => {
    function foo() {}

    const bar = () => {};

    function* baz() {}

    expect(Object.isFunction(foo)).toBeTrue();
    expect(Object.isFunction(bar)).toBeTrue();
    expect(Object.isFunction(baz)).toBeTrue();
    expect(Object.isFunction(null)).toBeFalse();
  });
  it('`Object.isSimpleFunction`', () => {
    function foo() {}

    const bar = () => {};

    function* baz() {}

    expect(Object.isFunction(foo)).toBeTrue();
    expect(Object.isFunction(bar)).toBeTrue();
    expect(Object.isFunction(baz)).toBeTrue();
    expect(Object.isFunction(null)).toBeFalse();
  });
  it('`Object.isGenerator`', () => {
    function foo() {}

    const bar = new Function('return () => {}')(),
          baz = new Function('return function* baz() {}')();
    expect(Object.isGenerator(baz)).toBeTrue();
    expect(Object.isGenerator(foo)).toBeFalse();
    expect(Object.isGenerator(bar)).toBeFalse();
    expect(Object.isGenerator(null)).toBeFalse();
  });
  it('`Object.isIterator`', () => {
    function* baz() {}

    expect(Object.isIterator([].values())).toBeTrue();
    expect(Object.isIterator([])).toBeFalse();
    expect(Object.isIterator(baz)).toBeFalse();
    expect(Object.isIterator(null)).toBeFalse();
  });
  it('`Object.isIterable`', () => {
    expect(Object.isIterable([])).toBeTrue();
    expect(Object.isIterable([].values())).toBeTrue();
    expect(Object.isIterable('')).toBeTrue();
    expect(Object.isIterable({})).toBeFalse();
    expect(Object.isIterable(null)).toBeFalse();
  });
  it('`Object.isPromise`', () => {
    expect(Object.isPromise(Promise.resolve())).toBeTrue();
    expect(Object.isPromise({
      then: () => {},
      catch: () => {}
    })).toBeTrue();
    expect(Object.isPromise({
      then: () => {}
    })).toBeFalse();
    expect(Object.isPromise(null)).toBeFalse();
  });
  it('`Object.isPromiseLike`', () => {
    expect(Object.isPromiseLike(Promise.resolve())).toBeTrue();
    expect(Object.isPromiseLike({
      then: () => {}
    })).toBeTrue();
    expect(Object.isPromiseLike(null)).toBeFalse();
  });
});