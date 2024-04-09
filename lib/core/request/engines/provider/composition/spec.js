"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _express = _interopRequireDefault(require("express"));
var _async = _interopRequireDefault(require("../../../../../core/async"));
var _data = _interopRequireWildcard(require("../../../../../core/data"));
var _composition = require("../../../../../core/request/engines/provider/composition");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
describe('core/request/engines/provider/compositor', () => {
  let server;
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
    var _class, _class2, _class3;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let TestProviderRequest1 = (0, _data.provider)(_class = class TestProviderRequest1 extends _data.default {
      baseURL = 'http://localhost:5000/json/1';
    }) || _class;
    let TestProviderRequest2 = (0, _data.provider)(_class2 = class TestProviderRequest2 extends _data.default {
      baseURL = 'http://localhost:5000/json/2';
    }) || _class2;
    const request1 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestProviderRequest1()).get({
        query: '1'
      }),
      request2 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestProviderRequest2()).get({
        notQuery: '2'
      });
    let CompositionProvider1 = (0, _data.provider)(_class3 = class CompositionProvider1 extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.providerCompositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2'
        }])
      });
    }) || _class3;
    const dp = new CompositionProvider1();
    expect(await dp.get().data).toEqual({
      request1: {
        test: 1
      },
      request2: {
        test: 2
      }
    });
    expect(server.handles.json1.calls.at(0)?.query).toEqual({
      query: '1'
    });
    expect(server.handles.json2.calls.at(0)?.query).toEqual({
      notQuery: '2'
    });
  });
  it('should end the request with an error if a request error occurs with failCompositionOnError=true', async () => {
    var _class4, _class5, _class6;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(401, {});
    let TestProviderFailOnError1 = (0, _data.provider)(_class4 = class TestProviderFailOnError1 extends _data.default {
      baseURL = 'http://localhost:5000/json/1';
    }) || _class4;
    let TestProviderFailOnError2 = (0, _data.provider)(_class5 = class TestProviderFailOnError2 extends _data.default {
      baseURL = 'http://localhost:5000/json/2';
    }) || _class5;
    const request1 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestProviderFailOnError1()).get(),
      request2 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestProviderFailOnError2()).get();
    let CompositionProviderFailOnError = (0, _data.provider)(_class6 = class CompositionProviderFailOnError extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.providerCompositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2',
          failCompositionOnError: true
        }])
      });
    }) || _class6;
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
    var _class7, _class8, _class9;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(401, {});
    let TestProviderNotFailOnError1 = (0, _data.provider)(_class7 = class TestProviderNotFailOnError1 extends _data.default {
      baseURL = 'http://localhost:5000/json/1';
    }) || _class7;
    let TestProviderNotFailOnError2 = (0, _data.provider)(_class8 = class TestProviderNotFailOnError2 extends _data.default {
      baseURL = 'http://localhost:5000/json/2';
    }) || _class8;
    const request1 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestProviderNotFailOnError1()).get({
        query: 1
      }),
      request2 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestProviderNotFailOnError2()).get({
        notQuery: 2
      });
    let CompositionProviderNotFailOnError = (0, _data.provider)(_class9 = class CompositionProviderNotFailOnError extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.providerCompositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2',
          failCompositionOnError: false
        }])
      });
    }) || _class9;
    const dp = new CompositionProviderNotFailOnError();
    expect(await dp.get().data).toEqual({
      request1: {
        test: 1
      }
    });
  });
  it('should not start the request if requestFilter returns false', async () => {
    var _class10, _class11, _class12;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let TestProviderRequestFilterFalse1 = (0, _data.provider)(_class10 = class TestProviderRequestFilterFalse1 extends _data.default {
      baseURL = 'http://localhost:5000/json/1';
    }) || _class10;
    let TestProviderRequestFilterFalse2 = (0, _data.provider)(_class11 = class TestProviderRequestFilterFalse2 extends _data.default {
      baseURL = 'http://localhost:5000/json/2';
    }) || _class11;
    const request1 = (_1, _2, {
        providerWrapper: w
      }) => w(new TestProviderRequestFilterFalse1()).get({
        query: 1
      }),
      request2 = (_1, _2, {
        providerWrapper: w
      }) => w(new TestProviderRequestFilterFalse2()).get({
        notQuery: 2
      });
    let CompositionProviderRequestFilterFalse = (0, _data.provider)(_class12 = class CompositionProviderRequestFilterFalse extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.providerCompositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2',
          requestFilter: () => false
        }])
      });
    }) || _class12;
    const dp = new CompositionProviderRequestFilterFalse(),
      expectedResult = {
        request1: {
          test: 1
        }
      };
    expect(await dp.get().data).toEqual(expectedResult);
    expect(server.handles.json1.calls).toHaveLength(1);
    expect(server.handles.json2.calls).toHaveLength(0);
  });
  it('should not start the request until requestFilter is resolved', async () => {
    var _class13, _class14, _class15;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let TestProviderRequestFilterPromise1 = (0, _data.provider)(_class13 = class TestProviderRequestFilterPromise1 extends _data.default {
      baseURL = 'http://localhost:5000/json/1';
    }) || _class13;
    let TestProviderRequestFilterPromise2 = (0, _data.provider)(_class14 = class TestProviderRequestFilterPromise2 extends _data.default {
      baseURL = 'http://localhost:5000/json/2';
    }) || _class14;
    const request1 = (_1, _2, {
        providerWrapper: w
      }) => w(new TestProviderRequestFilterPromise1()).get({
        query: 1
      }),
      request2 = (_1, _2, {
        providerWrapper: w
      }) => w(new TestProviderRequestFilterPromise2()).get({
        notQuery: 2
      });
    let resolver;
    const promise = new Promise(res => resolver = res),
      async = new _async.default();
    let CompositionProviderRequestFilterPromise = (0, _data.provider)(_class15 = class CompositionProviderRequestFilterPromise extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.providerCompositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2',
          requestFilter: () => promise
        }])
      });
    }) || _class15;
    const dp = new CompositionProviderRequestFilterPromise(),
      resultPromise = dp.get().data;
    await async.sleep(50);
    expect(server.handles.json1.calls).toHaveLength(1);
    expect(server.handles.json2.calls).toHaveLength(0);
    resolver();
    const result = await resultPromise;
    expect(result).toEqual({
      request1: {
        test: 1
      },
      request2: {
        test: 2
      }
    });
    expect(server.handles.json1.calls).toHaveLength(1);
    expect(server.handles.json2.calls).toHaveLength(1);
  });
  it('should not start the request if requestFilter returned a promise that resolved to false', async () => {
    var _class16, _class17, _class18;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let TestProviderRequestFilterPromiseFalse1 = (0, _data.provider)(_class16 = class TestProviderRequestFilterPromiseFalse1 extends _data.default {
      baseURL = 'http://localhost:5000/json/1';
    }) || _class16;
    let TestProviderRequestFilterPromiseFalse2 = (0, _data.provider)(_class17 = class TestProviderRequestFilterPromiseFalse2 extends _data.default {
      baseURL = 'http://localhost:5000/json/2';
    }) || _class17;
    const request1 = (_1, _2, {
        providerWrapper: w
      }) => w(new TestProviderRequestFilterPromiseFalse1()).get({
        query: 1
      }),
      request2 = (_1, _2, {
        providerWrapper: w
      }) => w(new TestProviderRequestFilterPromiseFalse2()).get({
        notQuery: 2
      });
    let resolver;
    const promise = new Promise(res => resolver = res),
      async = new _async.default();
    let CompositionProviderRequestFilterPromiseFalse = (0, _data.provider)(_class18 = class CompositionProviderRequestFilterPromiseFalse extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.providerCompositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2',
          requestFilter: () => promise
        }])
      });
    }) || _class18;
    const dp = new CompositionProviderRequestFilterPromiseFalse(),
      resultPromise = dp.get().data;
    await async.sleep(50);
    expect(server.handles.json1.calls).toHaveLength(1);
    expect(server.handles.json2.calls).toHaveLength(0);
    resolver(false);
    const result = await resultPromise;
    expect(result).toEqual({
      request1: {
        test: 1
      }
    });
    expect(server.handles.json1.calls).toHaveLength(1);
    expect(server.handles.json2.calls).toHaveLength(0);
  });
  it('concurrent requests result in only one request', async () => {
    var _class19, _class20, _class21;
    server.handles.json1.response(200, {
      test: 1
    }).responder();
    server.handles.json2.response(200, {
      test: 2
    }).responder();
    let TestPendingProvider1 = (0, _data.provider)(_class19 = class TestPendingProvider1 extends _data.default {
      baseURL = 'http://localhost:5000/json/1';
    }) || _class19;
    let TestPendingProvider2 = (0, _data.provider)(_class20 = class TestPendingProvider2 extends _data.default {
      baseURL = 'http://localhost:5000/json/2';
    }) || _class20;
    const request1 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestPendingProvider1()).get({
        query: 1
      }),
      request2 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestPendingProvider2()).get({
        notQuery: 2
      });
    let CompositionProviderPendingTest = (0, _data.provider)(_class21 = class CompositionProviderPendingTest extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.providerCompositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2'
        }])
      });
    }) || _class21;
    const dp1 = new CompositionProviderPendingTest(),
      dp2 = new CompositionProviderPendingTest();
    const resultPromise = Promise.all([dp1.get().data, dp2.get().data]);
    await Promise.all([server.handles.json1.respond(), server.handles.json2.respond()]);
    const result = await resultPromise;
    expect(result).toEqual([{
      request1: {
        test: 1
      },
      request2: {
        test: 2
      }
    }, {
      request1: {
        test: 1
      },
      request2: {
        test: 2
      }
    }]);
    expect(server.handles.json1.calls).toHaveLength(1);
    expect(server.handles.json2.calls).toHaveLength(1);
  });
  it('should retrieve data from cache on retries', async () => {
    var _class22, _class23, _class24;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let TestCacheProvider1 = (0, _data.provider)(_class22 = class TestCacheProvider1 extends _data.default {
      baseURL = 'http://localhost:5000/json/1';
    }) || _class22;
    let TestCacheProvider2 = (0, _data.provider)(_class23 = class TestCacheProvider2 extends _data.default {
      baseURL = 'http://localhost:5000/json/2';
    }) || _class23;
    const request1 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestCacheProvider1()).get({
        query: 1
      }),
      request2 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestCacheProvider2()).get({
        notQuery: 2
      });
    let CompositionProviderCacheTest = (0, _data.provider)(_class24 = class CompositionProviderCacheTest extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.providerCompositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2'
        }]),
        cacheStrategy: 'queue',
        cacheTTL: 10 .seconds()
      });
    }) || _class24;
    const dp = new CompositionProviderCacheTest(),
      async = new _async.default();
    expect(await dp.get().data).toEqual({
      request1: {
        test: 1
      },
      request2: {
        test: 2
      }
    });
    await async.sleep(16);
    expect(await dp.get().data).toEqual({
      request1: {
        test: 1
      },
      request2: {
        test: 2
      }
    });
    expect(server.handles.json1.calls).toHaveLength(1);
    expect(server.handles.json2.calls).toHaveLength(1);
  });
  it('should invoke the decoder with correct data', async () => {
    var _class25, _class26, _class27;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let TestProviderDecoder1 = (0, _data.provider)(_class25 = class TestProviderDecoder1 extends _data.default {
      baseURL = 'http://localhost:5000/json/1';
    }) || _class25;
    let TestProviderDecoder2 = (0, _data.provider)(_class26 = class TestProviderDecoder2 extends _data.default {
      baseURL = 'http://localhost:5000/json/2';
    }) || _class26;
    const request1 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestProviderDecoder1()).get({
        query: 1
      }),
      request2 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestProviderDecoder2()).get({
        notQuery: 2
      });
    let CompositionProviderDecoder = (0, _data.provider)(_class27 = class CompositionProviderDecoder extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.providerCompositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2'
        }])
      });
      static decoders = {
        get: [result => ({
          wrapper: result
        })]
      };
    }) || _class27;
    const dp = new CompositionProviderDecoder();
    expect(await dp.get().data).toEqual({
      wrapper: {
        request1: {
          test: 1
        },
        request2: {
          test: 2
        }
      }
    });
  });
  it('should retry fetching data that was not received on the first request', async () => {
    var _class28, _class29, _class30;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.responseOnce(500, {}).responseOnce(200, {
      test: 2
    });
    let TestProviderRetryRequest1 = (0, _data.provider)(_class28 = class TestProviderRetryRequest1 extends _data.default {
      static request = _data.default.request({
        cacheStrategy: 'queue',
        cacheTTL: 10 .seconds()
      });
      baseURL = 'http://localhost:5000/json/1';
    }) || _class28;
    let TestProviderRetryRequest2 = (0, _data.provider)(_class29 = class TestProviderRetryRequest2 extends _data.default {
      static request = _data.default.request({
        cacheStrategy: 'queue',
        cacheTTL: 10 .seconds()
      });
      baseURL = 'http://localhost:5000/json/2';
    }) || _class29;
    const request1 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestProviderRetryRequest1()).get({
        query: '1'
      }),
      request2 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(new TestProviderRetryRequest2()).get({
        notQuery: '2'
      });
    let CompositionProviderRetryRequest = (0, _data.provider)(_class30 = class CompositionProviderRetryRequest extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.providerCompositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2'
        }])
      });
    }) || _class30;
    const dp = new CompositionProviderRetryRequest();
    expect(await dp.get().data).toEqual({
      request1: {
        test: 1
      }
    });
    expect(await dp.get().data).toEqual({
      request1: {
        test: 1
      },
      request2: {
        test: 2
      }
    });
    expect(server.handles.json1.calls).toHaveLength(1);
    expect(server.handles.json2.calls).toHaveLength(2);
  });
  it('should clear the cache for all providers', async () => {
    var _class31, _class32, _class33;
    server.handles.json1.responseOnce(200, {
      test: 1
    }).responseOnce(200, {
      json1: 'json1'
    });
    server.handles.json2.responseOnce(200, {
      test: 2
    }).responseOnce(200, {
      json2: 'json2'
    });
    let TestProviderDropCache1 = (0, _data.provider)(_class31 = class TestProviderDropCache1 extends _data.default {
      static request = _data.default.request({
        cacheStrategy: 'queue',
        cacheTTL: 10 .seconds()
      });
      baseURL = 'http://localhost:5000/json/1';
    }) || _class31;
    let TestProviderDropCache2 = (0, _data.provider)(_class32 = class TestProviderDropCache2 extends _data.default {
      static request = _data.default.request({
        cacheStrategy: 'queue',
        cacheTTL: 10 .seconds()
      });
      baseURL = 'http://localhost:5000/json/2';
    }) || _class32;
    const provider1 = new TestProviderDropCache1(),
      provider2 = new TestProviderDropCache2();
    const dropCache1 = jest.spyOn(provider1, 'dropCache'),
      dropCache2 = jest.spyOn(provider2, 'dropCache');
    const request1 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(provider1).get(),
      request2 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(provider2).get();
    let CompositionProviderDropCache = (0, _data.provider)(_class33 = class CompositionProviderDropCache extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.providerCompositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2'
        }])
      });
    }) || _class33;
    const dp = new CompositionProviderDropCache();
    expect(await dp.get().data).toEqual({
      request1: {
        test: 1
      },
      request2: {
        test: 2
      }
    });
    dp.dropCache();
    expect(await dp.get().data).toEqual({
      request1: {
        json1: 'json1'
      },
      request2: {
        json2: 'json2'
      }
    });
    expect(dropCache1).toBeCalledTimes(1);
    expect(dropCache2).toBeCalledTimes(1);
  });
  it('should call the destructor for each provider', async () => {
    var _class34, _class35, _class36;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let TestProviderDestructor1 = (0, _data.provider)(_class34 = class TestProviderDestructor1 extends _data.default {
      static request = _data.default.request({
        cacheStrategy: 'queue',
        cacheTTL: 10 .seconds()
      });
      baseURL = 'http://localhost:5000/json/1';
    }) || _class34;
    let TestProviderDestructor2 = (0, _data.provider)(_class35 = class TestProviderDestructor2 extends _data.default {
      static request = _data.default.request({
        cacheStrategy: 'queue',
        cacheTTL: 10 .seconds()
      });
      baseURL = 'http://localhost:5000/json/2';
    }) || _class35;
    const provider1 = new TestProviderDestructor1(),
      provider2 = new TestProviderDestructor2();
    const destroy1 = jest.spyOn(provider1, 'destroy'),
      destroy2 = jest.spyOn(provider2, 'destroy');
    const request1 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(provider1).get(),
      request2 = (_1, _2, {
        providerWrapper
      }) => providerWrapper(provider2).get();
    let CompositionProviderDestructor = (0, _data.provider)(_class36 = class CompositionProviderDestructor extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.providerCompositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2'
        }])
      });
    }) || _class36;
    const dp = new CompositionProviderDestructor();
    expect(await dp.get().data).toEqual({
      request1: {
        test: 1
      },
      request2: {
        test: 2
      }
    });
    dp.destroy();
    expect(destroy1).toBeCalledTimes(1);
    expect(destroy2).toBeCalledTimes(1);
  });
  it('should provide the constructor options of the provider to the request', async () => {
    var _class37, _class38, _class39;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let TestProviderOptions1 = (0, _data.provider)(_class37 = class TestProviderOptions1 extends _data.default {
      baseURL = 'http://localhost:5000/json/1';
    }) || _class37;
    let TestProviderOptions2 = (0, _data.provider)(_class38 = class TestProviderOptions2 extends _data.default {
      baseURL = 'http://localhost:5000/json/2';
    }) || _class38;
    let providerOptions1, providerOptions2;
    const request1 = (_1, _2, opts) => (providerOptions1 = opts, opts.providerWrapper(new TestProviderOptions1()).get()),
      request2 = (_1, _2, opts) => (providerOptions2 = opts, opts.providerWrapper(new TestProviderOptions2()).get());
    let CompositionProviderOptions1 = (0, _data.provider)(_class39 = class CompositionProviderOptions1 extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.providerCompositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2'
        }])
      });
    }) || _class39;
    const dp = new CompositionProviderOptions1({
      remoteState: {
        state: 1
      }
    });
    expect(await dp.get().data).toEqual({
      request1: {
        test: 1
      },
      request2: {
        test: 2
      }
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
function createServer() {
  const serverApp = (0, _express.default)();
  serverApp.use(_express.default.json());
  const createHandle = url => {
    let defaultResponse = null,
      isResponder = false;
    const responses = [],
      requests = [],
      calls = [];
    serverApp.get(url, (req, res) => {
      const response = responses.shift() ?? defaultResponse,
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
    const async = new _async.default();
    const handle = {
      response: (statusCode, body) => {
        defaultResponse = {
          statusCode,
          body
        };
        return handle;
      },
      responseOnce: (statusCode, body) => {
        responses.push({
          statusCode,
          body
        });
        return handle;
      },
      clear: () => {
        requests.forEach(({
          response
        }) => response.sendStatus(521));
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
        const resolve = requests.pop().resolver;
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
    Object.values(handles).forEach(handle => handle.clear());
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