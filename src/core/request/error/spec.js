/* eslint-disable max-lines, max-lines-per-function */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import RequestError from 'core/request/error';
import { RequestErrorDetailsExtractor } from 'core/request/error';
import V4Headers from 'core/request/headers';

describe('core/request/error', () => {
	let err;

	beforeEach(() => {
		err = new RequestError(RequestError.Timeout, {
			request: {
				url: 'url/url',
				method: 'POST',
				query: {googleIt: 'yes'},
				contentType: 'application/json; charset=utf-8',
				credentials: false,
				body: 'request body',
				headers: {
					content: 'json',
					token: 'important token',
					foo: 'bla'
				}
			},
			response: {
				status: 404,
				body: 'not found',
				headers: {
					content: 'xml',
					token: 'other token',
					foo: 'bla'
				}
			}
		});
	});

	it('extract', () => {
		const extractor = new RequestErrorDetailsExtractor();

		const extractedError = extractor.extract(err);

		expect(extractedError).toEqual({
			url: 'url/url',
			type: 'timeout',
			status: 404,
			method: 'POST',
			query: {googleIt: 'yes'},
			contentType: 'application/json; charset=utf-8',
			withCredentials: false,
			requestHeaders: new V4Headers({
				content: 'json',
				token: 'important token',
				foo: 'bla'
			}),
			requestBody: 'request body',
			responseHeaders: new V4Headers({
				content: 'xml',
				token: 'other token',
				foo: 'bla'
			}),
			responseBody: 'not found'
		});
	});

	it('extract with `include` filter for header', () => {
		const extractor = new RequestErrorDetailsExtractor({headers: {include: ['content', 'foo']}});

		const extractedError = extractor.extract(err);

		expect(extractedError).toEqual({
			url: 'url/url',
			type: 'timeout',
			status: 404,
			method: 'POST',
			query: {googleIt: 'yes'},
			contentType: 'application/json; charset=utf-8',
			withCredentials: false,
			requestHeaders: new V4Headers({
				content: 'json',
				foo: 'bla'
			}),
			requestBody: 'request body',
			responseHeaders: new V4Headers({
				content: 'xml',
				foo: 'bla'
			}),
			responseBody: 'not found'
		});
	});

	it('extract with `exclude` filter for header', () => {
		const extractor = new RequestErrorDetailsExtractor({headers: {exclude: ['token']}});

		const extractedError = extractor.extract(err);

		expect(extractedError).toEqual({
			url: 'url/url',
			type: 'timeout',
			status: 404,
			method: 'POST',
			query: {googleIt: 'yes'},
			contentType: 'application/json; charset=utf-8',
			withCredentials: false,
			requestHeaders: new V4Headers({
				content: 'json',
				foo: 'bla'
			}),
			requestBody: 'request body',
			responseHeaders: new V4Headers({
				content: 'xml',
				foo: 'bla'
			}),
			responseBody: 'not found'
		});
	});

	it('extract with both filters for header', () => {
		const extractor = new RequestErrorDetailsExtractor({
			headers: {
				include: ['content'],
				exclude: ['token']
			}
		});

		const extractedError = extractor.extract(err);

		expect(extractedError).toEqual({
			url: 'url/url',
			type: 'timeout',
			status: 404,
			method: 'POST',
			query: {googleIt: 'yes'},
			contentType: 'application/json; charset=utf-8',
			withCredentials: false,
			requestHeaders: new V4Headers({
				content: 'json'
			}),
			requestBody: 'request body',
			responseHeaders: new V4Headers({
				content: 'xml'
			}),
			responseBody: 'not found'
		});
	});
});
