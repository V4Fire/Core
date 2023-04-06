/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import request from 'core/request';

import Provider, { RequestPromise, provider } from 'core/data';
import type { Mocks } from 'core/data/interface';

import { responseData } from 'core/data/middlewares/attach-mock/__mocks__/response-data';

describe('core/data/middlewares/attach-mock', () => {
  @provider('attach-mock')
  class TestProvider extends Provider {
    static override readonly request: typeof request = request({
      responseType: 'json'
    });
  }

  beforeAll(() => {
    globalThis.setEnv('mock', {patterns: ['.*']});
  });

  beforeEach(() => {
    delete TestProvider.mocks;
  });

  describe('should set mocks', () => {
    it('via in-place declaration', async () => {
      TestProvider.mocks = <Mocks>{
        GET: [{response: responseData}]
      };

      expect(await unwrapResponse(new TestProvider().get())).toBe(responseData);
    });

    it('via dynamic import', async () => {
      TestProvider.mocks = <Mocks>import('core/data/middlewares/attach-mock/__mocks__/test-provider-mocks');

      expect(await unwrapResponse(new TestProvider().get())).toBe(responseData);
    });
  });

  describe('legacy', () => {
    const query = 'Abracadabra';

    test('should return first mock if none match', async () => {
      TestProvider.mocks = <Mocks>{
        GET: [
          {query: 'mystery', response: null},
          {query, response: responseData}
        ]
      };

      expect(await unwrapResponse(new TestProvider().get('Harry'))).toBe(null);
    });
  });

  describe('should find mock', () => {
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

  describe('should not find mock', () => {
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

  describe('find best matching mock', () => {
    const query = 'Abracadabra';
    const headers = {accept: 'application/xml'};

    test([
      'given 2 mocks with same queries, but one of the mocks is without headers',
      '- should find mock without headers'
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
      'given 2 mocks with same queries, but different headers',
      '- should find mock with matching headers'
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

  async function unwrapResponse<T>(promise: RequestPromise<T>): Promise<Nullable<T>> {
    return (await promise).data;
  }
});
