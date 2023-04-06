"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _express = _interopRequireDefault(require("express"));
var _env = require("../../core/env");
var _combinators = require("../../core/iter/combinators");
var _stream = require("../../core/json/stream");
var _data = _interopRequireWildcard(require("../../core/data"));
var _request = _interopRequireWildcard(require("../../core/request"));
var _const = require("../../core/request/const");
var _response = _interopRequireDefault(require("../../core/request/response"));
var _headers = _interopRequireDefault(require("../../core/request/headers"));
var _node = _interopRequireDefault(require("../../core/request/engines/node"));
var _fetch = _interopRequireDefault(require("../../core/request/engines/fetch"));
var _xhr = _interopRequireDefault(require("../../core/request/engines/xhr"));
var _provider = _interopRequireDefault(require("../../core/request/engines/provider"));
var _class;
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
let TestRequestChainProvider = (0, _data.provider)(_class = class TestRequestChainProvider extends _data.default {
  static request = _data.default.request({
    engine: (0, _provider.default)(_data.default)
  });
}) || _class;
const emptyBodyStatuses = [204, 304],
  faviconBase64 = 'AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAnISL6JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL5JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL1JyEi9ichIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEihCchIpgnISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEixCUgIRMmICEvJyEi5ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIrYnISKSJyEi9ichIlxQREUAHxobAichIo4nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISJeJyEiICchIuAnISJJJiAhbCYgITgmICEnJyEi4ichIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEiXichIiAnISLdJyEihichIuknISKkIRwdBCchIoUnISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIl4nISIgJyEi4ichIu4nISL/JyEi8CYgIT8mICEhJyEi3CchIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISJeJyEiHychIuUnISL/JyEi/ychIv8nISKrIh0eBiYhInwnISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEiXSYgITUnISLvJyEi/ychIv8nISL/JyEi9CYgIUcmICEbJyEi1ichIv8nISL/JyEi/ychIv8nISL/JyEi/ichImknISKjJyEi/ychIv8nISL/JyEi/ychIv8nISKzIRwdBiYhIX0nISL/JyEi/ychIv8nISL/JyEi/ychIvwnISK+JyEi9CchIv8nISL/JyEi/ychIv8nISL/JyEi9yYhIoonISKzJyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ichIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL6JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
describe('core/request', () => {
  const engines = new Map([['node', _node.default], ['fetch', _fetch.default], ['xhr', _xhr.default], ['provider', (0, _provider.default)('Provider')], ['chain provider', (0, _provider.default)(TestRequestChainProvider)]]);
  let request, defaultEngine, logOptions;
  let api, server;
  beforeAll(async () => {
    api = _request.globalOpts.api;
    _request.globalOpts.api = 'https://run.mocky.io';
    logOptions = await (0, _env.get)('log');
    (0, _env.set)('log', {
      patterns: []
    });
    defaultEngine = _const.defaultRequestOpts.engine;
  });
  beforeEach(() => {
    if (server) {
      server.close();
    }
    server = createServer();
  });
  afterAll(async () => {
    _request.globalOpts.api = api;
    await server.close();
    _const.defaultRequestOpts.engine = defaultEngine;
    (0, _env.set)('log', logOptions);
  });
  engines.forEach((engine, name) => {
    describe(`with the "${name}" engine`, () => {
      beforeAll(() => {
        if (name.includes('provider')) {
          _const.defaultRequestOpts.engine = defaultEngine;
          request = (0, _request.default)({
            engine
          });
        } else {
          _const.defaultRequestOpts.engine = engine;
          request = _request.default;
        }
      });
      it('blob `get`', async () => {
        const data = await request('http://localhost:4000/favicon.ico').data;
        expect(data.type).toBe('image/x-icon');
        expect(data.size).toBe(1150);
      });
      it('json `get`', async () => {
        const data = await request('http://localhost:4000/json/1').data;
        expect(data).toEqual({
          id: 1,
          value: 'things'
        });
      });
      it('json `get` with caching', async () => {
        const url = 'http://localhost:4000/json/1',
          get = request({
            cacheStrategy: 'forever',
            cacheTTL: 10
          });
        await get(url).data;
        const req = await get(url);
        expect(req.cache).toBe('memory');
        expect(await req.data).toEqual({
          id: 1,
          value: 'things'
        });
        return new Promise(resolve => {
          setTimeout(async () => {
            {
              const req = await get(url);
              expect(req.cache).toBeUndefined();
              expect(await req.data).toEqual({
                id: 1,
                value: 'things'
              });
              req.dropCache();
            }
            {
              const req = await get(url);
              expect(req.cache).toBeUndefined();
              expect(await req.data).toEqual({
                id: 1,
                value: 'things'
              });
            }
            resolve();
          }, 15);
        });
      });
      it('text/xml `get`', async () => {
        const data = await request('http://localhost:4000/xml/text').data;
        expect(data.querySelector('foo').textContent).toBe('Hello world');
      });
      it('application/xml `get`', async () => {
        const data = await request('http://localhost:4000/xml/app').data;
        expect(data.querySelector('foo').textContent).toBe('Hello world');
      });
      it('xml `get` with a query', async () => {
        const data = await request('http://localhost:4000/search', {
          query: {
            q: 'bla'
          }
        }).data;
        expect(data.querySelector('results').children[0].textContent).toBe('one');
      });
      it('json `post`', async () => {
        const req = await request('http://localhost:4000/json', {
          method: 'POST',
          body: {
            id: 12345,
            value: 'abc-def-ghi'
          }
        });
        expect(await req.data).toEqual({
          message: 'Success'
        });
        expect(req.response.status).toBe(201);
        expect(req.response.ok).toBe(true);
      });
      it('json `post` with the specified response status', async () => {
        let err;
        try {
          await request('http://localhost:4000/json', {
            method: 'POST',
            okStatuses: 200,
            body: {
              id: 12345,
              value: 'abc-def-ghi'
            }
          });
        } catch (e) {
          err = e;
        }
        expect(err).toBeInstanceOf(_request.RequestError);
        expect(err.type).toBe(_request.RequestError.InvalidStatus);
        expect(err.message).toBe('[invalidStatus] POST http://localhost:4000/json 201');
        expect(err.details.request.method).toBe('POST');
        expect(err.details.response.status).toBe(201);
      });
      it('json `post` with encoders/decoders', async () => {
        const req = await request('http://localhost:4000/json', {
          method: 'POST',
          encoder: [data => {
            data.id = 12345;
            return Promise.resolve(data);
          }, data => {
            data.value = data.value.join('-');
            return data;
          }],
          decoder: data => {
            data.message = 'ok';
            return data;
          },
          body: {
            value: ['abc', 'def', 'ghi']
          }
        });
        expect(await req.data).toEqual({
          message: 'ok'
        });
        expect(req.response.status).toBe(201);
      });
      it('json `post` with middlewares', async () => {
        const req = await request('http://localhost:4000/json', {
          method: 'POST',
          middlewares: {
            addId({
              opts
            }) {
              opts.body.id = 12345;
            },
            serializeValue({
              opts
            }) {
              opts.body.value = opts.body.value.join('-');
            }
          },
          body: {
            value: ['abc', 'def', 'ghi']
          }
        });
        expect(await req.data).toEqual({
          message: 'Success'
        });
        expect(req.response.status).toBe(201);
      });
      it('json `post` with a middleware that returns a function', async () => {
        const req = await request('http://localhost:4000/json', {
          method: 'POST',
          middlewares: {
            fakeResponse({
              ctx
            }) {
              return () => ctx.wrapAsResponse({
                message: 'fake'
              });
            }
          },
          body: {
            value: ['abc', 'def', 'ghi']
          }
        });
        expect(await req.data).toEqual({
          message: 'fake'
        });
        expect(req.response.status).toBe(200);
      });
      it('json `put` with headers', async () => {
        const req = await request('http://localhost:4000/json/2', {
          method: 'PUT',
          headers: {
            Accept: 'application/json'
          }
        });
        expect(await req.data).toBe('{"message": "Success"}');
        expect(req.response.headers.get('Content-Type')).toBeNull();
        expect(await req.response.json()).toEqual({
          message: 'Success'
        });
        expect(req.response.status).toBe(200);
      });
      it('providing an API schema', async () => {
        const req = await request('/1', {
          api: {
            protocol: 'http',
            zone: () => 'localhost',
            domain2: '',
            domain3: '',
            port: 4000,
            namespace: 'json'
          }
        });
        expect(await req.data).toEqual({
          id: 1,
          value: 'things'
        });
        expect(req.response.status).toBe(200);
      });
      it('resolving an API schema to URL', async () => {
        let resolvedUrl;
        const engine = params => {
          resolvedUrl = params.url;
          return Promise.resolve(new _response.default(''));
        };
        await request('/then', {
          api: {
            protocol: 'https',
            domain3: 'docs',
            domain2: () => 'v4fire',
            zone: 'rocks',
            port: 8123,
            namespace: 'core'
          },
          engine
        });
        expect(resolvedUrl).toEqual('https://docs.v4fire.rocks:8123/core/then');
      });
      it('request builder', async () => {
        let get = request({
          api: {
            protocol: 'http',
            port: 4000,
            domain3: ''
          }
        });
        get = get({
          api: {
            zone: 'localhost',
            namespace: 'json',
            domain2: ''
          }
        });
        const req = await get('/1');
        expect(await req.data).toEqual({
          id: 1,
          value: 'things'
        });
        expect(req.response.status).toBe(200);
      });
      it('request factory', async () => {
        const resolver = (url, params, type) => type === 'get' ? '/json/1' : '',
          get = request('http://localhost:4000', resolver),
          req = await get('get');
        expect(await req.data).toEqual({
          id: 1,
          value: 'things'
        });
        expect(req.response.status).toBe(200);
      });
      it('request factory with rewriting of URL', async () => {
        const resolver = () => ['http://localhost:4000', 'json', 1],
          get = request('https://run.mocky.io/v3/', resolver),
          req = await get();
        expect(await req.data).toEqual({
          id: 1,
          value: 'things'
        });
        expect(req.response.status).toBe(200);
      });
      it('catching 404', async () => {
        let err;
        try {
          await request('http://localhost:4000/bla');
        } catch (e) {
          err = e;
        }
        expect(err).toBeInstanceOf(_request.RequestError);
        expect(err.type).toBe(_request.RequestError.InvalidStatus);
        expect(err.message).toBe('[invalidStatus] GET http://localhost:4000/bla 404');
        expect(err.details.request.method).toBe('GET');
        expect(err.details.response.status).toBe(404);
      });
      it('aborting of a request', async () => {
        let err;
        try {
          const req = request('http://localhost:4000/json/1');
          req.abort();
          await req;
        } catch (e) {
          err = e;
        }
        expect(err).toBeInstanceOf(_request.RequestError);
        expect(err.type).toBe(_request.RequestError.Abort);
        expect(err.message).toBe('[abort] GET http://localhost:4000/json/1');
        expect(err.details.request.method).toBe('GET');
        expect(err.details.response).toBeUndefined();
      });
      it('request with a low timeout', async () => {
        let err;
        try {
          await request('http://localhost:4000/delayed', {
            timeout: 100
          });
        } catch (e) {
          err = e;
        }
        expect(err).toBeInstanceOf(_request.RequestError);
        expect(err.type).toBe(_request.RequestError.Timeout);
        expect(err.message).toBe('[timeout] GET http://localhost:4000/delayed');
        expect(err.details.response).toBeUndefined();
      });
      it('request with a high timeout', async () => {
        const req = await request('http://localhost:4000/delayed', {
          timeout: 500
        });
        expect(req.response.ok).toBe(true);
      });
      describe('responses with a no message body', () => {
        for (const status of emptyBodyStatuses) {
          it(`response with ${status} status`, async () => {
            const req = await request(`http://localhost:4000/octet/${status}`, {
              okStatuses: status
            });
            expect(await req.data).toBe(null);
          });
        }
      });
      it('retrying of a request', async () => {
        const req = request('http://localhost:4000/retry', {
          retry: {
            attempts: 5,
            delay: () => 0
          }
        });
        const body = await (await req).response.json();
        expect(body.tryNumber).toBe(4);
      });
      it('retrying of a request with the specified delay between tries', async () => {
        await retryDelayTest(() => 200, 200);
      });
      it('retrying of a request with the specified promisify delay between tries', async () => {
        await retryDelayTest(() => new Promise(res => setTimeout(res, 200)), 200);
      });
      it('retrying with a speed up response', async () => {
        const req = await request('http://localhost:4000/retry/speedup', {
          timeout: 300,
          retry: 2
        });
        expect(req.response.ok).toBe(true);
        const body = await req.response.json();
        expect(body.tryNumber).toBe(2);
      });
      it('failing after the given attempts', async () => {
        let err;
        try {
          await request('http://localhost:4000/retry/bad', {
            retry: 3
          });
        } catch (e) {
          err = e;
        }
        const body = await err.details.response.json();
        expect(err).toBeInstanceOf(_request.RequestError);
        expect(err.type).toBe(_request.RequestError.InvalidStatus);
        expect(err.message).toBe('[invalidStatus] GET http://localhost:4000/retry/bad 500');
        expect(err.details.request.method).toBe('GET');
        expect(err.details.response.status).toBe(500);
        expect(body.tryNumber).toEqual(3);
      });
      it('responses an object that contains the "url" property', async () => {
        const {
            response: res1
          } = await request('http://localhost:4000/json/1'),
          {
            response: res2
          } = await request('http://localhost:4000/redirect');
        expect(res1.url).toBe('http://localhost:4000/json/1');
        expect(res2.url).toBe('http://localhost:4000/json/1');
      });
      it('response `headers` is an instance of the Headers class', async () => {
        const {
            response
          } = await request('http://localhost:4000/header'),
          {
            headers
          } = response;
        expect(headers).toBeInstanceOf(_headers.default);
        expect(headers['some-header-name']).toBe('some-header-value');
        expect(headers.get('Some-Header-Name')).toBe('some-header-value');
      });
      it('checking the "redirected" property', async () => {
        const {
            response: res1
          } = await request('http://localhost:4000/json/1'),
          {
            response: res2
          } = await request('http://localhost:4000/redirect');
        expect(res1.redirected).toBe(false);
        expect(res2.redirected).toBe(true);
      });
      it('request promise is an async iterable object', async () => {
        const chunkLengths = [],
          req = request('http://localhost:4000/favicon.ico');
        let loadedBefore = 0,
          totalLength;
        for await (const {
          loaded,
          total
        } of req) {
          if (totalLength == null) {
            totalLength = total;
          }
          chunkLengths.push(loaded - loadedBefore);
          loadedBefore = loaded;
        }
        expect(totalLength).toBe(1150);
        expect(loadedBefore).toBe(1150);
        expect(chunkLengths.every(len => len > 0)).toBe(true);
      });
      it('request response is an async iterable object', async () => {
        const chunkLengths = [],
          req = await request('http://localhost:4000/favicon.ico');
        let loadedBefore = 0,
          totalLength;
        for await (const {
          loaded,
          total
        } of req) {
          if (totalLength == null) {
            totalLength = total;
          }
          chunkLengths.push(loaded - loadedBefore);
          loadedBefore = loaded;
        }
        expect(totalLength).toBe(1150);
        expect(loadedBefore).toBe(1150);
        expect(chunkLengths.every(len => len > 0)).toBe(true);
      });
      if (name === 'xhr') {
        describe('listening XHR events', () => {
          it('`progress`', async () => {
            const req = request('http://localhost:4000/json/1'),
              events = [];
            req.emitter.on('progress', e => {
              events.push(e.type);
            });
            await req;
            expect(events.length).toBeGreaterThan(0);
            expect(events[0]).toBe('progress');
          });
          it('`readystatechange`', async () => {
            const req = request('http://localhost:4000/json/1'),
              events = [];
            req.emitter.on('readystatechange', e => {
              events.push(e.type);
            });
            await req;
            expect(events.length).toBeGreaterThan(0);
            expect(events[0]).toBe('readystatechange');
          });
        });
      } else {
        it('getting a response from a stream', async () => {
          {
            const req = request('http://localhost:4000/favicon.ico'),
              result = await convertStreamToBase64(req);
            expect(result).toBe(faviconBase64);
          }
          {
            const req = await request('http://localhost:4000/favicon.ico'),
              result = await convertStreamToBase64(req);
            expect(result).toBe(faviconBase64);
          }
        });
        it('parsing JSON from a stream', async () => {
          const req = request('http://localhost:4000/json/users', {
            streamDecoder: data => seq((0, _stream.assemble)((0, _stream.pick)(data, 'total')), (0, _stream.streamArray)((0, _stream.andPick)(data, 'data')))
          });
          const res = [];
          for await (const token of await req.stream) {
            res.push(token);
          }
          expect(res).toEqual([3, {
            index: 0,
            value: {
              name: 'Bob',
              age: 21
            }
          }, {
            index: 1,
            value: {
              name: 'Ben',
              age: 45
            }
          }, {
            index: 2,
            value: {
              name: 'Rob',
              age: 32
            }
          }]);
        });
      }
      async function retryDelayTest(delay, delayMS) {
        const startTime = new Date().getTime();
        const req = request('http://localhost:4000/retry', {
          retry: {
            attempts: 5,
            delay
          }
        });
        const body = await (await req).response.json(),
          firstRequest = body.times[0];
        const requestDelays = body.times.slice(1).reduce((acc, time, i) => acc.concat(time - firstRequest - i * delayMS), []);
        expect(firstRequest - startTime).toBeLessThan(delayMS);
        requestDelays.forEach(time => expect(time).toBeGreaterThanOrEqual(delayMS));
      }
      async function convertStreamToBase64(stream) {
        let buffer = null,
          pos = 0;
        for await (const {
          data,
          loaded,
          total
        } of stream) {
          if (buffer == null) {
            buffer = new Uint8Array(total);
          }
          buffer.set(data, pos);
          pos = loaded;
        }
        return Buffer.from(buffer).toString('base64');
      }
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
  serverApp.get('/json/users', (req, res) => {
    res.status(200).json({
      total: 3,
      data: [{
        name: 'Bob',
        age: 21
      }, {
        name: 'Ben',
        age: 45
      }, {
        name: 'Rob',
        age: 32
      }]
    });
  });
  serverApp.get('/xml/text', (req, res) => {
    res.type('text/xml');
    res.status(200).send('<foo>Hello world</foo>');
  });
  serverApp.get('/xml/app', (req, res) => {
    res.type('application/xml');
    res.status(200).send('<foo>Hello world</foo>');
  });
  serverApp.get('/search', (req, res) => {
    const {
      query
    } = req;
    if (query.q != null && /^[A-Za-z0-9]*$/.test(query.q)) {
      res.type('application/xml');
      res.status(200);
      res.send('<results><result>one</result><result>two</result><result>three</result></results>');
    } else {
      res.sendStatus(422);
    }
  });
  serverApp.get('/delayed', (req, res) => {
    setTimeout(() => {
      res.sendStatus(200);
    }, 300);
  });
  serverApp.get('/favicon.ico', (req, res) => {
    res.type('image/x-icon');
    res.send(Buffer.from(faviconBase64, 'base64'));
  });
  for (const status of emptyBodyStatuses) {
    serverApp.get(`/octet/${status}`, (req, res) => {
      res.type('application/octet-stream').status(status).end();
    });
  }
  const triesBeforeSuccess = 3,
    requestTimes = [];
  let tryNumber = 0,
    speed = 600;
  serverApp.get('/retry', (req, res) => {
    requestTimes.push(new Date().getTime());
    if (tryNumber <= triesBeforeSuccess) {
      res.sendStatus(500);
      tryNumber++;
    } else {
      res.status(200);
      res.json({
        tryNumber,
        times: requestTimes
      });
    }
  });
  serverApp.get('/retry/speedup', (req, res) => {
    setTimeout(() => {
      res.status(200);
      res.json({
        tryNumber
      });
      tryNumber++;
    }, speed);
    speed -= 200;
  });
  serverApp.get('/retry/bad', (req, res) => {
    res.status(500);
    res.json({
      tryNumber
    });
    tryNumber++;
  });
  serverApp.get('/header', (req, res) => {
    res.setHeader('Some-Header-Name', 'some-header-value');
    res.sendStatus(200);
  });
  serverApp.get('/redirect', (req, res) => {
    res.redirect('http://localhost:4000/json/1');
  });
  return serverApp.listen(4000);
}