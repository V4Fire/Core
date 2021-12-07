"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _env = require("../../../../core/env");

var _request = _interopRequireWildcard(require("../../../../core/request"));

var _data = _interopRequireWildcard(require("../../../../core/data"));

var _provider = _interopRequireDefault(require("../../../../core/request/engines/provider"));

var _class, _class2, _class3, _class4, _class5, _class6, _class7;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let ProviderEngineTestBaseProvider = (0, _data.provider)(_class = class ProviderEngineTestBaseProvider extends _data.default {
  static request = _data.default.request({
    api: {
      url: 'http://localhost:3000'
    }
  });
}) || _class;

let ProviderEngineTestDataProvider = (0, _data.provider)(_class2 = class ProviderEngineTestDataProvider extends _data.default {
  static request = _data.default.request({
    engine: (0, _provider.default)(ProviderEngineTestBaseProvider)
  });
  baseURL = '/data';
}) || _class2;

let ProviderEngineTestJSONProvider = (0, _data.provider)(_class3 = class ProviderEngineTestJSONProvider extends _data.default {
  static request = _data.default.request({
    engine: (0, _provider.default)(ProviderEngineTestDataProvider, {
      peek: 'get'
    })
  });
  baseURL = 'json';
}) || _class3;

let ProviderEngineTestDecodersProvider = (0, _data.provider)(_class4 = class ProviderEngineTestDecodersProvider extends _data.default {
  static request = _data.default.request({
    engine: (0, _provider.default)(ProviderEngineTestJSONProvider)
  });
  static encoders = {
    post(data) {
      data.id = 12345;
      return data;
    }

  };
  static decoders = {
    post(data) {
      data.message = 'ok';
      return data;
    }

  };
}) || _class4;

let ProviderEngineTestMiddlewareProvider = (0, _data.provider)(_class5 = class ProviderEngineTestMiddlewareProvider extends _data.default {
  static request = _data.default.request({
    engine: (0, _provider.default)(ProviderEngineTestDecodersProvider)
  });
  static decoders = {
    post(data) {
      data.error = false;
      return data;
    }

  };
  static middlewares = {
    fakeResponse({
      ctx
    }) {
      ctx.params.body.value = ctx.params.body.value.join('-');
    }

  };
}) || _class5;

let ProviderEngineTestBasePathProvider = (0, _data.provider)(_class6 = class ProviderEngineTestBasePathProvider extends ProviderEngineTestDataProvider {
  baseURL = '/data/:id';
}) || _class6;

let ProviderEngineTestPathProvider = (0, _data.provider)(_class7 = class ProviderEngineTestPathProvider extends _data.default {
  static request = _data.default.request({
    engine: (0, _provider.default)(ProviderEngineTestBasePathProvider)
  });
  baseURL = '/:id';
}) || _class7;

describe('core/request/engine/provider', () => {
  const baseProvider = new ProviderEngineTestBaseProvider(),
        dataProvider = new ProviderEngineTestDataProvider(),
        jsonProvider = new ProviderEngineTestJSONProvider(),
        encodersProvider = new ProviderEngineTestDecodersProvider(),
        middlewareProvider = new ProviderEngineTestMiddlewareProvider(),
        pathProvider = new ProviderEngineTestPathProvider();
  let api, logOptions, server;
  beforeAll(async () => {
    api = _request.globalOpts.api;
    _request.globalOpts.api = 'http://localhost:3000';
    logOptions = await (0, _env.get)('log');
    (0, _env.set)('log', {
      patterns: []
    });
    server = createServer();
  });
  afterAll(done => {
    _request.globalOpts.api = api;
    (0, _env.set)('log', logOptions);
    server.close(done);
  });
  it('base URL-s concatenation', async () => {
    try {
      const req = await baseProvider.get();
      expect(req).toBe(undefined);
    } catch (err) {
      expect(err.details.response.status).toBe(404);
    }

    const req = await dataProvider.get();
    expect(req.response.status).toBe(200);
  });
  it('response type is correct for XML', async () => {
    expect((await dataProvider.get()).data.querySelector('foo').textContent).toBe('Hello world');
  });
  it('methods mapping', async () => {
    expect((await jsonProvider.peek()).data).toEqual({
      id: 1,
      value: 'things'
    });
  });
  it('encoders/decoders', async () => {
    const req = await encodersProvider.post({
      value: 'abc-def-ghi'
    });
    expect(req.data).toEqual({
      message: 'ok'
    });
    expect(req.response.status).toBe(201);
    expect(req.response.ok).toBeTrue();
  });
  it('middlewares', async () => {
    const req = await middlewareProvider.post({
      value: ['abc', 'def', 'ghi']
    });
    expect(req.data).toEqual({
      message: 'ok',
      error: false
    });
    expect(req.response.status).toBe(201);
  });
  it('simple request methods mapping', async () => {
    const req = (0, _request.default)({
      engine: (0, _provider.default)(ProviderEngineTestDataProvider, {
        POST: 'get'
      })
    });
    expect((await req('/json', {
      method: 'POST'
    })).data).toEqual({
      id: 1,
      value: 'things'
    });
  });
  it('correct path resolving for URL with parameters', async () => {
    expect((await pathProvider.get({
      id: 2
    })).response.status).toEqual(201);
  });
});

function createServer() {
  const serverApp = (0, _express.default)();
  serverApp.use(_express.default.json());
  serverApp.get('/data', (req, res) => {
    res.type('text/xml');
    res.status(200).send('<foo>Hello world</foo>');
  });
  serverApp.get('/data/1', (req, res) => {
    res.sendStatus(200);
  });
  serverApp.get('/data/2/2', (req, res) => {
    res.sendStatus(201);
  });
  serverApp.get('/data/json', (req, res) => {
    res.status(200).json({
      id: 1,
      value: 'things'
    });
  });
  serverApp.post('/data/json', (req, res) => {
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