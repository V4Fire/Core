/* eslint-disable max-lines-per-function */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import express from 'express';
import { set, get } from 'core/env';

import Provider, { provider } from 'core/data';
import baseRequest, { globalOpts, RequestError } from 'core/request';
import { defaultRequestOpts } from 'core/request/const';

import nodeEngine from 'core/request/engines/node';
import fetchEngine from 'core/request/engines/fetch';
import xhrEngine from 'core/request/engines/xhr';
import createProviderEngine from 'core/request/engines/provider';

@provider
class TestRequestChainProvider extends Provider {
	static request = Provider.request({
		engine: createProviderEngine(Provider)
	});
}

const
	emptyBodyStatuses = [204, 304];

describe('core/request', () => {
	const engines = new Map([
		['node', nodeEngine],
		['fetch', fetchEngine],
		['xhr', xhrEngine],
		['provider', createProviderEngine('Provider')],
		['chain provider', createProviderEngine(TestRequestChainProvider)]
	]);

	let
		request,
		defaultEngine,
		logOptions;

	let
		api,
		server;

	beforeAll(async () => {
		api = globalOpts.api;
		globalOpts.api = 'https://run.mocky.io';

		logOptions = await get('log');
		set('log', {patterns: []});

		defaultEngine = defaultRequestOpts.engine;
	});

	beforeEach(() => {
		if (server) {
			server.close();
		}

		server = createServer();
	});

	afterAll((done) => {
		globalOpts.api = api;

		server.close(done);
		defaultRequestOpts.engine = defaultEngine;

		set('log', logOptions);
	});

	// eslint-disable-next-line max-lines-per-function
	engines.forEach((engine, name) => {
		describe(`with the "${name}" engine`, () => {
			beforeAll(() => {
				if (name.includes('provider')) {
					defaultRequestOpts.engine = defaultEngine;
					request = baseRequest({engine});

				} else {
					defaultRequestOpts.engine = engine;
					request = baseRequest;
				}
			});

			it('blob `get`', async () => {
				const req = await request('http://localhost:3000/favicon.ico');
				expect(req.data.type).toBe('image/x-icon');
				expect(req.data.size).toBe(1150);
			});

			it('json `get`', async () => {
				expect((await request('http://localhost:3000/json/1')).data)
					.toEqual({id: 1, value: 'things'});
			});

			it('json `get` with caching', async () => {
				const
					url = 'http://localhost:3000/json/1',
					get = request({cacheStrategy: 'forever', cacheTTL: 10});

				await get(url);

				const
					req = await get(url);

				expect(req.cache).toBe('memory');
				expect(req.data).toEqual({id: 1, value: 'things'});

				return new Promise(((resolve) => {
					setTimeout(async () => {
						{
							const
								req = await get(url);

							expect(req.cache).toBeUndefined();
							expect(req.data).toEqual({id: 1, value: 'things'});
							req.dropCache();
						}

						{
							const
								req = await get(url);

							expect(req.cache).toBeUndefined();
							expect(req.data).toEqual({id: 1, value: 'things'});
						}

						resolve();
					}, 15);
				}));
			});

			it('text/xml `get`', async () => {
				expect((await request('http://localhost:3000/xml/text')).data.querySelector('foo').textContent)
					.toBe('Hello world');
			});

			it('application/xml `get`', async () => {
				expect((await request('http://localhost:3000/xml/app')).data.querySelector('foo').textContent)
					.toBe('Hello world');
			});

			it('xml `get` with a query', async () => {
				const
					{data} = await request('http://localhost:3000/search', {query: {q: 'bla'}});

				expect(data.querySelector('results').children[0].textContent)
					.toBe('one');
			});

			it('json `post`', async () => {
				const req = await request('http://localhost:3000/json', {
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

			it('json `post` with the specified response status', async () => {
				try {
					await request('http://localhost:3000/json', {
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
					expect(err.message).toBe('[invalidStatus] POST http://localhost:3000/json 201');
					expect(err.details.request.method).toBe('POST');
					expect(err.details.response.status).toBe(201);
				}
			});

			it('json `post` with encoders/decoders', async () => {
				const req = await request('http://localhost:3000/json', {
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

			it('json `post` with middlewares', async () => {
				const req = await request('http://localhost:3000/json', {
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

			it('json `post` with the middleware that return a function', async () => {
				const req = await request('http://localhost:3000/json', {
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

			it('json `put` with headers', async () => {
				const req = await request('http://localhost:3000/json/2', {
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
				const req = await request('/1', {
					api: {
						protocol: 'http',
						zone: () => 'localhost',
						domain2: '',
						domain3: '',
						port: 3000,
						namespace: 'json'
					}
				});

				expect(req.data)
					.toEqual({
						id: 1,
						value: 'things'
					});

				expect(req.response.status)
					.toBe(200);
			});

			it('resolving API schema to URL', async () => {
				let
					resolvedUrl;

				const engine = (params) => {
					resolvedUrl = params.url;
					return Promise.resolve({
						ok: true,
						decode: () => ''
					});
				};

				await request('/then', {
					api: {
						protocol: 'https',
						domain3: 'docs',
						domain2: () => 'v4fire',
						zone: 'rocks',
						port: 8123,
						namespace: 'core'
					},
					engine
				});

				expect(resolvedUrl).toEqual('https://docs.v4fire.rocks:8123/core/then');
			});

			it('request builder', async () => {
				let get = request({api: {protocol: 'http', port: 3000, domain3: ''}});
				get = get({api: {zone: 'localhost', namespace: 'json', domain2: ''}});

				const
					req = await get('/1');

				expect(req.data).toEqual({
					id: 1,
					value: 'things'
				});

				expect(req.response.status).toBe(200);
			});

			it('request factory', async () => {
				const
					resolver = (url, params, type) => type === 'get' ? '/json/1' : '',
					get = request('http://localhost:3000', resolver),
					req = await get('get');

				expect(req.data).toEqual({
					id: 1,
					value: 'things'
				});

				expect(req.response.status).toBe(200);
			});

			it('request factory with rewriting of URL', async () => {
				const
					resolver = () => ['http://localhost:3000', 'json', 1],
					get = request('https://run.mocky.io/v3/', resolver),
					req = await get();

				expect(req.data).toEqual({id: 1, value: 'things'});
				expect(req.response.status).toBe(200);
			});

			it('404', async () => {
				let err;

				try {
					await request('http://localhost:3000/bla');

				} catch (e) {
					err = e;
				}

				expect(err).toBeInstanceOf(RequestError);
				expect(err.type).toBe('invalidStatus');
				expect(err.message).toBe('[invalidStatus] GET http://localhost:3000/bla 404');
				expect(err.details.request.method).toBe('GET');
				expect(err.details.response.status).toBe(404);
			});

			it('aborting of a request', async () => {
				let err;

				try {
					const req = request('http://localhost:3000/json/1');
					req.abort();
					await req;

				} catch (e) {
					err = e;
				}

				expect(err).toBeInstanceOf(RequestError);
				expect(err.type).toBe('abort');
				expect(err.message).toBe('[abort] GET http://localhost:3000/json/1');
				expect(err.details.request.method).toBe('GET');
				expect(err.details.response).toBeUndefined();
			});

			it('request with a low timeout', async () => {
				let err;

				try {
					await request('http://localhost:3000/delayed', {timeout: 100});

				} catch (e) {
					err = e;
				}

				expect(err).toBeInstanceOf(RequestError);
				expect(err.type).toBe('timeout');
				expect(err.message).toBe('[timeout]');
				expect(err.details.response).toBeUndefined();
			});

			it('request with a high timeout', async () => {
				const req = await request('http://localhost:3000/delayed', {timeout: 500});
				expect(req.response.ok).toBeTrue();
			});

			describe('responses with no message body', () => {
				for (const status of emptyBodyStatuses) {
					it(`response with ${status} status`, async () => {
						const req = await request(`http://localhost:3000/octet/${status}`, {okStatuses: status});
						expect(req.data).toBe(null);
					});
				}
			});

			it('retrying of a request', async () => {
				const req = request('http://localhost:3000/retry', {
					retry: {
						attempts: 5,
						delay: () => 0
					}
				});

				const body = await (await req).response.json();
				expect(body.tryNumber).toBe(4);
			});

			it('retrying of a request with the specified delay between tries', async () => {
				await retryDelayTest(() => 200, 200);
			});

			it('retrying of a request with the specified promisify delay between tries', async () => {
				await retryDelayTest(() => new Promise((res) => setTimeout(res, 200)), 200);
			});

			it('retrying with the speeduped response', async () => {
				const req = await request('http://localhost:3000/retry/speedup', {
					timeout: 300,
					retry: 2
				});

				expect(req.response.ok).toBeTrue();

				const body = await req.response.json();
				expect(body.tryNumber).toBe(2);
			});

			it('failing after given attempts', async () => {
				try {
					await request('http://localhost:3000/retry/bad', {retry: 3});

				} catch (err) {
					const
						body = await err.details.response.json();

					expect(err).toBeInstanceOf(RequestError);
					expect(err.type).toBe('invalidStatus');
					expect(err.message).toBe('[invalidStatus] GET http://localhost:3000/retry/bad 500');

					expect(err.details.request.method).toBe('GET');
					expect(err.details.response.status).toBe(500);

					expect(body.tryNumber).toEqual(3);
				}
			});

			async function retryDelayTest(delay, delayMS) {
				const startTime = new Date().getTime();

				const req = request('http://localhost:3000/retry', {
					retry: {
						attempts: 5,
						delay
					}
				});

				const
					body = await (await req).response.json(),
					firstRequest = body.times.shift(),
					requestDelays = body.times.reduce((acc, time, i) => acc.concat(time - firstRequest - i * delayMS), []);

				expect(firstRequest - startTime).toBeLessThan(delayMS);
				requestDelays.forEach((time) => expect(time).toBeGreaterThanOrEqual(delayMS));
			}
		});
	});
});

function createServer() {
	const serverApp = express();
	serverApp.use(express.json());

	serverApp.get('/json/1', (req, res) => {
		res.status(200).json({id: 1, value: 'things'});
	});

	serverApp.put('/json/2', (req, res) => {
		if (req.get('Accept') === 'application/json') {
			res.status(200).end('{"message": "Success"}');

		} else {
			res.sendStatus(422);
		}
	});

	serverApp.post('/json', (req, res) => {
		const
			{body} = req;

		if (body.id === 12345 && body.value === 'abc-def-ghi') {
			res.status(201).json({message: 'Success'});

		} else {
			res.sendStatus(422);
		}
	});

	serverApp.get('/xml/text', (req, res) => {
		res.type('text/xml');
		res.status(200).send('<foo>Hello world</foo>');
	});

	serverApp.get('/xml/app', (req, res) => {
		res.type('application/xml');
		res.status(200).send('<foo>Hello world</foo>');
	});

	serverApp.get('/search', (req, res) => {
		const
			{query} = req;

		if (query.q != null && /^[A-Za-z0-9]*$/.test(query.q)) {
			res.type('application/xml');
			res.status(200);
			res.send('<results><result>one</result><result>two</result><result>three</result></results>');

		} else {
			res.sendStatus(422);
		}
	});

	serverApp.get('/delayed', (req, res) => {
		setTimeout(() => {
			res.sendStatus(200);
		}, 300);
	});

	serverApp.get('/favicon.ico', (req, res) => {
		const
			faviconInBase64 = 'AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAnISL6JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL5JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL1JyEi9ichIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEihCchIpgnISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEixCUgIRMmICEvJyEi5ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIrYnISKSJyEi9ichIlxQREUAHxobAichIo4nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISJeJyEiICchIuAnISJJJiAhbCYgITgmICEnJyEi4ichIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEiXichIiAnISLdJyEihichIuknISKkIRwdBCchIoUnISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIl4nISIgJyEi4ichIu4nISL/JyEi8CYgIT8mICEhJyEi3CchIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISJeJyEiHychIuUnISL/JyEi/ychIv8nISKrIh0eBiYhInwnISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEiXSYgITUnISLvJyEi/ychIv8nISL/JyEi9CYgIUcmICEbJyEi1ichIv8nISL/JyEi/ychIv8nISL/JyEi/ichImknISKjJyEi/ychIv8nISL/JyEi/ychIv8nISKzIRwdBiYhIX0nISL/JyEi/ychIv8nISL/JyEi/ychIvwnISK+JyEi9CchIv8nISL/JyEi/ychIv8nISL/JyEi9yYhIoonISKzJyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ichIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL6JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

		res.type('image/x-icon');
		res.send(Buffer.from(faviconInBase64, 'base64'));
	});

	for (const status of emptyBodyStatuses) {
		serverApp.get(`/octet/${status}`, (req, res) => {
			res.type('application/octet-stream').status(status).end();
		});
	}

	const
		triesBeforeSuccess = 3,
		requestTimes = [];

	let
		tryNumber = 0,
		speed = 600;

	serverApp.get('/retry', (req, res) => {
		requestTimes.push(new Date().getTime());

		if (tryNumber <= triesBeforeSuccess) {
			res.sendStatus(500);
			tryNumber++;

		} else {
			res.status(200);
			res.json({
				tryNumber,
				times: requestTimes
			});
		}
	});

	serverApp.get('/retry/speedup', (req, res) => {
		setTimeout(() => {
			res.status(200);
			res.json({tryNumber});
			tryNumber++;
		}, speed);

		speed -= 200;
	});

	serverApp.get('/retry/bad', (req, res) => {
		res.status(500);
		res.json({tryNumber});
		tryNumber++;
	});

	return serverApp.listen(3000);
}
