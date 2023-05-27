"use strict";

var _url = require("../../core/url");
describe('core/url/concatURLs', () => {
  it('simple concatenation', () => {
    expect((0, _url.concatURLs)('foo/baz', '/bar', 'bla')).toBe('foo/baz/bar/bla');
    expect((0, _url.concatURLs)('/foo/baz', '/bar', 'bla')).toBe('/foo/baz/bar/bla');
  });
  it('concatenation with trailing slashes', () => {
    expect((0, _url.concatURLs)('/foo/baz///', '/////bar//', '/bla/')).toBe('/foo/baz/bar/bla/');
  });
  it('concatenation of URL-s with an absolute path', () => {
    expect((0, _url.concatURLs)('///foo.bar', 'bla')).toBe('//foo.bar/bla');
    expect((0, _url.concatURLs)('http://foo.bar', 'bla')).toBe('http://foo.bar/bla');
    expect((0, _url.concatURLs)('file:///C://foo.bla', 'bla')).toBe('file:///C://foo.bla/bla');
    expect((0, _url.concatURLs)('/foo', 'http://google.com', 'bla')).toBe('http://google.com/bla');
  });
});
describe('core/url/fromQueryString', () => {
  it('simple parsing', () => {
    expect((0, _url.fromQueryString)('foo=bar')).toEqual({
      foo: 'bar'
    });
  });
  it('parsing from querystring', () => {
    expect((0, _url.fromQueryString)('?foo=bar')).toEqual({
      foo: 'bar'
    });
    expect((0, _url.fromQueryString)('?foo=bar&bla=10')).toEqual({
      foo: 'bar',
      bla: 10
    });
  });
  it('parsing from a relative URL', () => {
    expect((0, _url.fromQueryString)('/foo/bar/baz')).toEqual({
      '/foo/bar/baz': null
    });
    expect((0, _url.fromQueryString)('/foo/bar/baz?baz=1')).toEqual({
      baz: 1
    });
    expect((0, _url.fromQueryString)('/foo/bar/baz?baz=1&bar=true')).toEqual({
      baz: 1,
      bar: true
    });
  });
  it('parsing from an absolute URL', () => {
    expect((0, _url.fromQueryString)('http://foo.bla?foo=bar')).toEqual({
      foo: 'bar'
    });
    expect((0, _url.fromQueryString)('http://foo.bla/bar/baz?foo=bar')).toEqual({
      foo: 'bar'
    });
    expect((0, _url.fromQueryString)('http://foo.bla/bar/baz')).toEqual({});
    expect((0, _url.fromQueryString)('wss://foo.bla/bar/baz?foo=bar')).toEqual({
      foo: 'bar'
    });
    expect((0, _url.fromQueryString)('wss://foo.bla/bar/baz')).toEqual({});
  });
  it('parsing with encoded special symbols', () => {
    expect((0, _url.fromQueryString)(`a=${encodeURIComponent('b=c')}`)).toEqual({
      a: 'b=c'
    });
    expect((0, _url.fromQueryString)(`a=${encodeURIComponent('d=1&b=c')}&e=1`)).toEqual({
      a: 'd=1&b=c',
      e: 1
    });
  });
  it('parsing without decoding', () => {
    expect((0, _url.fromQueryString)('foo=%20bla%20&bar=1', {
      decode: false
    })).toEqual({
      foo: '%20bla%20',
      bar: 1
    });
  });
  it('parsing of arrays', () => {
    expect((0, _url.fromQueryString)('foo=1&foo=2')).toEqual({
      foo: [1, 2]
    });
  });
  it('parsing of arrays with the array syntax', () => {
    expect((0, _url.fromQueryString)('foo[]=1&foo[]=2', {
      arraySyntax: true
    })).toEqual({
      foo: [1, 2]
    });
  });
  it('parsing of deep objects', () => {
    expect((0, _url.fromQueryString)('foo_a=1&foo_b=2', {
      separator: '_'
    })).toEqual({
      foo: {
        a: 1,
        b: 2
      }
    });
  });
  it('parsing of deep objects with the array syntax', () => {
    expect((0, _url.fromQueryString)('foo[a]=1&foo[b]=2', {
      arraySyntax: true
    })).toEqual({
      foo: {
        a: 1,
        b: 2
      }
    });
    expect((0, _url.fromQueryString)('foo[a][b]=1&foo[c]=2', {
      arraySyntax: true
    })).toEqual({
      foo: {
        a: {
          b: 1
        },
        c: 2
      }
    });
  });
  it('parsing with converting', () => {
    expect((0, _url.fromQueryString)('foo=1&bar=true&baz=null')).toEqual({
      foo: 1,
      bar: true,
      baz: null
    });
    expect((0, _url.fromQueryString)('json={"foo": 1}')).toEqual({
      json: {
        foo: 1
      }
    });
  });
  it('parsing without converting', () => {
    expect((0, _url.fromQueryString)('foo=1&bar=true&baz=null', {
      convert: false
    })).toEqual({
      foo: '1',
      bar: 'true',
      baz: 'null'
    });
    expect((0, _url.fromQueryString)('json={"foo": 1}', {
      convert: false
    })).toEqual({
      json: '{"foo": 1}'
    });
  });
  it('prototype pollution', () => {
    const res = (0, _url.fromQueryString)('__proto__[hack]=boom', {
      arraySyntax: true
    });
    expect(res).toEqual({});
    expect(res.__proto__).toEqual({});
  });
});
describe('core/url/toQueryString', () => {
  it('simple serializing', () => {
    expect((0, _url.toQueryString)({
      foo: 'bar'
    })).toBe('foo=bar');
  });
  it('serializing without encoding', () => {
    expect((0, _url.toQueryString)({
      foo: ' bla '
    })).toBe('foo=%20bla%20');
    expect((0, _url.toQueryString)({
      foo: ' bla '
    }, {
      encode: false
    })).toBe('foo= bla ');
  });
  it('serializing of arrays', () => {
    expect((0, _url.toQueryString)({
      foo: [1, 2]
    })).toBe('foo=1&foo=2');
  });
  it('serializing of arrays with the array syntax', () => {
    expect((0, _url.toQueryString)({
      foo: [1, 2]
    }, {
      arraySyntax: true
    })).toBe('foo[]=1&foo[]=2');
  });
  it('serializing of deep objects', () => {
    expect((0, _url.toQueryString)({
      foo: {
        a: 1,
        b: 2
      }
    })).toBe('foo_a=1&foo_b=2');
    expect((0, _url.toQueryString)({
      foo: {
        a: 1,
        b: 2
      }
    }, {
      separator: '.'
    })).toBe('foo.a=1&foo.b=2');
  });
  it('serializing of deep objects with the array syntax', () => {
    expect((0, _url.toQueryString)({
      foo: {
        a: 1,
        b: 2
      }
    }, {
      arraySyntax: true
    })).toBe('foo[a]=1&foo[b]=2');
    expect((0, _url.toQueryString)({
      foo: {
        a: {
          b: 1
        },
        c: 2
      }
    }, {
      arraySyntax: true
    })).toBe('foo[a][b]=1&foo[c]=2');
  });
  it('serializing of deep objects with the array syntax and providing `paramsFilter`', () => {
    const opts = {
      paramsFilter: () => true,
      arraySyntax: true
    };
    {
      const obj = {
        foo: {
          a: null,
          b: undefined
        }
      };
      expect((0, _url.toQueryString)(obj, opts)).toBe('foo[a]=&foo[b]=');
    }
    {
      const obj = {
        foo: {
          a: [undefined, null, '', 1],
          c: {
            d: undefined
          },
          b: ''
        },
        bar: null
      };
      expect((0, _url.toQueryString)(obj, opts)).toBe('bar=&foo[a][]=&foo[a][]=&foo[a][]=&foo[a][]=1&foo[b]=&foo[c][d]=');
    }
    {
      const obj = {
        foo: [1],
        bar: {
          bla: 2
        }
      };
      expect((0, _url.toQueryString)(obj, {
        ...opts,
        paramsFilter: (el, key) => key !== 'bla'
      })).toBe('foo[]=1');
    }
  });
});