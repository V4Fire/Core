/* eslint-disable max-lines */
/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* eslint-disable max-lines-per-function */

import express, { Request, Response } from 'express';

import Async from 'core/async';
import Provider, { DecodersMap, provider } from 'core/data';
import { CompositionProvider, providerCompositionEngine } from 'core/request/engines/provider/composition';

describe('core/request/engines/provider/compositor', () => {
	let server: ReturnType<typeof createServer>;

	beforeAll(() => {
		server = createServer();
	});

	beforeEach(() => {
		server.clearHandles();
	});

	afterAll(async () => {
		await server.destroy();
	});

	it('should return the correct response and makes a request with the correct query parameters', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		@provider
		class TestProviderRequest1 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/1';
		}

		@provider
		class TestProviderRequest2 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/2';
		}

		const
			request1 = (_1, _2, {providerWrapper}) => providerWrapper(new TestProviderRequest1()).get({query: '1'}),
			request2 = (_1, _2, {providerWrapper}) => providerWrapper(new TestProviderRequest2()).get({notQuery: '2'});

		@provider
		class CompositionProvider1 extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: providerCompositionEngine([
					{
						request: request1,
						as: 'request1'
					},
					{
						request: request2,
						as: 'request2'
					}
				])
			});
		}

		const dp = new CompositionProvider1();

		expect(await dp.get().data).toEqual({
      request1: {test: 1},
      request2: {test: 2}
    });

		expect(server.handles.json1.calls.at(0)?.query).toEqual({query: '1'});
		expect(server.handles.json2.calls.at(0)?.query).toEqual({notQuery: '2'});
	});

	it('should end the request with an error if a request error occurs with failCompositionOnError=true', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(401, {});

		@provider
		class TestProviderFailOnError1 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/1';
		}

		@provider
		class TestProviderFailOnError2 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/2';
		}

		const
			request1 = (_1, _2, {providerWrapper}) => providerWrapper(new TestProviderFailOnError1()).get(),
			request2 = (_1, _2, {providerWrapper}) => providerWrapper(new TestProviderFailOnError2()).get();

		@provider
		class CompositionProviderFailOnError extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: providerCompositionEngine([
					{
						request: request1,
						as: 'request1'
					},
					{
						request: request2,
						as: 'request2',
						failCompositionOnError: true
					}
				])
			});
		}

		const dp = new CompositionProviderFailOnError();

		const result = await (async () => {
			try {
				await dp.get();

			} catch (err) {
				const details = err.details.deref();

				return {
					status: details.response.status,
					statusText: details.response.statusText,
					ok: details.response.ok
				};
			}
		})();

		expect(result).toEqual({
				status: 401,
				statusText: 'Unauthorized',
				ok: false
    });
	});

	it('should not end the request with an error if a request error occurs with failCompositionOnError=false', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(401, {});

		@provider
		class TestProviderNotFailOnError1 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/1';
		}

		@provider
		class TestProviderNotFailOnError2 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/2';
		}

		const
			request1 = (_1, _2, {providerWrapper}) => providerWrapper(new TestProviderNotFailOnError1()).get({query: 1}),
			request2 = (_1, _2, {providerWrapper}) => providerWrapper(new TestProviderNotFailOnError2()).get({notQuery: 2});

		@provider
		class CompositionProviderNotFailOnError extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: providerCompositionEngine([
					{
						request: request1,
						as: 'request1'
					},
					{
						request: request2,
						as: 'request2',
						failCompositionOnError: false
					}
				])
			});
		}

		const dp = new CompositionProviderNotFailOnError();

		expect(await dp.get().data).toEqual({
      request1: {test: 1}
    });
	});

	it('should not start the request if requestFilter returns false', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		@provider
		class TestProviderRequestFilterFalse1 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/1';
		}

		@provider
		class TestProviderRequestFilterFalse2 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/2';
		}

		const
			request1 = (_1, _2, {providerWrapper: w}) => w(new TestProviderRequestFilterFalse1()).get({query: 1}),
			request2 = (_1, _2, {providerWrapper: w}) => w(new TestProviderRequestFilterFalse2()).get({notQuery: 2});

		@provider
		class CompositionProviderRequestFilterFalse extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: providerCompositionEngine([
					{
						request: request1,
						as: 'request1'
					},
					{
						request: request2,
						as: 'request2',
						requestFilter: () => false
					}
				])
			});
		}

		const
			dp = new CompositionProviderRequestFilterFalse(),
			expectedResult = {
				request1: {test: 1}
			};

		expect(await dp.get().data).toEqual(expectedResult);
		expect(server.handles.json1.calls).toHaveLength(1);
		expect(server.handles.json2.calls).toHaveLength(0);
	});

	it('should not start the request until requestFilter is resolved', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		@provider
		class TestProviderRequestFilterPromise1 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/1';
		}

		@provider
		class TestProviderRequestFilterPromise2 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/2';
		}

		const
			request1 = (_1, _2, {providerWrapper: w}) => w(new TestProviderRequestFilterPromise1()).get({query: 1}),
			request2 = (_1, _2, {providerWrapper: w}) => w(new TestProviderRequestFilterPromise2()).get({notQuery: 2});

		let
			resolver;

		const
			promise = new Promise<boolean>((res) => resolver = res),
			async = new Async();

		@provider
		class CompositionProviderRequestFilterPromise extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: providerCompositionEngine([
					{
						request: request1,
						as: 'request1'
					},
					{
						request: request2,
						as: 'request2',
						requestFilter: () => promise
					}
				])
			});
		}

		const
			dp = new CompositionProviderRequestFilterPromise(),
			resultPromise = dp.get().data;

		await async.sleep(50);

		expect(server.handles.json1.calls).toHaveLength(1);
		expect(server.handles.json2.calls).toHaveLength(0);

		resolver();

		const
			result = await resultPromise;

		expect(result).toEqual({
			request1: {test: 1},
			request2: {test: 2}
		});

		expect(server.handles.json1.calls).toHaveLength(1);
		expect(server.handles.json2.calls).toHaveLength(1);
	});

	it('should not start the request if requestFilter returned a promise that resolved to false', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		@provider
		class TestProviderRequestFilterPromiseFalse1 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/1';
		}

		@provider
		class TestProviderRequestFilterPromiseFalse2 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/2';
		}

		const
			request1 = (_1, _2, {providerWrapper: w}) => w(new TestProviderRequestFilterPromiseFalse1()).get({query: 1}),
			request2 = (_1, _2, {providerWrapper: w}) => w(new TestProviderRequestFilterPromiseFalse2()).get({notQuery: 2});

		let
			resolver;

		const
			promise = new Promise<boolean>((res) => resolver = res),
			async = new Async();

		@provider
		class CompositionProviderRequestFilterPromiseFalse extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: providerCompositionEngine([
					{
						request: request1,
						as: 'request1'
					},
					{
						request: request2,
						as: 'request2',
						requestFilter: () => promise
					}
				])
			});
		}

		const
			dp = new CompositionProviderRequestFilterPromiseFalse(),
			resultPromise = dp.get().data;

		await async.sleep(50);

		expect(server.handles.json1.calls).toHaveLength(1);
		expect(server.handles.json2.calls).toHaveLength(0);

		resolver(false);

		const
			result = await resultPromise;

		expect(result).toEqual({
			request1: {test: 1}
		});

		expect(server.handles.json1.calls).toHaveLength(1);
		expect(server.handles.json2.calls).toHaveLength(0);
	});

	it('concurrent requests result in only one request', async () => {
		server.handles.json1.response(200, {test: 1}).responder();
		server.handles.json2.response(200, {test: 2}).responder();

		@provider
		class TestPendingProvider1 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/1';
		}

		@provider
		class TestPendingProvider2 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/2';
		}

		const
			request1 = (_1, _2, {providerWrapper}) => providerWrapper(new TestPendingProvider1()).get({query: 1}),
			request2 = (_1, _2, {providerWrapper}) => providerWrapper(new TestPendingProvider2()).get({notQuery: 2});

		@provider
		class CompositionProviderPendingTest extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: providerCompositionEngine([
					{
						request: request1,
						as: 'request1'
					},
					{
						request: request2,
						as: 'request2'
					}
				])
			});
		}

		const
			dp1 = new CompositionProviderPendingTest(),
			dp2 = new CompositionProviderPendingTest();

		const resultPromise = Promise.all([
			dp1.get().data,
			dp2.get().data
		]);

		await Promise.all([
			server.handles.json1.respond(),
			server.handles.json2.respond()
		]);

		const result = await resultPromise;

		expect(result).toEqual([
			{
				request1: {test: 1},
				request2: {test: 2}
			},
			{
				request1: {test: 1},
				request2: {test: 2}
			}
		]);

		expect(server.handles.json1.calls).toHaveLength(1);
		expect(server.handles.json2.calls).toHaveLength(1);
	});

	it('should retrieve data from cache on retries', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		@provider
		class TestCacheProvider1 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/1';
		}

		@provider
		class TestCacheProvider2 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/2';
		}

		const
			request1 = (_1, _2, {providerWrapper}) => providerWrapper(new TestCacheProvider1()).get({query: 1}),
			request2 = (_1, _2, {providerWrapper}) => providerWrapper(new TestCacheProvider2()).get({notQuery: 2});

		@provider
		class CompositionProviderCacheTest extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: providerCompositionEngine([
					{
						request: request1,
						as: 'request1'
					},
					{
						request: request2,
						as: 'request2'
					}
				]),

				cacheStrategy: 'queue',
				cacheTTL: (10).seconds()
			});
		}

		const
			dp = new CompositionProviderCacheTest(),
			async = new Async();

		expect(await dp.get().data).toEqual({
      request1: {test: 1},
      request2: {test: 2}
    });

		await async.sleep(16);

		expect(await dp.get().data).toEqual({
      request1: {test: 1},
      request2: {test: 2}
    });

		expect(server.handles.json1.calls).toHaveLength(1);
		expect(server.handles.json2.calls).toHaveLength(1);
	});

	it('should invoke the decoder with correct data', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		@provider
		class TestProviderDecoder1 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/1';
		}

		@provider
		class TestProviderDecoder2 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/2';
		}

		const
			request1 = (_1, _2, {providerWrapper}) => providerWrapper(new TestProviderDecoder1()).get({query: 1}),
			request2 = (_1, _2, {providerWrapper}) => providerWrapper(new TestProviderDecoder2()).get({notQuery: 2});

		@provider
		class CompositionProviderDecoder extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: providerCompositionEngine([
					{
						request: request1,
						as: 'request1'
					},
					{
						request: request2,
						as: 'request2'
					}
				])
			});

			static override decoders: DecodersMap = {
				get: [(result) => ({wrapper: result})]
			};
		}

		const dp = new CompositionProviderDecoder();

		expect(await dp.get().data).toEqual({
			wrapper: {
				request1: {test: 1},
				request2: {test: 2}
			}
		});
	});

	it('should retry fetching data that was not received on the first request', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2
			.responseOnce(500, {})
			.responseOnce(200, {test: 2});

		@provider
		class TestProviderRetryRequest1 extends Provider {
			static override request: Provider['request'] = Provider.request({
				cacheStrategy: 'queue',
				cacheTTL: (10).seconds(),
				api: {url: 'http://localhost:5000/'}
			});

			override baseGetURL: string = 'json/1';
		}

		@provider
		class TestProviderRetryRequest2 extends Provider {
			static override request: Provider['request'] = Provider.request({
				cacheStrategy: 'queue',
				cacheTTL: (10).seconds(),
				api: {url: 'http://localhost:5000/'}
			});

			override baseGetURL: string = 'json/2';
		}

		const
			request1 = (_1, _2, {providerWrapper}) => providerWrapper(new TestProviderRetryRequest1()).get({query: '1'}),
			request2 = (_1, _2, {providerWrapper}) => providerWrapper(new TestProviderRetryRequest2()).get({notQuery: '2'});

		@provider
		class CompositionProviderRetryRequest extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: providerCompositionEngine([
					{
						request: request1,
						as: 'request1'
					},
					{
						request: request2,
						as: 'request2'
					}
				])
			});
		}

		const dp = new CompositionProviderRetryRequest();

		expect(await dp.get().data).toEqual({
			request1: {test: 1}
		});

		expect(await dp.get().data).toEqual({
			request1: {test: 1},
			request2: {test: 2}
		});

		expect(server.handles.json1.calls).toHaveLength(1);
		expect(server.handles.json2.calls).toHaveLength(2);
	});

	it('should clear the cache for all providers', async () => {
		server.handles.json1
			.responseOnce(200, {test: 1})
			.responseOnce(200, {json1: 'json1'});

		server.handles.json2
			.responseOnce(200, {test: 2})
			.responseOnce(200, {json2: 'json2'});

		@provider
		class TestProviderDropCache1 extends Provider {
			static override request: Provider['request'] = Provider.request({
				cacheStrategy: 'queue',
				cacheTTL: (10).seconds(),
				api: {url: 'http://localhost:5000/'}
			});

			override baseGetURL: string = 'json/1';
		}

		@provider
		class TestProviderDropCache2 extends Provider {
			static override request: Provider['request'] = Provider.request({
				cacheStrategy: 'queue',
				cacheTTL: (10).seconds(),
				api: {url: 'http://localhost:5000/'}
			});

			override baseGetURL: string = 'json/2';
		}

		const
			provider1 = new TestProviderDropCache1(),
			provider2 = new TestProviderDropCache2();

		const
			dropCache1 = jest.spyOn(provider1, 'dropCache'),
			dropCache2 = jest.spyOn(provider2, 'dropCache');

		const
			request1: CompositionProvider['request'] = (_1, _2, {providerWrapper}) => providerWrapper(provider1).get(),
			request2: CompositionProvider['request'] = (_1, _2, {providerWrapper}) => providerWrapper(provider2).get();

		@provider
		class CompositionProviderDropCache extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: providerCompositionEngine([
					{
						request: request1,
						as: 'request1'
					},
					{
						request: request2,
						as: 'request2'
					}
				])
			});
		}

		const dp = new CompositionProviderDropCache();

		expect(await dp.get().data).toEqual({
			request1: {test: 1},
			request2: {test: 2}
		});

		dp.dropCache();

		expect(await dp.get().data).toEqual({
			request1: {json1: 'json1'},
			request2: {json2: 'json2'}
		});

		expect(dropCache1).toBeCalledTimes(1);
		expect(dropCache2).toBeCalledTimes(1);
	});

	it('should call the destructor for each provider', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		@provider
		class TestProviderDestructor1 extends Provider {
			static override request: Provider['request'] = Provider.request({
				cacheStrategy: 'queue',
				cacheTTL: (10).seconds(),
				api: {url: 'http://localhost:5000/'}
			});

			override baseGetURL: string = 'json/1';
		}

		@provider
		class TestProviderDestructor2 extends Provider {
			static override request: Provider['request'] = Provider.request({
				cacheStrategy: 'queue',
				cacheTTL: (10).seconds(),
				api: {url: 'http://localhost:5000/'}
			});

			override baseGetURL: string = 'json/2';
		}

		const
			provider1 = new TestProviderDestructor1(),
			provider2 = new TestProviderDestructor2();

		const
			destroy1 = jest.spyOn(provider1, 'destroy'),
			destroy2 = jest.spyOn(provider2, 'destroy');

		const
			request1 = (_1, _2, {providerWrapper}) => providerWrapper(provider1).get(),
			request2 = (_1, _2, {providerWrapper}) => providerWrapper(provider2).get();

		@provider
		class CompositionProviderDestructor extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: providerCompositionEngine([
					{
						request: request1,
						as: 'request1'
					},
					{
						request: request2,
						as: 'request2'
					}
				])
			});
		}

		const
			dp = new CompositionProviderDestructor();

		expect(await dp.get().data).toEqual({
			request1: {test: 1},
			request2: {test: 2}
		});

		dp.destroy();

		expect(destroy1).toBeCalledTimes(1);
		expect(destroy2).toBeCalledTimes(1);
	});

	it('should provide the constructor options of the provider to the request', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		@provider
		class TestProviderOptions1 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/1';
		}

		@provider
		class TestProviderOptions2 extends Provider {
			static override request: Provider['request'] = Provider.request({api: {url: 'http://localhost:5000/'}});
			override baseGetURL: string = 'json/2';
		}

		let
			providerOptions1,
			providerOptions2;

		const
			request1 = (_1, _2, opts) => (providerOptions1 = opts, opts.providerWrapper(new TestProviderOptions1()).get()),
			request2 = (_1, _2, opts) => (providerOptions2 = opts, opts.providerWrapper(new TestProviderOptions2()).get());

		@provider
		class CompositionProviderOptions1 extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: providerCompositionEngine([
					{
						request: request1,
						as: 'request1'
					},
					{
						request: request2,
						as: 'request2'
					}
				])
			});
		}

		// @ts-expect-error (no remote state)
		const dp = new CompositionProviderOptions1({remoteState: {state: 1}});

		expect(await dp.get().data).toEqual({
      request1: {test: 1},
      request2: {test: 2}
    });

		expect(providerOptions1).toMatchObject({
			providerWrapper: expect.any(Function),
			providerOptions: {
				remoteState: {
					state: 1
				}
			}
		});

		expect(providerOptions2).toMatchObject({
			providerWrapper: expect.any(Function),
			providerOptions: {
				remoteState: {
					state: 1
				}
			}
		});
	});
});

interface HandleResponse {
	statusCode: number;
	body: object;
}

function createServer() {
	const serverApp = express();
	serverApp.use(express.json());

	const createHandle = (url) => {
		let
			defaultResponse: Nullable<HandleResponse> = null,
			isResponder = false;

		const
			responses = <HandleResponse[]>[],
			requests = <Array<{resolver: (() => Response); request: Request; response: Response}>>[],
			calls = <Request[]>[];

		serverApp.get(url, (req, res) => {
			const
				response = responses.shift() ?? defaultResponse,
				statusCode = response?.statusCode ?? 200,
				body = response?.body ?? {};

			calls.push(req);

			if (isResponder) {
				requests.push({
					resolver: () => res.status(statusCode).json(body),
					request: req,
					response: res
				});

			} else {
				res.status(statusCode).json(body);
			}
		});

		const
			async = new Async();

		const handle = {
			/**
			 * @param {number} statusCode
			 * @param {object} body
			 */
			response: (statusCode, body) => {
				defaultResponse = {statusCode, body};
				return handle;
			},

			/**
			 * @param {number} statusCode
			 * @param {object} body
			 */
			responseOnce: (statusCode, body) => {
				responses.push({statusCode, body});
				return handle;
			},

			clear: () => {
				requests.forEach(({response}) => response.sendStatus(521));

				requests.length = 0;
				responses.length = 0;
				calls.length = 0;
				defaultResponse = null;
				isResponder = false;
			},

			responder: () => {
				isResponder = true;
				return handle;
			},

			respond: async () => {
				if (!isResponder) {
					throw new Error('Failed to call "respond" on a handle that is not a responder');
				}

				await async.wait(() => requests.length > 0);

				const
					resolve = requests.pop()!.resolver;

				return resolve();
			},

			calls
		};

		return handle;
	};

	const handles = {
		json1: createHandle('/json/1'),
		json2: createHandle('/json/2')
	};

	const clearHandles = () => {
		Object.values(handles).forEach((handle) => handle.clear());
	};

	const server = serverApp.listen(5000);

	const result = {
		handles,
		server,
		clearHandles,

		destroy: async () => {
			await server.close();
			clearHandles();
		}
	};

	return result;
}
