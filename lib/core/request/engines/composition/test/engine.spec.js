"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _async = _interopRequireDefault(require("../../../../../core/async"));
var _request = _interopRequireWildcard(require("../../../../../core/request"));
var _composition = require("../../../../../core/request/engines/composition");
var _server = require("../../../../../core/request/engines/composition/test/server");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
describe('core/request/engines/composition as request engine', () => {
  let server;
  let api;
  beforeAll(async () => {
    api = _request.globalOpts.api;
    _request.globalOpts.api = undefined;
    server = await (0, _server.createServer)(4444);
  });
  beforeEach(() => {
    server.clearHandles();
    server.handles.json1.response(200, {
      test: 1
    });
  });
  afterAll(() => {
    _request.globalOpts.api = api;
    server.destroy();
  });
  it('engine destructor should trigger the destructors of all providers it created', async () => {
    server.handles.json2.response(200, {
      test: 1
    });
    let r;
    const engine = (0, _composition.compositionEngine)([{
      request: async () => {
        r = await (0, _request.default)(server.url('json/2'));
        return r;
      },
      as: 'result'
    }]);
    const _data = await (0, _request.default)('', {
        engine
      }).data,
      requestResponseObject = r,
      spy = jest.spyOn(requestResponseObject, 'destroy');
    expect(spy).toHaveBeenCalledTimes(0);
    engine.destroy();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('calling dropCache on the engine should trigger dropCache on all created providers', async () => {
    let r;
    const engine = (0, _composition.compositionEngine)([{
      request: () => r = (0, _request.default)(server.url('json/1')),
      as: 'result'
    }]);
    await (0, _request.default)('', {
      engine
    }).data;
    const requestResponseObject = await r,
      spy = jest.spyOn(requestResponseObject, 'dropCache');
    expect(spy).toHaveBeenCalledTimes(0);
    engine.dropCache();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('a request without failCompositionOnError option should not throw an error', async () => {
    server.handles.json1.responseOnce(500, {});
    const engine = (0, _composition.compositionEngine)([{
      request: () => (0, _request.default)(server.url('json/1')),
      as: 'val'
    }]);
    let result, error;
    try {
      result = await (0, _request.default)('', {
        engine
      }).data;
    } catch (err) {
      error = err;
    }
    expect(result).toEqual({});
    expect(error).toBeUndefined();
  });
  it('should throw an error in a request with failCompositionOnError', async () => {
    server.handles.json1.responseOnce(500, {});
    const engine = (0, _composition.compositionEngine)([{
      request: () => (0, _request.default)(server.url('json/1')),
      as: 'val',
      failCompositionOnError: true
    }]);
    let result, error;
    try {
      result = await (0, _request.default)('', {
        engine
      }).data;
    } catch (err) {
      error = err;
    }
    const details = error.details.deref();
    expect(result).toBeUndefined();
    expect(error).toBeInstanceOf(_request.RequestError);
    expect(details.response.status).toBe(500);
    expect(details.response.ok).toBe(false);
  });
  it('a request should be prevented if the requestFilter returns false', async () => {
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    const engine = (0, _composition.compositionEngine)([{
      request: () => (0, _request.default)(server.url('json/1')),
      as: 'val1',
      requestFilter: () => false
    }, {
      request: () => (0, _request.default)(server.url('json/2')),
      as: 'val2'
    }]);
    const data = await (0, _request.default)('', {
      engine
    }).data;
    expect(data).toEqual({
      val2: {
        test: 2
      }
    });
  });
  it('a request should be delayed until the requestFilter promise resolves', async () => {
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let resolver;
    const engine = (0, _composition.compositionEngine)([{
      request: () => (0, _request.default)(server.url('json/1')),
      as: 'val1',
      requestFilter: () => new Promise(res => resolver = res)
    }, {
      request: () => (0, _request.default)(server.url('json/2')),
      as: 'val2'
    }]);
    const r = (0, _request.default)('', {
      engine
    });
    await new _async.default().sleep(16);
    expect(server.handles.json1.calls).toHaveLength(0);
    expect(server.handles.json2.calls).toHaveLength(1);
    resolver();
    const data = await r.data;
    expect(data).toEqual({
      val1: {
        test: 1
      },
      val2: {
        test: 2
      }
    });
    expect(server.handles.json1.calls).toHaveLength(1);
    expect(server.handles.json2.calls).toHaveLength(1);
  });
  it('a request should be prevented if the requestFilter promise resolves with a result of false', async () => {
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let resolver;
    const engine = (0, _composition.compositionEngine)([{
      request: () => (0, _request.default)(server.url('json/1')),
      as: 'val1',
      requestFilter: () => new Promise(res => resolver = res)
    }, {
      request: () => (0, _request.default)(server.url('json/2')),
      as: 'val2'
    }]);
    const r = (0, _request.default)('', {
      engine
    });
    await new _async.default().sleep(16);
    expect(server.handles.json1.calls).toHaveLength(0);
    expect(server.handles.json2.calls).toHaveLength(1);
    resolver(false);
    const data = await r.data;
    expect(data).toEqual({
      val2: {
        test: 2
      }
    });
    expect(server.handles.json1.calls).toHaveLength(0);
    expect(server.handles.json2.calls).toHaveLength(1);
  });
  it('a request should be made if the requestFilter returns true', async () => {
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    const engine = (0, _composition.compositionEngine)([{
      request: () => (0, _request.default)(server.url('json/1')),
      as: 'val1',
      requestFilter: () => true
    }, {
      request: () => (0, _request.default)(server.url('json/2')),
      as: 'val2'
    }]);
    const data = await (0, _request.default)('', {
      engine
    }).data;
    expect(data).toEqual({
      val1: {
        test: 1
      },
      val2: {
        test: 2
      }
    });
  });
  it('a request should be made if the requestFilter promise resolves with a result of true', async () => {
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let resolver;
    const engine = (0, _composition.compositionEngine)([{
      request: () => (0, _request.default)(server.url('json/1')),
      as: 'val1',
      requestFilter: () => new Promise(res => resolver = res)
    }, {
      request: () => (0, _request.default)(server.url('json/2')),
      as: 'val2'
    }]);
    const r = (0, _request.default)('', {
      engine
    });
    await new _async.default().sleep(16);
    expect(server.handles.json1.calls).toHaveLength(0);
    expect(server.handles.json2.calls).toHaveLength(1);
    resolver(true);
    const data = await r.data;
    expect(data).toEqual({
      val1: {
        test: 1
      },
      val2: {
        test: 2
      }
    });
    expect(server.handles.json1.calls).toHaveLength(1);
    expect(server.handles.json2.calls).toHaveLength(1);
  });
  it('should return an AggregateError containing errors from all requests configured with failCompositionOnError set to true', async () => {
    server.handles.json1.response(500, {});
    server.handles.json2.response(401, {});
    const engine = (0, _composition.compositionEngine)([{
      request: () => (0, _request.default)(server.url('json/1')),
      as: 'val1',
      failCompositionOnError: true
    }, {
      request: () => (0, _request.default)(server.url('json/2')),
      as: 'val2',
      failCompositionOnError: true
    }], {
      aggregateErrors: true
    });
    let result, error;
    try {
      result = await (0, _request.default)('', {
        engine
      }).data;
    } catch (err) {
      error = err;
    }
    const error1 = error.errors[0],
      error2 = error.errors[1];
    const details1 = error1.details.deref(),
      details2 = error2.details.deref();
    expect(result).toBeUndefined();
    expect(error).toBeInstanceOf(AggregateError);
    expect(error.errors).toHaveLength(2);
    expect(error1).toBeInstanceOf(_request.RequestError);
    expect(details1?.response.status).toBe(500);
    expect(error2).toBeInstanceOf(_request.RequestError);
    expect(details2?.response.status).toBe(401);
  });
  it('should spread result if spread is specified in "as"', async () => {
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    const engine = (0, _composition.compositionEngine)([{
      request: () => (0, _request.default)(server.url('json/1')),
      as: _composition.compositionEngineSpreadResult,
      requestFilter: () => true
    }, {
      request: () => (0, _request.default)(server.url('json/2')),
      as: 'val2'
    }]);
    const data = await (0, _request.default)('', {
      engine
    }).data;
    expect(data).toEqual({
      test: 1,
      val2: {
        test: 2
      }
    });
  });
  describe('caching strategy is set to "never"', () => {
    test('should always call the request functions', async () => {
      server.handles.json1.responseOnce(200, {
        test: 1
      }).responseOnce(200, {
        test: 3
      });
      server.handles.json2.responseOnce(200, {
        test: 2
      }).responseOnce(200, {
        test: 4
      });
      const request1 = jest.fn(({
          boundRequest
        }) => boundRequest((0, _request.default)(server.url('json/1')))),
        request2 = jest.fn(({
          boundRequest
        }) => boundRequest((0, _request.default)(server.url('json/2'))));
      const engine = (0, _composition.compositionEngine)([{
        request: request1,
        as: 'val1'
      }, {
        request: request2,
        as: 'val2'
      }]);
      const r = (0, _request.default)({
        engine,
        cacheStrategy: 'never'
      });
      const data1 = await r('').data,
        data2 = await r('').data;
      expect(data1).toEqual({
        val1: {
          test: 1
        },
        val2: {
          test: 2
        }
      });
      expect(data2).toEqual({
        val1: {
          test: 3
        },
        val2: {
          test: 4
        }
      });
      expect(request1).toHaveBeenCalledTimes(2);
      expect(request2).toHaveBeenCalledTimes(2);
    });
  });
  describe('when a request created in the request function has a cacheStrategy of "queue"', () => {
    test('the engine should cache the request and avoid making duplicate requests', async () => {
      server.handles.json1.responseOnce(200, {
        test: 1
      }).responseOnce(200, {
        test: 3
      });
      server.handles.json2.responseOnce(200, {
        test: 2
      }).responseOnce(200, {
        test: 4
      });
      const request1 = jest.fn(() => (0, _request.default)(server.url('json/1'), {
          cacheStrategy: 'queue'
        })),
        request2 = jest.fn(() => (0, _request.default)(server.url('json/2')));
      const engine = (0, _composition.compositionEngine)([{
        request: request1,
        as: 'val1'
      }, {
        request: request2,
        as: 'val2'
      }]);
      const r = (0, _request.default)({
        engine,
        cacheStrategy: 'never'
      });
      const data1 = await r('').data,
        data2 = await r('').data;
      expect(data1).toEqual({
        val1: {
          test: 1
        },
        val2: {
          test: 2
        }
      });
      expect(data2).toEqual({
        val1: {
          test: 1
        },
        val2: {
          test: 4
        }
      });
      expect(request1).toHaveBeenCalledTimes(2);
      expect(request2).toHaveBeenCalledTimes(2);
      expect(server.handles.json1.calls).toHaveLength(1);
      expect(server.handles.json2.calls).toHaveLength(2);
    });
  });
});