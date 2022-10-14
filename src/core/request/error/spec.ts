/* eslint-disable max-lines, max-lines-per-function */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import RequestError, { RequestErrorDetailsExtractor } from 'core/request/error';
import V4Headers from 'core/request/headers';

describe('core/request/error', () => {
	let err;

	beforeEach(() => {
		// TODO
		err = new RequestError(RequestError.Timeout, {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			request: {
				url: 'url/url',

				query: {googleIt: 'yes'},
				body: 'request body',

				method: 'POST',
				contentType: 'application/json; charset=utf-8',
				credentials: false,

				headers: new V4Headers({
					content: 'json',
					token: 'important token',
					foo: 'bla'
				})
			},
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			response: {
				status: 404,
				body: 'not found',
				headers: new V4Headers({
					content: 'xml',
					token: 'other token',
					foo: 'bla'
				})
			}
		});
	});

	describe('`RequestErrorDetailsExtractor`', () => {
		it('should extract information from the passed error', () => {
			const
				extractor = new RequestErrorDetailsExtractor();

			expect(extractor.extract(err)).toEqual({
				type: 'timeout',
				status: 404,

				url: 'url/url',
				query: {googleIt: 'yes'},

				method: 'POST',
				contentType: 'application/json; charset=utf-8',
				withCredentials: false,

				requestBody: 'request body',
				responseBody: 'not found',

				requestHeaders: new V4Headers({
					content: 'json',
					token: 'important token',
					foo: 'bla'
				}),

				responseHeaders: new V4Headers({
					content: 'xml',
					token: 'other token',
					foo: 'bla'
				})
			});
		});

		it('should extract information from the passed error, keeping only those headers that are explicitly specified', () => {
			const extractor = new RequestErrorDetailsExtractor({
				headers: {include: ['content', 'foo']}
			});

			expect(extractor.extract(err)).toEqual({
				type: 'timeout',
				status: 404,

				url: 'url/url',
				query: {googleIt: 'yes'},

				method: 'POST',
				contentType: 'application/json; charset=utf-8',
				withCredentials: false,

				requestBody: 'request body',
				responseBody: 'not found',

				requestHeaders: new V4Headers({
					content: 'json',
					foo: 'bla'
				}),

				responseHeaders: new V4Headers({
					content: 'xml',
					foo: 'bla'
				})
			});
		});

		it('should extract information from the passed error, excluding those headers that are explicitly specified', () => {
			const extractor = new RequestErrorDetailsExtractor({
				headers: {exclude: ['token']}
			});

			expect(extractor.extract(err)).toEqual({
				type: 'timeout',
				status: 404,

				url: 'url/url',
				query: {googleIt: 'yes'},

				method: 'POST',
				contentType: 'application/json; charset=utf-8',
				withCredentials: false,

				requestBody: 'request body',
				responseBody: 'not found',

				requestHeaders: new V4Headers({
					content: 'json',
					foo: 'bla'
				}),

				responseHeaders: new V4Headers({
					content: 'xml',
					foo: 'bla'
				})
			});
		});

		it('should ignore the `exclude` option when `include` is passed', () => {
			const extractor = new RequestErrorDetailsExtractor({
				headers: {
					include: ['content'],
					exclude: ['content', 'token']
				}
			});

			expect(extractor.extract(err)).toEqual({
				type: 'timeout',
				status: 404,

				url: 'url/url',
				query: {googleIt: 'yes'},

				method: 'POST',
				contentType: 'application/json; charset=utf-8',
				withCredentials: false,

				requestBody: 'request body',
				responseBody: 'not found',

				requestHeaders: new V4Headers({
					content: 'json'
				}),

				responseHeaders: new V4Headers({
					content: 'xml'
				})
			});
		});
	});
});
