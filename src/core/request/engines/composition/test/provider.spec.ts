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
import type { CompositionRequestOptions } from 'core/request/engines/composition';

describe('core/request/engines/composition with provider', () => {
	let server: Awaited<ReturnType<typeof createServer>>;

	beforeAll(async () => {
		server = await createServer(5000);
	});

	beforeEach(() => {
		server.clearHandles();
	});

	afterAll(() => {
		server.destroy();
	});

	it('should invoke the decoder with correct data', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		@provider
		class TestProviderDecoder1 extends Provider {
			override baseGetURL: string = server.url('/json/1');
		}

		@provider
		class TestProviderDecoder2 extends Provider {
			override baseGetURL: string = server.url('/json/2');
		}

		const
			request1 = () => new TestProviderDecoder1().get({query: 1}),
			request2 = () => new TestProviderDecoder2().get({notQuery: 2});

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
				cacheTTL: (20).seconds()
			});

			override baseGetURL: string = server.url('/json/1');
		}

		@provider
		class TestProviderDropCache2 extends Provider {
			static override request: Provider['request'] = Provider.request({
				cacheStrategy: 'queue',
				cacheTTL: (20).seconds()
			});

			override baseGetURL: string = server.url('/json/2');
		}

		const
			provider1 = new TestProviderDropCache1(),
			provider2 = new TestProviderDropCache2();

		const
			request1 = () => provider1.get(),
			request2 = () => provider2.get();

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
	});

	it('should provide the constructor options of the Provider to the request', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		@provider
		class TestProviderOptions1 extends Provider {
		override baseGetURL: string = server.url('/json/1');
		}

		@provider
		class TestProviderOptions2 extends Provider {
		override baseGetURL: string = server.url('/json/2');
		}

		let
			args1,
			args2;

		const request1 = (arg: CompositionRequestOptions) => {
			args1 = arg.providerOptions;
			return new TestProviderOptions1().get();
		};

		const request2 = (arg: CompositionRequestOptions) => {
			args2 = arg.providerOptions;
			return new TestProviderOptions2().get();
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
			remoteState: {
				state: 1
			}
		});

		expect(args2).toMatchObject({
			remoteState: {
				state: 1
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

			override baseGetURL: string = server.url('/json/1');
		}

		@provider
		class TestProviderInstance2 extends Provider {
			static override request: Provider['request'] = Provider.request({
				cacheStrategy: 'queue'
			});

			override baseGetURL: string = server.url('/json/2');
		}

		let i = 2;

		const
			request1 = () => new TestProviderInstance1().get({query: 1}),
			request2 = () => new TestProviderInstance2().get({notQuery: i++});

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
	});
});
