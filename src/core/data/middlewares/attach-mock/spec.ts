/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import request, { RequestError } from 'core/request';

import Provider, { RequestPromise, provider } from 'core/data';
import type { Mocks } from 'core/data/interface';

import { responseData } from 'core/data/middlewares/attach-mock/test/response-data';

describe('core/data/middlewares/attach-mock', () => {
	@provider('attach-mock')
	class TestProvider extends Provider {
		static override readonly request: typeof request = request({
			responseType: 'json'
		});
	}

	beforeEach(() => {
		globalThis.setEnv('mock', {patterns: ['.*']});
		delete TestProvider.mocks;
	});

	describe('global setting which mocks should be loaded', () => {
		test('if the pattern is specified as an empty string, then mocks should be disabled', async () => {
			globalThis.setEnv('mock', {patterns: ['']});
			await expect(() => new TestProvider().get()).rejects.toThrow();
		});

		test('should load mock data if pattern matches by provider name', async () => {
			globalThis.setEnv('mock', {patterns: ['TestProvider']});
			TestProvider.mocks = <Mocks>{
				GET: [{response: responseData}]
			};

			await expect(unwrapResponse(new TestProvider().get())).resolves.toBe(responseData);
		});
	});

	describe('setting mocks for a data provider', () => {
		it('via in-place declaration', async () => {
			TestProvider.mocks = <Mocks>{
				GET: [{response: responseData}]
			};

			expect(await unwrapResponse(new TestProvider().get())).toBe(responseData);
		});

		it('via dynamic import', async () => {
			TestProvider.mocks = <Mocks>import('core/data/middlewares/attach-mock/test/test-provider-mocks');

			expect(await unwrapResponse(new TestProvider().get())).toBe(responseData);
		});
	});

	describe('loading mocks matching', () => {
		test('given `string` query', async () => {
			const query = 'Abracadabra';

			TestProvider.mocks = <Mocks>{
				GET: [
					{response: null},
					{query, response: responseData}
				]
			};

			expect(await unwrapResponse(new TestProvider().get(query))).toBe(responseData);
		});

		test('given `object` query', async () => {
			const query = {a: 1, b: 2};

			TestProvider.mocks = <Mocks>{
				GET: [
					{response: null},
					{query, response: responseData}
				]
			};

			expect(await unwrapResponse(new TestProvider().get(query))).toBe(responseData);
		});

		test('given `string` body', async () => {
			const body = 'a=1&b=2';

			TestProvider.mocks = <Mocks>{
				POST: [
					{response: null},
					{body, response: responseData}
				]
			};

			expect(await unwrapResponse(new TestProvider().add(body))).toBe(responseData);
		});

		test('given `object` body', async () => {
			const body = {a: 1, b: 2};

			TestProvider.mocks = <Mocks>{
				POST: [
					{response: null},
					{body, response: responseData}
				]
			};

			expect(await unwrapResponse(new TestProvider().add(body))).toBe(responseData);
		});

		test('given headers', async () => {
			const headers = {accept: 'application/xml'};

			TestProvider.mocks = <Mocks>{
				GET: [
					{response: null},
					{headers, response: responseData}
				]
			};

			expect(await unwrapResponse(new TestProvider().get(undefined, {headers}))).toBe(responseData);
		});
	});

	describe('choice of mock with the best matching', () => {
		const query = 'Abracadabra';
		const headers = {accept: 'application/xml'};

		test([
			'given 2 mocks with the same queries, but one of the mocks is without headers',
			'- should find a mock without headers'
		].join(' '), async () => {
			TestProvider.mocks = <Mocks>{
				GET: [
					{query, response: null},
					{query, headers, response: responseData}
				]
			};

			expect(await unwrapResponse(new TestProvider().get(query))).toBeNull();
		});

		test([
			'given 2 mocks with the same queries, but different headers',
			'- should find a mock with matching headers'
		].join(' '), async () => {
			TestProvider.mocks = <Mocks>{
				GET: [
					{query, headers: {accept: 'application/json'}, response: null},
					{query, headers, response: responseData}
				]
			};

			expect(await unwrapResponse(new TestProvider().get(query, {headers}))).toBe(responseData);
		});
	});

	describe('ignoring mocks that do not match', () => {
		test('given `string` query and mock with `object` query', async () => {
			TestProvider.mocks = <Mocks>{
				GET: [
					{response: null},
					{query: {a: 1, b: 2}, response: responseData}
				]
			};

			expect(await unwrapResponse(new TestProvider().get('Abracadabra'))).toBeNull();
		});
	});

	describe('legacy', () => {
		const query = 'Abracadabra';

		test('should load the first mock if none match', async () => {
			TestProvider.mocks = <Mocks>{
				GET: [
					{query: 'mystery', response: null},
					{query, response: responseData}
				]
			};

			expect(await unwrapResponse(new TestProvider().get('Harry'))).toBe(null);
		});
	});

	describe('mock assignments as a function', () => {
		test('should override mock status', async () => {
			expect.assertions(2);

			TestProvider.mocks = <Mocks>{
				GET: [
					{
						status: 200,
						response: (opts, res) => {
							res.status = 302;
							return null;
						}
					}
				]
			};

			return new TestProvider().get().catch((error) => {
				expect(error).toBeInstanceOf(RequestError);
				expect((<RequestError>error).message).toMatch('[invalidStatus] GET  302');
			});
		});

		test('should override headers', async () => {
			const headers = {
				'content-length': 0
			};

			TestProvider.mocks = <Mocks>{
				GET: [
					{
						headers: {
							'content-type': 'application/json'
						},

						response: (opts, res) => {
							res.status = 204;
							res.headers = headers;
						}
					}
				]
			};

			const {response} = await new TestProvider().get();
			expect(response.status).toEqual(204);
			expect([...response.headers.keys()]).toEqual(['content-length']);
			expect(response.headers.get('content-length')).toEqual('0');
		});
	});

	async function unwrapResponse<T>(promise: RequestPromise<T>): Promise<Nullable<T>> {
		return (await promise).data;
	}
});
