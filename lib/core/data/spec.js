"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _data = _interopRequireWildcard(require("../../core/data"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* eslint-disable capitalized-comments,no-tabs */
describe('core/data', () => {
  let server;
  beforeEach(() => {
    if (server) {
      server.close();
    }

    server = createServer();
  });
  afterAll(done => {
    server.close(done);
  });
  it('simple provider', async () => {
    var _class;

    let TestProvider = (0, _data.provider)(_class = class TestProvider extends _data.default {
      static request = _data.default.request({
        api: {
          url: 'http://localhost:3000/'
        }
      });
      baseGetURL = 'json/1';
      baseAddURL = 'json';
    }) || _class;

    const dp = new TestProvider();
    expect(await dp.get().data).toEqual({
      id: 1,
      value: 'things'
    });
    const spy = jest.fn();
    dp.emitter.on('add', getData => spy('add', getData()));
    expect(await dp.add({
      id: 12345,
      value: 'abc-def-ghi'
    }).data).toEqual({
      message: 'Success'
    });
  });
  it('provider with overrides', async () => {
    var _class2;

    let TestOverrideProvider = (0, _data.provider)(_class2 = class TestOverrideProvider extends _data.default {
      static request = _data.default.request({
        api: {
          url: 'http://localhost:3000/'
        }
      });
    }) || _class2;

    const dp = new TestOverrideProvider(),
          mdp = dp.name('bla').url('json');
    const spy = jest.fn();
    mdp.emitter.on('bla', async getData => spy('bla', await getData()));
    expect(await mdp.post({
      id: 12345,
      value: 'abc-def-ghi'
    }).data).toEqual({
      message: 'Success'
    });
    expect(spy).toHaveBeenCalledWith('bla', {
      message: 'Success'
    });
  });
  it('namespaced provider with encoders/decoders', async () => {
    var _dec, _class3;

    let TestNamespacedProvider = (_dec = (0, _data.provider)('foo'), _dec(_class3 = class TestNamespacedProvider extends _data.default {
      static encoders = {
        upd: [data => {
          data.value = data.value.join('-');
          return data;
        }]
      };
      static decoders = {
        get: [data => {
          data.id = String(data.id);
          return data;
        }]
      };
      baseGetURL = 'http://localhost:3000/json/1';
      updMethod = 'POST';
      baseUpdURL = 'http://localhost:3000/json';
    }) || _class3);
    const // eslint-disable-next-line new-cap
    dp = new _data.providers['foo.TestNamespacedProvider']();
    expect(await dp.get().data).toEqual({
      id: '1',
      value: 'things'
    });
    const spy = jest.fn();
    dp.emitter.on('upd', async getData => spy('upd', await getData()));
    expect(await dp.upd({
      id: 12345,
      value: ['abc', 'def', 'ghi']
    }).data).toEqual({
      message: 'Success'
    });
    expect(spy).toHaveBeenCalledWith('upd', {
      message: 'Success'
    });
  });
  it('`get` with extra providers', async () => {
    var _class4, _class5;

    let TestExtraProvider = (0, _data.provider)(_class4 = class TestExtraProvider extends _data.default {
      baseGetURL = 'http://localhost:3000/json/1';
    }) || _class4;

    let TestProviderWithExtra = (0, _data.provider)(_class5 = class TestProviderWithExtra extends _data.default {
      alias = 'foo';
      baseGetURL = 'http://localhost:3000/json/1';
      extraProviders = () => ({
        TestExtraProvider: {
          alias: 'bla'
        },
        bar: {
          provider: new TestExtraProvider()
        }
      });
    }) || _class5;

    const dp = new TestProviderWithExtra();
    expect(await dp.get().data).toEqual({
      bla: Object({
        id: 1,
        value: 'things'
      }),
      bar: Object({
        id: 1,
        value: 'things'
      }),
      foo: Object({
        id: 1,
        value: 'things'
      })
    });
  });
});

function createServer() {
  const serverApp = (0, _express.default)();
  serverApp.use(_express.default.json());
  serverApp.get('/json/1', (req, res) => {
    res.status(200).json({
      id: 1,
      value: 'things'
    });
  });
  serverApp.put('/json/2', (req, res) => {
    if (req.get('Accept') === 'application/json') {
      res.status(200).end('{"message": "Success"}');
    } else {
      res.sendStatus(422);
    }
  });
  serverApp.post('/json', (req, res) => {
    const {
      body
    } = req;

    if (body.id === 12345 && body.value === 'abc-def-ghi') {
      res.status(201).json({
        message: 'Success'
      });
    } else {
      res.sendStatus(422);
    }
  });
  return serverApp.listen(3000);
}