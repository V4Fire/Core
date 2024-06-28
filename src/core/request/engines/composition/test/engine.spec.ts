import Async from 'core/async';
import request, { RequestError } from 'core/request';
import { compositionEngine } from 'core/request/engines/composition';
import { createServer } from 'core/request/engines/composition/test/server';

// eslint-disable-next-line max-lines-per-function
describe('core/request/engines/composition with request', () => {
	let server: Awaited<ReturnType<typeof createServer>>;

	beforeAll(() => {
		server = createServer(5000);
	});

	beforeEach(() => {
		server.clearHandles();
		server.handles.json1.response(200, {test: 1});
	});

	afterAll(() => {
		server.destroy();
	});

	it('engine destructor call should lead to triggering the destructors of all the providers created by the engine', async () => {
		let r;

		const engine = compositionEngine([
			{
				request: () => r = request(server.url('json/1')),
				as: 'result'
			}
		]);

		await request('', {engine}).data;

		const
			requestResponseObject = await r,
			spy = jest.spyOn(requestResponseObject, 'destroy');

		expect(spy).toHaveBeenCalledTimes(0);
		engine.destroy();

		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('should trigger a call to dropCache on all providers that were created by the engine when dropCache is called on the engine', async () => {
		let r;

		const engine = compositionEngine([
			{
				request: () => r = request(server.url('json/1')),
				as: 'result'
			}
		]);

		await request('', {engine}).data;

		const
			requestResponseObject = await r,
			spy = jest.spyOn(requestResponseObject, 'dropCache');

		expect(spy).toHaveBeenCalledTimes(0);
		engine.dropCache();

		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('error in a request without failCompositionOnError should not throw an error.', async () => {
		server.handles.json1.response(500, {});

		const engine = compositionEngine([
			{
				request: () => request(server.url('json/1')),
				as: 'val'
			}
		]);

		let
			result,
			error;

		try {
			result = await request('', {engine}).data;

		} catch (err) {
			error = err;
		}

		expect(result).toEqual({});
		expect(error).toBeUndefined();
	});

	it('error in a request with failCompositionOnError should throw an error', async () => {
		server.handles.json1.response(500, {});

		const engine = compositionEngine([
			{
				request: () => request(server.url('json/1')),
				as: 'val',
				failCompositionOnError: true
			}
		]);

		let
			result,
			error!: RequestError;

		try {
			result = await request('', {engine}).data;

		} catch (err) {
			error = err;
		}

		const details = error.details.deref()!;

		expect(result).toBeUndefined();
		expect(error).toBeInstanceOf(RequestError);
		expect(details.response!.status).toBe(500);
		expect(details.response!.ok).toBe(false);
	});

	it('request should not be made if the requestFilter returns false', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		const engine = compositionEngine([
			{
				request: () => request(server.url('json/1')),
				as: 'val1',
				requestFilter: () => false
			},
			{
				request: () => request(server.url('json/2')),
				as: 'val2'
			}
		]);

		const
			data = await request('', {engine}).data;

		expect(data).toEqual({val2: {test: 2}});
	});

	it('request should not be made until the requestFilter promise is resolved', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		let resolver;

		const engine = compositionEngine([
			{
				request: () => request(server.url('json/1')),
				as: 'val1',
				requestFilter: () => new Promise((res) => resolver = res)
			},
			{
				request: () => request(server.url('json/2')),
				as: 'val2'
			}
		]);

		const
			r = request('', {engine});

		await new Async().sleep(16);

		expect(server.handles.json1.calls).toHaveLength(0);
		expect(server.handles.json2.calls).toHaveLength(1);

		resolver();

		const
			data = await r.data;

		expect(data).toEqual({val1: {test: 1}, val2: {test: 2}});
		expect(server.handles.json1.calls).toHaveLength(1);
		expect(server.handles.json2.calls).toHaveLength(1);
	});

	it('request should not be made if the requestFilter promise is resolved with a result of false', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		let resolver;

		const engine = compositionEngine([
			{
				request: () => request(server.url('json/1')),
				as: 'val1',
				requestFilter: () => new Promise((res) => resolver = res)
			},
			{
				request: () => request(server.url('json/2')),
				as: 'val2'
			}
		]);

		const
			r = request('', {engine});

		await new Async().sleep(16);

		expect(server.handles.json1.calls).toHaveLength(0);
		expect(server.handles.json2.calls).toHaveLength(1);

		resolver(false);

		const
			data = await r.data;

		expect(data).toEqual({val2: {test: 2}});
		expect(server.handles.json1.calls).toHaveLength(0);
		expect(server.handles.json2.calls).toHaveLength(1);
	});

	it('request should be made if the requestFilter returns true', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		const engine = compositionEngine([
			{
				request: () => request(server.url('json/1')),
				as: 'val1',
				requestFilter: () => true
			},
			{
				request: () => request(server.url('json/2')),
				as: 'val2'
			}
		]);

		const
			data = await request('', {engine}).data;

		expect(data).toEqual({val1: {test: 1}, val2: {test: 2}});
	});

	it('request should be made if the requestFilter promise is resolved with a result of true', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		let resolver;

		const engine = compositionEngine([
			{
				request: () => request(server.url('json/1')),
				as: 'val1',
				requestFilter: () => new Promise((res) => resolver = res)
			},
			{
				request: () => request(server.url('json/2')),
				as: 'val2'
			}
		]);

		const
			r = request('', {engine});

		await new Async().sleep(16);

		expect(server.handles.json1.calls).toHaveLength(0);
		expect(server.handles.json2.calls).toHaveLength(1);

		resolver(true);

		const
			data = await r.data;

		expect(data).toEqual({val1: {test: 1}, val2: {test: 2}});
		expect(server.handles.json1.calls).toHaveLength(1);
		expect(server.handles.json2.calls).toHaveLength(1);
	});

	it('should return AggregateErrors with errors from all requests that have failCompositionOnError set', async () => {
		server.handles.json1.response(500, {});
		server.handles.json2.response(401, {});

		const engine = compositionEngine([
			{
				request: () => request(server.url('json/1')),
				as: 'val1',
				failCompositionOnError: true
			},
			{
				request: () => request(server.url('json/2')),
				as: 'val2',
				failCompositionOnError: true
			}
		], {aggregateErrors: true});

		let
			result,
			error!: AggregateError;

		try {
			result = await request('', {engine}).data;

		} catch (err) {
			error = err;
		}

		const
			error1: RequestError = error.errors[0],
			error2: RequestError = error.errors[1];

		const
			details1 = error1.details.deref(),
			details2 = error2.details.deref();

		expect(result).toBeUndefined();
		expect(error).toBeInstanceOf(AggregateError);
		expect(error.errors).toHaveLength(2);

		expect(error1).toBeInstanceOf(RequestError);
		expect(details1?.response!.status).toBe(500);

		expect(error2).toBeInstanceOf(RequestError);
		expect(details2?.response!.status).toBe(401);
	});

	it('should spread result if spread is specified in "as"', async () => {
		server.handles.json1.response(200, {test: 1});
		server.handles.json2.response(200, {test: 2});

		const engine = compositionEngine([
			{
				request: () => request(server.url('json/1')),
				as: 'spread',
				requestFilter: () => true
			},
			{
				request: () => request(server.url('json/2')),
				as: 'val2'
			}
		]);

		const
			data = await request('', {engine}).data;

		expect(data).toEqual({test: 1, val2: {test: 2}});
	});

	describe('caching strategy is set to "never"', () => {
		test('should always call the request functions', async () => {
			server.handles.json1.responseOnce(200, {test: 1}).responseOnce(200, {test: 3});
			server.handles.json2.responseOnce(200, {test: 2}).responseOnce(200, {test: 4});

			const
				request1 = jest.fn(({boundRequest}) => boundRequest(request(server.url('json/1')))),
				request2 = jest.fn(({boundRequest}) => boundRequest(request(server.url('json/2'))));

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

			const
				r = request({engine, cacheStrategy: 'never'});

			const
				data1 = await r('').data,
				data2 = await r('').data;

			expect(data1).toEqual({val1: {test: 1}, val2: {test: 2}});
			expect(data2).toEqual({val1: {test: 3}, val2: {test: 4}});
			expect(request1).toHaveBeenCalledTimes(2);
			expect(request2).toHaveBeenCalledTimes(2);
		});
	});

	describe('request created in the request function has a cacheStrategy of "queue"', () => {
		test('caches the request and does not make duplicate requests', async () => {
			server.handles.json1.responseOnce(200, {test: 1}).responseOnce(200, {test: 3});
			server.handles.json2.responseOnce(200, {test: 2}).responseOnce(200, {test: 4});

			const
				request1 = jest.fn(() => request(server.url('json/1'), {cacheStrategy: 'queue'})),
				request2 = jest.fn(() => request(server.url('json/2')));

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

			const
				r = request({engine, cacheStrategy: 'never'});

			const
				data1 = await r('').data,
				data2 = await r('').data;

			expect(data1).toEqual({val1: {test: 1}, val2: {test: 2}});
			expect(data2).toEqual({val1: {test: 1}, val2: {test: 4}});
			expect(request1).toHaveBeenCalledTimes(2);
			expect(request2).toHaveBeenCalledTimes(2);
			expect(server.handles.json1.calls).toHaveLength(1);
			expect(server.handles.json2.calls).toHaveLength(2);
		});
	});
});
