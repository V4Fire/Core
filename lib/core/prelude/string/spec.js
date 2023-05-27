"use strict";

var _const = require("../../../core/prelude/string/const");
describe('core/prelude/string', () => {
  it('`letters`', () => {
    expect('1'.letters().next).toBeInstanceOf(Function);
    expect([...'1😃à🇷🇺👩🏽‍❤️‍💋‍👨'.letters()]).toEqual(['1', '😃', 'à', '🇷🇺', '👩🏽‍❤️‍💋‍👨']);
    expect([...'̀1👨‍🏿⚕️🏿'.letters()]).toEqual(['̀', '1', '👨‍🏿⚕️', '🏿']);
  });
  it('`String.letters`', () => {
    expect(String.letters('1').next).toBeInstanceOf(Function);
    expect([...String.letters('1😃à🇷🇺👩🏽‍❤️‍💋‍👨')]).toEqual(['1', '😃', 'à', '🇷🇺', '👩🏽‍❤️‍💋‍👨']);
  });
  it('`capitalize`', () => {
    expect('hello world😃😡'.capitalize()).toBe('Hello world😃😡');
    expect('HELLO WORLD😃😡'.capitalize()).toBe('HELLO WORLD😃😡');
  });
  it('`capitalize` (extended Unicode)', () => {
    expect('à hello world'.capitalize()).toBe('À hello world');
    expect('😃 hello world'.capitalize()).toBe('😃 hello world');
  });
  it('`capitalize` with lowering', () => {
    expect('hello world'.capitalize({
      lower: true
    })).toBe('Hello world');
    expect('HELLO WORLD'.capitalize({
      lower: true
    })).toBe('Hello world');
  });
  it('`capitalize` all words', () => {
    expect('hello world'.capitalize({
      all: true
    })).toBe('Hello World');
    expect('HELLO WORLD'.capitalize({
      all: true
    })).toBe('HELLO WORLD');
    expect('HELLO WORLD'.capitalize({
      all: true,
      lower: true
    })).toBe('Hello World');
  });
  it('`capitalize` cache', () => {
    expect('cached string'.capitalize()).toBe('Cached string');
    expect(_const.capitalizeCache['false:false:cached string']).toBe('Cached string');
    expect('cached string'.capitalize({
      all: true
    })).toBe('Cached String');
    expect(_const.capitalizeCache['false:true:cached string']).toBe('Cached String');
    expect('cached string'.capitalize({
      lower: true
    })).toBe('Cached string');
    expect(_const.capitalizeCache['true:false:cached string']).toBe('Cached string');
    expect('non cached string'.capitalize({
      cache: false
    })).toBe('Non cached string');
    expect(_const.capitalizeCache['false:false:non cached string']).toBeUndefined();
  });
  it('`String.capitalize`', () => {
    expect(String.capitalize('hello world')).toBe('Hello world');
    expect(String.capitalize('hello world', {
      all: true
    })).toBe('Hello World');
    expect(String.capitalize({
      all: true
    })('hello world')).toBe('Hello World');
  });
  it('`camelize`', () => {
    expect('foo_bar_b-l aBaz😃😡'.camelize()).toBe('FooBarBLABaz😃😡');
    expect('foo_bar_b-l aBaz😃😡'.camelize()).toBe('FooBarBLABaz😃😡');
    expect('foo_bar_b-l aBaz😃😡'.camelize(true)).toBe('FooBarBLABaz😃😡');
    expect('foo_bar_b-l aBaz😃😡'.camelize({
      upper: true
    })).toBe('FooBarBLABaz😃😡');
    expect(''.camelize()).toBe('');
    expect(''.camelize(true)).toBe('');
  });
  it('`camelize` (extended Unicode)', () => {
    expect('Àhello_world'.camelize()).toBe('ÀhelloWorld');
    expect('😃_hello_world'.camelize()).toBe('😃HelloWorld');
  });
  it('`camelize` without capitalizing', () => {
    expect('foo_bar_b-l aBaz'.camelize(false)).toBe('fooBarBLABaz');
    expect('foo_bar_b-l aBaz'.camelize({
      upper: false
    })).toBe('fooBarBLABaz');
    expect('Foo_bar_b-l aBaz'.camelize(false)).toBe('fooBarBLABaz');
    expect(''.camelize(false)).toBe('');
  });
  it('`camelize` cache', () => {
    expect('cached string'.camelize()).toBe('CachedString');
    expect(_const.camelizeCache['true:cached string']).toBe('CachedString');
    expect('cached string'.camelize(false)).toBe('cachedString');
    expect(_const.camelizeCache['false:cached string']).toBe('cachedString');
    expect('non cached string'.camelize({
      cache: false
    })).toBe('NonCachedString');
    expect(_const.camelizeCache['false:false:non cached string']).toBeUndefined();
  });
  it('`String.camelize`', () => {
    expect(String.camelize('foo_bar_b-l aBaz')).toBe('FooBarBLABaz');
    expect(String.camelize('foo_bar_b-l aBaz', false)).toBe('fooBarBLABaz');
    expect(String.camelize('foo_bar_b-l aBaz', {
      upper: false
    })).toBe('fooBarBLABaz');
    expect(String.camelize({
      upper: false
    })('foo_bar_b-l aBaz')).toBe('fooBarBLABaz');
  });
  it('`dasherize`', () => {
    expect('foo_bar_b-l aBaz😃😡'.dasherize()).toBe('foo-bar-b-l-a-baz😃😡');
    expect('FooBarBAZ'.dasherize()).toBe('foo-bar-baz');
    expect('FOOBarBAZ'.dasherize()).toBe('foo-bar-baz');
    expect('p-v4-demo'.dasherize()).toBe('p-v4-demo');
    expect('pV4Demo'.dasherize()).toBe('p-v4-demo');
    expect('p-4v4-demo'.dasherize()).toBe('p-4v4-demo');
    expect('Foo---BAR_432Bla'.dasherize()).toBe('foo-bar-432-bla');
  });
  it('`dasherize` (extended Unicode)', () => {
    expect('FooBarÀZ'.dasherize()).toBe('foo-bar-àz');
  });
  it('stable `dasherize`', () => {
    expect('foo_bar_b-l aBaz'.dasherize(true)).toBe('foo-bar-b-l-a-baz');
    expect('FooBarBAZ'.dasherize(true)).toBe('foo-bar-b-a-z');
    expect('FOOBarBAZ'.dasherize({
      stable: true
    })).toBe('f-o-o-bar-b-a-z');
    expect('pV4Demo'.dasherize(true)).toBe('p-v4-demo');
    expect('p-v4-demo'.dasherize(true)).toBe('p-v4-demo');
    expect('p-4v4-demo'.dasherize(true)).toBe('p-4v4-demo');
    expect('Foo---BAR_432Bla'.dasherize(true)).toBe('foo-b-a-r-432-bla');
  });
  it('`dasherize` cache', () => {
    expect('cached string'.dasherize()).toBe('cached-string');
    expect(_const.dasherizeCache['false:cached string']).toBe('cached-string');
    expect('cached string'.dasherize(true)).toBe('cached-string');
    expect(_const.dasherizeCache['true:cached string']).toBe('cached-string');
    expect('non cached string'.dasherize({
      cache: false
    })).toBe('non-cached-string');
    expect(_const.dasherizeCache['false:false:non cached string']).toBeUndefined();
  });
  it('`String.dasherize`', () => {
    expect(String.dasherize('foo_bar_b-l aBaz')).toBe('foo-bar-b-l-a-baz');
    expect(String.dasherize('FOOBarBAZ', true)).toBe('f-o-o-bar-b-a-z');
    expect(String.dasherize('FOOBarBAZ', {
      stable: true
    })).toBe('f-o-o-bar-b-a-z');
    expect(String.dasherize({
      stable: true
    })('FOOBarBAZ')).toBe('f-o-o-bar-b-a-z');
  });
  it('`underscore`', () => {
    expect('foo_bar_b-l aBaz😃😡'.underscore()).toBe('foo_bar_b_l_a_baz😃😡');
    expect('FooBarBAZ'.underscore()).toBe('foo_bar_baz');
    expect('FOOBarBAZ'.underscore()).toBe('foo_bar_baz');
    expect('p_v4_demo'.underscore()).toBe('p_v4_demo');
    expect('pV4Demo'.underscore()).toBe('p_v4_demo');
    expect('p_4v4_demo'.underscore()).toBe('p_4v4_demo');
    expect('Foo---BAR_432Bla'.underscore()).toBe('foo_bar_432_bla');
  });
  it('`underscore` (extended Unicode)', () => {
    expect('FooBarÀZ'.underscore()).toBe('foo_bar_àz');
  });
  it('stable `underscore`', () => {
    expect('foo_bar_b-l aBaz'.underscore(true)).toBe('foo_bar_b_l_a_baz');
    expect('FooBarBAZ'.underscore(true)).toBe('foo_bar_b_a_z');
    expect('FOOBarBAZ'.underscore({
      stable: true
    })).toBe('f_o_o_bar_b_a_z');
    expect('pV4Demo'.underscore(true)).toBe('p_v4_demo');
    expect('p_v4_demo'.underscore(true)).toBe('p_v4_demo');
    expect('p_4v4_demo'.underscore(true)).toBe('p_4v4_demo');
    expect('Foo---BAR_432Bla'.underscore(true)).toBe('foo_b_a_r_432_bla');
  });
  it('`underscore` cache', () => {
    expect('cached string'.underscore()).toBe('cached_string');
    expect(_const.underscoreCache['false:cached string']).toBe('cached_string');
    expect('cached string'.underscore(true)).toBe('cached_string');
    expect(_const.underscoreCache['true:cached string']).toBe('cached_string');
    expect('non cached string'.underscore({
      cache: false
    })).toBe('non_cached_string');
    expect(_const.underscoreCache['false:false:non cached string']).toBeUndefined();
  });
  it('`String.underscore`', () => {
    expect(String.underscore('foo_bar_b-l aBaz')).toBe('foo_bar_b_l_a_baz');
    expect(String.underscore('FOOBarBAZ', true)).toBe('f_o_o_bar_b_a_z');
    expect(String.underscore('FOOBarBAZ', {
      stable: true
    })).toBe('f_o_o_bar_b_a_z');
    expect(String.underscore({
      stable: true
    })('FOOBarBAZ')).toBe('f_o_o_bar_b_a_z');
  });
});