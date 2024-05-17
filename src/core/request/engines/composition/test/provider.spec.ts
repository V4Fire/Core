/* eslint-disable max-lines */
/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* eslint-disable max-lines-per-function */

import Provider, { DecodersMap, provider } from 'core/data';

import { compositionEngine } from 'core/request/engines/composition';
import { createServer } from 'core/request/engines/composition/test/server';

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

	it('should invoke the decoder with correct data', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		@provider
		class TestProviderDecoder1 extends Provider {
			override baseURL: string = 'http://localhost:5000/json/1';
		}

		@provider
		class TestProviderDecoder2 extends Provider {
			override baseURL: string = 'http://localhost:5000/json/2';
		}

		const
			request1 = (opts, params, {boundRequest}) => boundRequest(new TestProviderDecoder1()).get({query: 1}),
			request2 = (opts, params, {boundRequest}) => boundRequest(new TestProviderDecoder2()).get({notQuery: 2});

		@provider
		class CompositionProviderDecoder extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: compositionEngine([
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
				cacheTTL: (10).seconds()
			});

			override baseURL: string = 'http://localhost:5000/json/1';
		}

		@provider
		class TestProviderDropCache2 extends Provider {
			static override request: Provider['request'] = Provider.request({
				cacheStrategy: 'queue',
				cacheTTL: (10).seconds()
			});

			override baseURL: string = 'http://localhost:5000/json/2';
		}

		const
			provider1 = new TestProviderDropCache1(),
			provider2 = new TestProviderDropCache2();

		const
			dropCache1 = jest.spyOn(provider1, 'dropCache'),
			dropCache2 = jest.spyOn(provider2, 'dropCache');

		const
			request1 = (opts, params, {boundRequest}) => boundRequest(provider1).get(),
			request2 = (opts, params, {boundRequest}) => boundRequest(provider2).get();

		@provider
		class CompositionProviderDropCache extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: compositionEngine([
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
				cacheTTL: (10).seconds()
			});

			override baseURL: string = 'http://localhost:5000/json/1';
		}

		@provider
		class TestProviderDestructor2 extends Provider {
			static override request: Provider['request'] = Provider.request({
				cacheStrategy: 'queue',
				cacheTTL: (10).seconds()
			});

			override baseURL: string = 'http://localhost:5000/json/2';
		}

		const
			provider1 = new TestProviderDestructor1(),
			provider2 = new TestProviderDestructor2();

		const
			destroy1 = jest.spyOn(provider1, 'destroy'),
			destroy2 = jest.spyOn(provider2, 'destroy');

		const
			request1 = (opts, params, {boundRequest}) => boundRequest(provider1).get(),
			request2 = (opts, params, {boundRequest}) => boundRequest(provider2).get();

		const engine = compositionEngine([
			{
				request: request1,
				as: 'request1'
			},
			{
				request: request2,
				as: 'request2'
			}
		]);

		@provider
		class CompositionProviderDestructor extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine
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
		expect(engine.boundedProviders.size).toBe(0);
	});

	it('should provide the constructor options of the Provider to the request', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		@provider
		class TestProviderOptions1 extends Provider {
			override baseURL: string = 'http://localhost:5000/json/1';
		}

		@provider
		class TestProviderOptions2 extends Provider {
			override baseURL: string = 'http://localhost:5000/json/2';
		}

		let
			args1,
			args2;

		const request1 = (opts, params, args) => {
			args1 = args;
			return args.boundRequest(new TestProviderOptions1()).get();
		};

		const request2 = (opts, params, args) => {
			args2 = args;
			return args.boundRequest(new TestProviderOptions2()).get();
		};

		@provider
		class CompositionProviderOptions1 extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine: compositionEngine([
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

		expect(args1).toMatchObject({
			boundRequest: expect.any(Function),
			providerOptions: {
				remoteState: {
					state: 1
				}
			}
		});

		expect(args2).toMatchObject({
			boundRequest: expect.any(Function),
			providerOptions: {
				remoteState: {
					state: 1
				}
			}
		});
	});

	it('should properly cache provider instances', async () => {
		server.handles.json1.responseOnce(200, {test: 1}).response(200, {test: 2});
		server.handles.json2.responseOnce(200, {foo: 2}).responseOnce(200, {foo: 3}).responseOnce(200, {foo: 4});

		@provider
		class TestProviderInstance1 extends Provider {
			static override request: Provider['request'] = Provider.request({
				cacheStrategy: 'queue'
			});

			override baseURL: string = 'http://localhost:5000/json/1';
		}

		@provider
		class TestProviderInstance2 extends Provider {
			static override request: Provider['request'] = Provider.request({
				cacheStrategy: 'queue'
			});

			override baseURL: string = 'http://localhost:5000/json/2';
		}

		let i = 2;

		const
			request1 = (opts, params, {boundRequest}) => boundRequest(new TestProviderInstance1()).get({query: 1}),
			request2 = (opts, params, {boundRequest}) => boundRequest(new TestProviderInstance2()).get({notQuery: i++});

		const engine = compositionEngine([
			{
				request: request1,
				as: 'val1'
			},
			{
				request: request2,
				as: 'val2'
			}
		]);

		@provider
		class CompositionProviderBound extends Provider {
			static override request: Provider['request'] = Provider.request({
				engine
			});
		}

		const dp = new CompositionProviderBound();

		const
			data1 = await dp.get().data,
			data2 = await dp.get().data,
			data3 = await dp.get().data;

		expect(data1).toEqual({val1: {test: 1}, val2: {foo: 2}});
		expect(data2).toEqual({val1: {test: 1}, val2: {foo: 3}});
		expect(data3).toEqual({val1: {test: 1}, val2: {foo: 4}});
		expect(engine.boundedProviders.size).toBe(2);
	});
});
