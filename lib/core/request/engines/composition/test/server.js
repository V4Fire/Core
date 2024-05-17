"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createServer = createServer;
var _express = _interopRequireDefault(require("express"));
var _async = _interopRequireDefault(require("../../../../../core/async"));
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
      console.log(req.url);
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