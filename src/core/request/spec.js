/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { set, get } from 'core/env';
import request, { globalOpts, RequestError } from 'core/request';

describe('core/request', () => {
	let
		api,
		logOptions;

	beforeAll(async () => {
		api = globalOpts.api;
		globalOpts.api = 'https://run.mocky.io';
		logOptions = await get('log');
		set('log', {patterns: []});
	});

	afterAll(() => {
		globalOpts.api = api;
		set('log', logOptions);
	});

	it('blob get', async () => {
		const req = await request('https://google.com/favicon.ico');
		expect(req.data.type).toBe('image/x-icon');
		expect(req.data.size).toBe(12693);
	});

	it('json get', async () => {
		expect((await request('https://run.mocky.io/v3/bc04b660-5e52-4c10-a58c-539fb854516b')).data)
			.toEqual({hello: 'world'});
	});

	it('json get with caching', async (done) => {
		const
			url = 'https://run.mocky.io/v3/bc04b660-5e52-4c10-a58c-539fb854516b',
			get = request({cacheStrategy: 'forever', cacheTTL: 10});

		await get(url);

		const
			req = await get(url);

		expect(req.cache).toBe('memory');
		expect(req.data).toEqual({hello: 'world'});

		setTimeout(async () => {
			{
				const
					req = await get(url);

				expect(req.cache).toBeUndefined();
				expect(req.data).toEqual({hello: 'world'});
				req.dropCache();
			}

			{
				const
					req = await get(url);

				expect(req.cache).toBeUndefined();
				expect(req.data).toEqual({hello: 'world'});
			}

			done();
		}, 15);
	});

	it('text/xml get', async () => {
		expect((await request('https://run.mocky.io/v3/69575792-41b0-4857-8e74-b87b1f55fbf1')).data.querySelector('foo').textContent)
			.toBe('Hello world');
	});

	it('application/xml get', async () => {
		expect((await request('https://run.mocky.io/v3/676b051e-3fb3-4bf5-b2c6-79732445eb44')).data.querySelector('foo').textContent)
			.toBe('Hello world');
	});

	it('xml get with a query', async () => {
		const
			{data} = await request('http://3878g.mocklab.io/search', {query: {q: 'bla'}});

		expect(data.querySelector('results').children[0].textContent)
			.toBe('one');
	});

	it('json post', async () => {
		const req = await request('http://3878g.mocklab.io/json', {
			method: 'POST',
			body: {
				id: 12345,
				value: 'abc-def-ghi'
			}
		});

		expect(req.data)
			.toEqual({message: 'Success'});

		expect(req.response.status)
			.toBe(201);

		expect(req.response.ok)
			.toBeTrue();
	});

	it('json post with the specified response status', async () => {
		try {
			await request('http://3878g.mocklab.io/json', {
				method: 'POST',
				okStatuses: 200,
				body: {
					id: 12345,
					value: 'abc-def-ghi'
				}
			});

		} catch (err) {
			expect(err).toBeInstanceOf(RequestError);
			expect(err.type).toBe('invalidStatus');
			expect(err.message).toBe('API error, type: invalidStatus');
			expect(err.details.request.method).toBe('POST');
			expect(err.details.response.status).toBe(201);
		}
	});

	it('json post with encoders/decoders', async () => {
		const req = await request('http://3878g.mocklab.io/json', {
			method: 'POST',

			encoder: [
				(data) => {
					data.id = 12345;
					return Promise.resolve(data);
				},

				(data) => {
					data.value = data.value.join('-');
					return data;
				}
			],

			decoder: (data) => {
				data.message = 'ok';
				return data;
			},

			body: {
				value: ['abc', 'def', 'ghi']
			}
		});

		expect(req.data)
			.toEqual({message: 'ok'});

		expect(req.response.status)
			.toBe(201);
	});

	it('json post with middlewares', async () => {
		const req = await request('http://3878g.mocklab.io/json', {
			method: 'POST',

			middlewares: {
				addId({opts}) {
					opts.body.id = 12345;
				},

				serializeValue({opts}) {
					opts.body.value = opts.body.value.join('-');
				}
			},

			body: {
				value: ['abc', 'def', 'ghi']
			}
		});

		expect(req.data)
			.toEqual({message: 'Success'});

		expect(req.response.status)
			.toBe(201);
	});

	it('json post with the middleware that return a function', async () => {
		const req = await request('http://3878g.mocklab.io/json', {
			method: 'POST',

			middlewares: {
				fakeResponse({ctx}) {
					return () => ctx.wrapAsResponse({message: 'fake'});
				}
			},

			body: {
				value: ['abc', 'def', 'ghi']
			}
		});

		expect(req.data)
			.toEqual({message: 'fake'});

		expect(req.response.status)
			.toBe(200);
	});

	it('json put with headers', async () => {
		const req = await request('http://3878g.mocklab.io/json/2', {
			method: 'PUT',
			headers: {
				Accept: 'application/json'
			}
		});

		expect(req.data)
			.toBe('{"message": "Success"}');

		expect(req.response.getHeader('Content-Type'))
			.toBeUndefined();

		expect(await req.response.json())
			.toEqual({message: 'Success'});

		expect(req.response.status)
			.toBe(200);
	});

	it('providing the API schema', async () => {
		const req = await request('/json/1', {
			api: {
				protocol: 'http',
				domain3: '3878g',
				domain2: () => 'mocklab',
				zone: 'io'
			}
		});

		expect(req.data).toEqual({
			id: 1,
			value: 'things'
		});

		expect(req.response.status).toBe(200);
	});

	it('request builder', async () => {
		const
			get = request({api: {protocol: 'http', zone: 'io'}})({api: {domain3: '3878g', domain2: 'mocklab'}}),
			req = await get('/json/1');

		expect(req.data).toEqual({
			id: 1,
			value: 'things'
		});

		expect(req.response.status).toBe(200);
	});

	it('request factory', async () => {
		const
			resolver = (url, params, type) => type === 'get' ? '/json/1' : '',
			get = request('http://3878g.mocklab.io', resolver),
			req = await get('get');

		expect(req.data).toEqual({
			id: 1,
			value: 'things'
		});

		expect(req.response.status).toBe(200);
	});

	it('request factory with rewriting of URL', async () => {
		const
			resolver = () => ['https://run.mocky.io/v3/', 'bc04b660-5e52-4c10-a58c-539fb854516b'],
			get = request('http://3878g.mocklab.io', resolver),
			req = await get();

		expect(req.data).toEqual({hello: 'world'});
		expect(req.response.status).toBe(200);
	});

	it('404', async () => {
		let err;

		try {
			await request('http://3878g.mocklab.io/bla');

		} catch (e) {
			err = e;
		}

		expect(err).toBeInstanceOf(RequestError);
		expect(err.type).toBe('invalidStatus');
		expect(err.message).toBe('API error, type: invalidStatus');
		expect(err.details.request.method).toBe('GET');
		expect(err.details.response.status).toBe(404);
	});

	it('aborting of a request', async () => {
		let err;

		try {
			const req = request('https://run.mocky.io/v3/bc04b660-5e52-4c10-a58c-539fb854516b');
			req.abort();
			await req;

		} catch (e) {
			err = e;
		}

		expect(err).toBeInstanceOf(RequestError);
		expect(err.type).toBe('abort');
		expect(err.message).toBe('API error, type: abort');
		expect(err.details.request.method).toBe('GET');
		expect(err.details.response).toBeUndefined();
	});
});
