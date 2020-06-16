/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { concatUrls, fromQueryString, toQueryString } from 'core/url';

describe('core/url/concatUrls', () => {
	it('simple concatenation', () => {
		expect(concatUrls('foo/baz', '/bar', 'bla')).toBe('/foo/baz/bar/bla');
	});

	it('concatenation with trailing slashes', () => {
		expect(concatUrls('foo/baz', '/bar/', 'bla/')).toBe('/foo/baz/bar/bla/');
	});

	it('concatenation of URL-s with an absolute path', () => {
		expect(concatUrls('http://foo.bar', 'bla')).toBe('http://foo.bar/bla');
		expect(concatUrls('file:///C://foo.bla', 'bla')).toBe('file:///C://foo.bla/bla');
		expect(concatUrls('/foo', 'http://google.com', 'bla')).toBe('http://google.com/bla');
	});
});

describe('core/url/fromQueryString', () => {
	it('simple parsing', () => {
		expect(fromQueryString('foo=bar')).toEqual({foo: 'bar'});
	});

	it('parsing from querystring', () => {
		expect(fromQueryString('?foo=bar')).toEqual({foo: 'bar'});
		expect(fromQueryString('http://foo.bla?foo=bar')).toEqual({foo: 'bar'});
	});

	it('parsing without decoding', () => {
		expect(fromQueryString('foo=%20bla%20&bar=1', {decode: false})).toEqual({
			foo: '%20bla%20',
			bar: 1
		});
	});

	it('parsing of arrays', () => {
		expect(fromQueryString('foo=1&foo=2')).toEqual({foo: [1, 2]});
	});

	it('parsing of arrays with the array syntax', () => {
		expect(fromQueryString('foo[]=1&foo[]=2', {arraySyntax: true})).toEqual({foo: [1, 2]});
	});

	it('parsing of deep objects', () => {
		expect(fromQueryString('foo_a=1&foo_b=2', {separator: '_'})).toEqual({
			foo: {
				a: 1,
				b: 2
			}
		});
	});

	it('parsing of deep objects with the array syntax', () => {
		expect(fromQueryString('foo[a]=1&foo[b]=2', {arraySyntax: true})).toEqual({
			foo: {
				a: 1,
				b: 2
			}
		});

		expect(fromQueryString('foo[a][b]=1&foo[c]=2', {arraySyntax: true})).toEqual({
			foo: {
				a: {
					b: 1
				},

				c: 2
			}
		});
	});

	it('parsing with converting', () => {
		expect(fromQueryString('foo=1&bar=true&baz=null')).toEqual({foo: 1, bar: true, baz: null});
		expect(fromQueryString('json={"foo": 1}')).toEqual({json: {foo: 1}});
	});

	it('parsing without converting', () => {
		expect(fromQueryString('foo=1&bar=true&baz=null', {convert: false})).toEqual({
			foo: '1',
			bar: 'true',
			baz: 'null'
		});

		expect(fromQueryString('json={"foo": 1}', {convert: false})).toEqual({json: '{"foo": 1}'});
	});
});

describe('core/url/toQueryString', () => {
	it('simple serializing', () => {
		expect(toQueryString({foo: 'bar'})).toBe('foo=bar');
	});

	it('serializing without encoding', () => {
		expect(toQueryString({foo: ' bla '})).toBe('foo=%20bla%20');
		expect(toQueryString({foo: ' bla '}, {encode: false})).toBe('foo= bla ');
	});

	it('serializing of arrays', () => {
		expect(toQueryString({foo: [1, 2]})).toBe('foo=1&foo=2');
	});

	it('serializing of arrays with the array syntax', () => {
		expect(toQueryString({foo: [1, 2]}, {arraySyntax: true})).toBe('foo[]=1&foo[]=2');
	});

	it('serializing of deep objects', () => {
		expect(toQueryString({foo: {a: 1, b: 2}})).toBe('foo_a=1&foo_b=2');
		expect(toQueryString({foo: {a: 1, b: 2}}, {separator: '.'})).toBe('foo.a=1&foo.b=2');
	});

	it('serializing of deep objects with the array syntax', () => {
		expect(toQueryString({foo: {a: 1, b: 2}}, {arraySyntax: true})).toBe('foo[a]=1&foo[b]=2');
		expect(toQueryString({foo: {a: {b: 1}, c: 2}}, {arraySyntax: true})).toBe('foo[a][b]=1&foo[c]=2');
	});
});
