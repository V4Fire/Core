"use strict";

var _request = _interopRequireWildcard(require("../../../../core/request"));
var _data = _interopRequireWildcard(require("../../../../core/data"));
var _responseData = require("../../../../core/data/middlewares/attach-mock/test/response-data");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
describe('core/data/middlewares/attach-mock', () => {
  var _dec, _class;
  let TestProvider = (_dec = (0, _data.provider)('attach-mock'), _dec(_class = class TestProvider extends _data.default {
    static request = (0, _request.default)({
      responseType: 'json'
    });
  }) || _class);
  beforeEach(() => {
    globalThis.setEnv('mock', {
      patterns: ['.*']
    });
    delete TestProvider.mocks;
  });
  describe('global setting which mocks should be loaded', () => {
    test('if the pattern is specified as an empty string, then mocks should be disabled', async () => {
      globalThis.setEnv('mock', {
        patterns: ['']
      });
      await expect(() => new TestProvider().get()).rejects.toThrow();
    });
    test('should load mock data if pattern matches by provider name', async () => {
      globalThis.setEnv('mock', {
        patterns: ['TestProvider']
      });
      TestProvider.mocks = {
        GET: [{
          response: _responseData.responseData
        }]
      };
      await expect(unwrapResponse(new TestProvider().get())).resolves.toBe(_responseData.responseData);
    });
  });
  describe('setting mocks for a data provider', () => {
    it('via in-place declaration', async () => {
      TestProvider.mocks = {
        GET: [{
          response: _responseData.responseData
        }]
      };
      expect(await unwrapResponse(new TestProvider().get())).toBe(_responseData.responseData);
    });
    it('via dynamic import', async () => {
      TestProvider.mocks = Promise.resolve().then(() => _interopRequireWildcard(require('../../../../core/data/middlewares/attach-mock/test/test-provider-mocks')));
      expect(await unwrapResponse(new TestProvider().get())).toBe(_responseData.responseData);
    });
  });
  describe('loading mocks matching', () => {
    test('given `string` query', async () => {
      const query = 'Abracadabra';
      TestProvider.mocks = {
        GET: [{
          response: null
        }, {
          query,
          response: _responseData.responseData
        }]
      };
      expect(await unwrapResponse(new TestProvider().get(query))).toBe(_responseData.responseData);
    });
    test('given `object` query', async () => {
      const query = {
        a: 1,
        b: 2
      };
      TestProvider.mocks = {
        GET: [{
          response: null
        }, {
          query,
          response: _responseData.responseData
        }]
      };
      expect(await unwrapResponse(new TestProvider().get(query))).toBe(_responseData.responseData);
    });
    test('given `string` body', async () => {
      const body = 'a=1&b=2';
      TestProvider.mocks = {
        POST: [{
          response: null
        }, {
          body,
          response: _responseData.responseData
        }]
      };
      expect(await unwrapResponse(new TestProvider().add(body))).toBe(_responseData.responseData);
    });
    test('given `object` body', async () => {
      const body = {
        a: 1,
        b: 2
      };
      TestProvider.mocks = {
        POST: [{
          response: null
        }, {
          body,
          response: _responseData.responseData
        }]
      };
      expect(await unwrapResponse(new TestProvider().add(body))).toBe(_responseData.responseData);
    });
    test('given headers', async () => {
      const headers = {
        accept: 'application/xml'
      };
      TestProvider.mocks = {
        GET: [{
          response: null
        }, {
          headers,
          response: _responseData.responseData
        }]
      };
      expect(await unwrapResponse(new TestProvider().get(undefined, {
        headers
      }))).toBe(_responseData.responseData);
    });
  });
  describe('choice of mock with the best matching', () => {
    const query = 'Abracadabra';
    const headers = {
      accept: 'application/xml'
    };
    test(['given 2 mocks with the same queries, but one of the mocks is without headers', '- should find a mock without headers'].join(' '), async () => {
      TestProvider.mocks = {
        GET: [{
          query,
          response: null
        }, {
          query,
          headers,
          response: _responseData.responseData
        }]
      };
      expect(await unwrapResponse(new TestProvider().get(query))).toBeNull();
    });
    test(['given 2 mocks with the same queries, but different headers', '- should find a mock with matching headers'].join(' '), async () => {
      TestProvider.mocks = {
        GET: [{
          query,
          headers: {
            accept: 'application/json'
          },
          response: null
        }, {
          query,
          headers,
          response: _responseData.responseData
        }]
      };
      expect(await unwrapResponse(new TestProvider().get(query, {
        headers
      }))).toBe(_responseData.responseData);
    });
  });
  describe('ignoring mocks that do not match', () => {
    test('given `string` query and mock with `object` query', async () => {
      TestProvider.mocks = {
        GET: [{
          response: null
        }, {
          query: {
            a: 1,
            b: 2
          },
          response: _responseData.responseData
        }]
      };
      expect(await unwrapResponse(new TestProvider().get('Abracadabra'))).toBeNull();
    });
  });
  describe('legacy', () => {
    const query = 'Abracadabra';
    test('should load the first mock if none match', async () => {
      TestProvider.mocks = {
        GET: [{
          query: 'mystery',
          response: null
        }, {
          query,
          response: _responseData.responseData
        }]
      };
      expect(await unwrapResponse(new TestProvider().get('Harry'))).toBe(null);
    });
  });
  describe('mock assignments as a function', () => {
    test('should override mock status', async () => {
      expect.assertions(2);
      TestProvider.mocks = {
        GET: [{
          status: 200,
          response: (opts, res) => {
            res.status = 302;
            return null;
          }
        }]
      };
      return new TestProvider().get().catch(error => {
        expect(error).toBeInstanceOf(_request.RequestError);
        expect(error.message).toMatch('[invalidStatus] GET  302');
      });
    });
    test('should override headers', async () => {
      const headers = {
        'content-length': 0
      };
      TestProvider.mocks = {
        GET: [{
          headers: {
            'content-type': 'application/json'
          },
          response: (opts, res) => {
            res.status = 204;
            res.headers = headers;
          }
        }]
      };
      const {
        response
      } = await new TestProvider().get();
      expect(response.status).toEqual(204);
      expect([...response.headers.keys()]).toEqual(['content-length']);
      expect(response.headers.get('content-length')).toEqual('0');
    });
  });
  async function unwrapResponse(promise) {
    return (await promise).data;
  }
});