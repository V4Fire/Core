"use strict";

var _data = _interopRequireWildcard(require("../../../../../core/data"));
var _composition = require("../../../../../core/request/engines/composition");
var _server = require("../../../../../core/request/engines/composition/test/server");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
describe('core/request/engines/composition with provider', () => {
  let server;
  beforeAll(async () => {
    server = await (0, _server.createServer)(5000);
  });
  beforeEach(() => {
    server.clearHandles();
  });
  afterAll(() => {
    server.destroy();
  });
  it('should invoke the decoder with correct data', async () => {
    var _class, _class2, _class3;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let TestProviderDecoder1 = (0, _data.provider)(_class = class TestProviderDecoder1 extends _data.default {
      baseGetURL = server.url('/json/1');
    }) || _class;
    let TestProviderDecoder2 = (0, _data.provider)(_class2 = class TestProviderDecoder2 extends _data.default {
      baseGetURL = server.url('/json/2');
    }) || _class2;
    const request1 = () => new TestProviderDecoder1().get({
        query: 1
      }),
      request2 = () => new TestProviderDecoder2().get({
        notQuery: 2
      });
    let CompositionProviderDecoder = (0, _data.provider)(_class3 = class CompositionProviderDecoder extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.compositionEngine)([{
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
    }) || _class3;
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
  it('should clear the cache for all providers', async () => {
    var _class4, _class5, _class6;
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
    let TestProviderDropCache1 = (0, _data.provider)(_class4 = class TestProviderDropCache1 extends _data.default {
      static request = _data.default.request({
        cacheStrategy: 'queue',
        cacheTTL: 20 .seconds()
      });
      baseGetURL = server.url('/json/1');
    }) || _class4;
    let TestProviderDropCache2 = (0, _data.provider)(_class5 = class TestProviderDropCache2 extends _data.default {
      static request = _data.default.request({
        cacheStrategy: 'queue',
        cacheTTL: 20 .seconds()
      });
      baseGetURL = server.url('/json/2');
    }) || _class5;
    const provider1 = new TestProviderDropCache1(),
      provider2 = new TestProviderDropCache2();
    const request1 = () => provider1.get(),
      request2 = () => provider2.get();
    let CompositionProviderDropCache = (0, _data.provider)(_class6 = class CompositionProviderDropCache extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.compositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2'
        }])
      });
    }) || _class6;
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
  });
  it('should call the destructor for each provider', async () => {
    var _class7, _class8, _class9;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let TestProviderDestructor1 = (0, _data.provider)(_class7 = class TestProviderDestructor1 extends _data.default {
      static request = _data.default.request({
        api: {
          url: server.url()
        },
        cacheStrategy: 'queue',
        cacheTTL: 10 .seconds()
      });
      baseGetURL = server.url('/json/1');
    }) || _class7;
    let TestProviderDestructor2 = (0, _data.provider)(_class8 = class TestProviderDestructor2 extends _data.default {
      static request = _data.default.request({
        api: {
          url: server.url()
        },
        cacheStrategy: 'queue',
        cacheTTL: 10 .seconds()
      });
      baseGetURL = server.url('/json/2');
    }) || _class8;
    const provider1 = new TestProviderDestructor1(),
      provider2 = new TestProviderDestructor2();
    const destroy1 = jest.spyOn(provider1, 'destroy'),
      destroy2 = jest.spyOn(provider2, 'destroy');
    const request1 = () => provider1.get(),
      request2 = () => provider2.get();
    const engine = (0, _composition.compositionEngine)([{
      request: request1,
      as: 'request1'
    }, {
      request: request2,
      as: 'request2'
    }]);
    let CompositionProviderDestructor = (0, _data.provider)(_class9 = class CompositionProviderDestructor extends _data.default {
      static request = _data.default.request({
        engine
      });
    }) || _class9;
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
  it('should provide the constructor options of the Provider to the request', async () => {
    var _class10, _class11, _class12;
    server.handles.json1.response(200, {
      test: 1
    });
    server.handles.json2.response(200, {
      test: 2
    });
    let TestProviderOptions1 = (0, _data.provider)(_class10 = class TestProviderOptions1 extends _data.default {
      baseGetURL = server.url('/json/1');
    }) || _class10;
    let TestProviderOptions2 = (0, _data.provider)(_class11 = class TestProviderOptions2 extends _data.default {
      baseGetURL = server.url('/json/2');
    }) || _class11;
    let args1, args2;
    const request1 = arg => {
      args1 = arg.providerOptions;
      return new TestProviderOptions1().get();
    };
    const request2 = arg => {
      args2 = arg.providerOptions;
      return new TestProviderOptions2().get();
    };
    let CompositionProviderOptions1 = (0, _data.provider)(_class12 = class CompositionProviderOptions1 extends _data.default {
      static request = _data.default.request({
        engine: (0, _composition.compositionEngine)([{
          request: request1,
          as: 'request1'
        }, {
          request: request2,
          as: 'request2'
        }])
      });
    }) || _class12;
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
    var _class13, _class14, _class15;
    server.handles.json1.responseOnce(200, {
      test: 1
    }).response(200, {
      test: 2
    });
    server.handles.json2.responseOnce(200, {
      foo: 2
    }).responseOnce(200, {
      foo: 3
    }).responseOnce(200, {
      foo: 4
    });
    let TestProviderInstance1 = (0, _data.provider)(_class13 = class TestProviderInstance1 extends _data.default {
      static request = _data.default.request({
        cacheStrategy: 'queue'
      });
      baseGetURL = server.url('/json/1');
    }) || _class13;
    let TestProviderInstance2 = (0, _data.provider)(_class14 = class TestProviderInstance2 extends _data.default {
      static request = _data.default.request({
        cacheStrategy: 'queue'
      });
      baseGetURL = server.url('/json/2');
    }) || _class14;
    let i = 2;
    const request1 = () => new TestProviderInstance1().get({
        query: 1
      }),
      request2 = () => new TestProviderInstance2().get({
        notQuery: i++
      });
    const engine = (0, _composition.compositionEngine)([{
      request: request1,
      as: 'val1'
    }, {
      request: request2,
      as: 'val2'
    }]);
    let CompositionProviderBound = (0, _data.provider)(_class15 = class CompositionProviderBound extends _data.default {
      static request = _data.default.request({
        engine
      });
    }) || _class15;
    const dp = new CompositionProviderBound();
    const data1 = await dp.get().data,
      data2 = await dp.get().data,
      data3 = await dp.get().data;
    expect(data1).toEqual({
      val1: {
        test: 1
      },
      val2: {
        foo: 2
      }
    });
    expect(data2).toEqual({
      val1: {
        test: 1
      },
      val2: {
        foo: 3
      }
    });
    expect(data3).toEqual({
      val1: {
        test: 1
      },
      val2: {
        foo: 4
      }
    });
  });
});