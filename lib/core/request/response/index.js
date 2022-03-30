"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  $$: true
};
exports.default = exports.$$ = void 0;

var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));

var _eventemitter = require("eventemitter2");

var _functools = require("../../../core/functools");

var _env = require("../../../core/env");

var _json = require("../../../core/json");

var _mimeType = require("../../../core/mime-type");

var _parser = _interopRequireDefault(require("../../../core/json/stream/parser"));

var _promise = require("../../../core/promise");

var _abortable = _interopRequireDefault(require("../../../core/promise/abortable"));

var _range = _interopRequireDefault(require("../../../core/range"));

var _symbol = _interopRequireDefault(require("../../../core/symbol"));

var _headers = _interopRequireWildcard(require("../../../core/request/headers"));

Object.keys(_headers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _headers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _headers[key];
    }
  });
});

var _engines = require("../../../core/request/engines");

var _const = require("../../../core/request/response/const");

Object.keys(_const).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _const[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _const[key];
    }
  });
});

var _interface = require("../../../core/request/response/interface");

Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});

var _dec, _class;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const $$ = (0, _symbol.default)();
/**
 * Class to work with server response data
 * @typeparam D - response data type
 */

exports.$$ = $$;
let Response = (_dec = (0, _functools.deprecated)({
  alternative: 'headers.get'
}), (_class = class Response {
  /**
   * The resolved request URL (after resolving redirects, etc.)
   */

  /**
   * True if the response was obtained through a redirect
   */

  /**
   * Mode type of the response
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/type
   */

  /**
   * Parent operation promise
   */

  /**
   * A meta flag that indicates that the request is important: is usually used with decoders to indicate that
   * the request needs to be executed as soon as possible
   */

  /**
   * Type of the response data
   */
  get responseType() {
    return this[$$.responseType] ?? this.sourceResponseType;
  }
  /**
   * Sets a new type of the response data
   */


  set responseType(value) {
    this[$$.responseType] = value;
  }
  /**
   * Original type of the response data
   */


  /**
   * True, if the response body is already read
   */
  get bodyUsed() {
    return Boolean(this[$$.bodyUsed]);
  }
  /**
   * Sets a new status of `bodyUsed`
   */


  set bodyUsed(value) {
    this[$$.bodyUsed] = value;
  }
  /**
   * True, if the response body is already read as a stream
   */


  get streamUsed() {
    return Boolean(this[$$.streamUsed]);
  }
  /**
   * Sets a new status of `streamUsed`
   */


  set streamUsed(value) {
    this[$$.streamUsed] = value;
  }
  /**
   * Event emitter to broadcast response events
   */


  emitter = new _eventemitter.EventEmitter2({
    maxListeners: 100,
    newListener: false
  });
  /**
   * Creates a clone of a response object, identical in every way, but stored in a different variable
   */

  /**
   * @param [body] - response body value
   * @param [opts] - additional options
   */
  constructor(body, opts) {
    const p = Object.mixin(false, {}, _const.defaultResponseOpts, opts);
    this.url = p.url;
    this.redirected = Boolean(p.redirected);

    if (p.type != null) {
      this.type = p.type;
    } else if (!_env.IS_NODE && Object.size(this.url) > 0) {
      this.type = location.hostname === new URL(this.url).hostname ? 'basic' : 'cors';
    } else {
      this.type = 'basic';
    }

    this.parent = p.parent;
    this.important = p.important;
    const ok = p.okStatuses;
    this.status = p.status;
    this.okStatuses = ok;
    this.statusText = p.statusText;
    this.ok = ok instanceof _range.default ? ok.contains(this.status) : Array.concat([], ok).includes(this.status);
    this.headers = Object.freeze(new _headers.default(p.headers));

    if (Object.isFunction(body)) {
      this.body = body.once();
      this.body[Symbol.asyncIterator] = body[Symbol.asyncIterator].bind(body);
    } else {
      this.body = body;
    }

    const contentType = this.headers['content-type'];
    this.sourceResponseType = contentType != null ? (0, _mimeType.getDataType)(contentType) : p.responseType;

    if (p.decoder == null) {
      this.decoders = [];
    } else {
      this.decoders = Object.isFunction(p.decoder) ? [p.decoder] : [...p.decoder];
    }

    if (p.streamDecoder == null) {
      this.streamDecoders = [];
    } else {
      this.streamDecoders = Object.isFunction(p.streamDecoder) ? [p.streamDecoder] : [...p.streamDecoder];
    }

    if (Object.isFunction(p.jsonReviver)) {
      this.jsonReviver = p.jsonReviver;
    } else if (p.jsonReviver !== false) {
      this.jsonReviver = _json.convertIfDate;
    }

    this.clone = () => {
      const res = new Response(body, opts);
      Object.assign(res, {
        bodyUsed: this.bodyUsed,
        streamUsed: this.streamUsed
      });
      return res;
    };
  }
  /**
   * Returns an iterator by the response body.
   * Mind, when you parse response via iterator, you won't be able to use other parse methods, like `json` or `text`.
   * @emits `streamUsed()`
   */


  [Symbol.asyncIterator]() {
    if (this.bodyUsed) {
      throw new Error("The response can't be consumed as a stream because it already read");
    }

    const {
      body
    } = this;

    if (!Object.isAsyncIterable(body)) {
      throw new TypeError('The response is not an iterable object');
    }

    if (!this.streamUsed) {
      this.streamUsed = true;
      this.emitter.emit('streamUsed');
    }

    return Object.cast(body[Symbol.asyncIterator]());
  }
  /**
   * Returns an HTTP header value by the specified name
   * @param name
   */


  getHeader(name) {
    return this.headers.get(name) ?? undefined;
  }
  /**
   * Parses the response body and returns a promise with the result.
   * The operation result is memoized, and you can't parse the response as a stream after invoking this method.
   *
   * A way to parse data is based on the response `Content-Type` header or a passed `responseType` constructor option.
   * Also, a sequence of decoders is applied to the parsed result if they are passed with a `decoders`
   * constructor option.
   */


  decode() {
    if (this[$$.decodedValue] != null) {
      return this[$$.decodedValue];
    }

    if (this.streamUsed) {
      throw new Error("The response can't be read because it's already consuming as a stream");
    }

    const cache = (0, _promise.createControllablePromise)({
      type: _abortable.default,
      args: [this.parent]
    });
    this[$$.decodedValue] = cache;
    let data;

    if (_const.noContentStatusCodes.includes(this.status)) {
      data = null;
    } else {
      switch (this.sourceResponseType) {
        case 'json':
          data = this.json();
          break;

        case 'formData':
          data = this.formData();
          break;

        case 'document':
          data = this.document();
          break;

        case 'blob':
          data = this.blob();
          break;

        case 'arrayBuffer':
          data = this.arrayBuffer();
          break;

        case 'object':
          data = this.readBody();
          break;

        default:
          data = this.text();
      }
    }

    const decodedVal = this.applyDecoders(data);
    this[$$.decodedValue] = decodedVal;
    void cache.resolve(decodedVal);
    return Object.cast(decodedVal);
  }
  /**
   * Parses the response body as a stream and yields chunks via an async iterator.
   * You can't parse the response as a whole data after invoking this method.
   *
   * A way to parse data chunks is based on the response `Content-Type` header or a passed `responseType`
   * constructor option. Also, a sequence of stream decoders is applied to the parsed chunk if they are
   * passed with a `streamDecoders` constructor option.
   */


  decodeStream() {
    let stream;

    if (_const.noContentStatusCodes.includes(this.status)) {
      stream = [].values();
    } else {
      switch (this.sourceResponseType) {
        case 'json':
          stream = this.jsonStream();
          break;

        case 'text':
          stream = this.textStream();
          break;

        default:
          stream = this.stream();
      }
    }

    return this.applyStreamDecoders(stream);
  }
  /**
   * Parses the response body as a JSON object and returns it
   */


  json() {
    return this.readBody().then(body => {
      if (body == null) {
        return null;
      }

      if (!_env.IS_NODE && body instanceof Document) {
        throw new TypeError("Can't read response data as a JSON object");
      }

      if (body instanceof _engines.FormData) {
        if (!Object.isIterable(body)) {
          throw new TypeError("Can't parse a FormData value as a JSON object because it is not iterable");
        }

        const res = {};

        for (const [key, val] of Object.cast(body)) {
          res[key] = val;
        }

        return res;
      }

      const isStringOrBuffer = Object.isString(body) || body instanceof ArrayBuffer || ArrayBuffer.isView(body);

      if (isStringOrBuffer) {
        return this.text().then(text => {
          if (text === '') {
            return null;
          }

          return JSON.parse(text, this.jsonReviver);
        });
      }

      return Object.size(this.decoders) > 0 && !Object.isFrozen(body) ? Object.fastClone(body) : body;
    });
  }
  /**
   * Parses the response data stream as a JSON tokens and yields them via an async iterator
   */


  jsonStream() {
    const iter = _parser.default.from(this.textStream());

    return {
      [Symbol.asyncIterator]() {
        return this;
      },

      next: iter.next.bind(iter)
    };
  }
  /**
   * Parses the response body as a FormData object and returns it
   */


  formData() {
    const that = this;
    return this.readBody().then(decode);

    function decode(body) {
      if (body == null) {
        return new _engines.FormData();
      }

      if (body instanceof _engines.FormData) {
        return body;
      }

      if (!_env.IS_NODE && body instanceof Document) {
        throw new TypeError("Can't read response data as a FormData object");
      }

      return Object.cast(that.text().then(decodeFromString));

      function decodeFromString(body) {
        const formData = new _engines.FormData();
        const normalizeRgxp = /[+]/g,
              records = body.trim().split('&');

        for (let i = 0; i < records.length; i++) {
          const record = records[i];

          if (record === '') {
            continue;
          }

          const chunks = record.split('='),
                name = chunks.shift().replace(normalizeRgxp, ' '),
                val = chunks.join('=').replace(normalizeRgxp, ' ');
          formData.append(decodeURIComponent(name), decodeURIComponent(val));
        }

        return formData;
      }
    }
  }
  /**
   * Parses the response body as a Document instance and returns it
   */


  document() {
    return this.readBody().then(body => {
      if (_env.IS_NODE) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {
          JSDOM
        } = require('jsdom');

        return this.text().then(text => new JSDOM(text)).then(res => Object.get(res, 'window.document'));
      }

      if (body instanceof Document) {
        return body;
      }

      return this.text().then(text => {
        const type = this.headers.get('Content-Type') ?? 'text/html';
        return new DOMParser().parseFromString(text, Object.cast(type));
      });
    });
  }
  /**
   * Parses the response body as a string and returns it
   */


  text() {
    return this.readBody().then(body => this.decodeToString(body));
  }
  /**
   * Parses the response data stream as a text chunks and yields them via an async iterator
   */


  textStream() {
    const iter = this.stream();
    return {
      [Symbol.asyncIterator]() {
        return this;
      },

      next: async () => {
        const {
          done,
          value
        } = await iter.next();
        return {
          done,
          value: done ? '' : await this.decodeToString(value)
        };
      }
    };
  }
  /**
   * Parses the response data stream as an ArrayBuffer chunks and yields them via an async iterator
   */


  stream() {
    const iter = this[Symbol.asyncIterator]();
    return {
      [Symbol.asyncIterator]() {
        return this;
      },

      next: async () => {
        const {
          done,
          value
        } = await iter.next();
        return {
          done,
          value: done ? undefined : value.data
        };
      }
    };
  }
  /**
   * Parses the response body as a Blob structure and returns it
   */


  blob() {
    return this.readBody().then(body => this.decodeToBlob(body));
  }
  /**
   * Parses the response body as an ArrayBuffer and returns it
   */


  arrayBuffer() {
    return this.readBody().then(body => {
      if (body == null) {
        return new ArrayBuffer(0);
      }

      if (body instanceof ArrayBuffer) {
        return body;
      }

      if (ArrayBuffer.isView(body)) {
        return body.buffer;
      }

      throw new TypeError("Can't read response data as ArrayBuffer");
    });
  }
  /**
   * Reads the response body or throws an exception if reading is impossible
   * @emits `bodyUsed()`
   */


  readBody() {
    if (this.streamUsed) {
      throw new Error("The response can't be read because it's already consuming as a stream");
    }

    if (!this.bodyUsed) {
      this.bodyUsed = true;
      this.emitter.emit('bodyUsed');
    }

    return _abortable.default.resolveAndCall(this.body, this.parent);
  }
  /**
   * Applies the given decoders to the specified data and returns a promise with the result
   *
   * @param data
   * @param [decoders]
   */


  applyDecoders(data, decoders = this.decoders) {
    let res = _abortable.default.resolve(data, this.parent);

    for (const decoder of decoders) {
      res = res.then(data => {
        if (data != null && Object.isFrozen(data)) {
          data = data.valueOf();
        }

        return decoder(data, Object.cast(this));
      });
    }

    res = res.then(data => {
      if (Object.isFrozen(data)) {
        return data;
      }

      if (Object.isArray(data) || Object.isPlainObject(data)) {
        const originalData = data;
        Object.defineProperty(data, 'valueOf', {
          configurable: true,
          value: () => Object.fastClone(originalData, {
            freezable: false
          })
        });
        data = Object.freeze(data);
      }

      return data;
    });
    return Object.cast(res);
  }
  /**
   * Applies the given decoders to the specified data stream and yields values via an asynchronous iterator
   *
   * @param stream
   * @param [decoders]
   */


  applyStreamDecoders(stream, decoders = this.streamDecoders) {
    const that = this;
    return applyDecoders(stream); // eslint-disable-next-line @typescript-eslint/require-await

    function applyDecoders(stream, currentDecoder = 0) {
      const decoder = decoders[currentDecoder];

      if (Object.isFunction(decoder)) {
        const transformedStream = decoder(stream, Object.cast(that));
        return applyDecoders(transformedStream, currentDecoder + 1);
      }

      let i;

      if (Object.isAsyncIterable(stream)) {
        i = stream[Symbol.asyncIterator]();
      } else {
        i = stream[Symbol.iterator]();
      }

      return Object.cast(i);
    }
  }
  /**
   * Converts the specified data to a Blob structure and returns it
   *
   * @param data
   * @param [type] - blob type, by default it takes from response headers
   */


  decodeToBlob(data, type = this.headers.get('Content-Type') ?? '') {
    if (data == null) {
      return new _engines.Blob([], {
        type
      });
    }

    if (data instanceof _engines.Blob) {
      return data;
    }

    if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
      return new _engines.Blob([data], {
        type
      });
    }

    return new _engines.Blob([Object.cast(data).toString()], {
      type
    });
  }
  /**
   * Converts the specified data to a string and returns it
   *
   * @param data
   * @param [encoding] - string encoding
   */


  decodeToString(data, encoding) {
    return _abortable.default.resolveAndCall(data, this.parent).then(body => {
      if (encoding == null) {
        encoding = 'utf-8';

        if (body == null) {
          return '';
        }

        if (Object.isString(body)) {
          return body;
        }

        if (Object.isDictionary(body)) {
          return JSON.stringify(body);
        }

        if (!_env.IS_NODE && body instanceof Document) {
          return String(body);
        }

        if (body instanceof _engines.FormData) {
          if (body.toString === Object.prototype.toString) {
            const res = {};
            body.forEach((val, key) => {
              res[key] = val;
            });
            return JSON.stringify(res);
          }

          return body.toString();
        }

        const contentType = this.headers.get('Content-Type');

        if (contentType != null) {
          const search = /charset=(\S+)/.exec(contentType);

          if (search) {
            encoding = search[1].toLowerCase();
          }
        }
      }

      if (typeof TextDecoder !== 'undefined') {
        const decoder = new TextDecoder(encoding, {
          fatal: true
        });

        if (body instanceof ArrayBuffer) {
          return decoder.decode(new DataView(body));
        }

        return decoder.decode(Object.cast(body));
      }

      return new _abortable.default((resolve, reject, onAbort) => {
        const reader = new FileReader();
        onAbort(() => reader.abort());

        reader.onload = () => resolve(String(reader.result));

        reader.onerror = reject;
        reader.readAsText(this.decodeToBlob(data), encoding);
      }, this.parent);
    });
  }

}, ((0, _applyDecoratedDescriptor2.default)(_class.prototype, "getHeader", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "getHeader"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "json", [_functools.once], Object.getOwnPropertyDescriptor(_class.prototype, "json"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "jsonStream", [_functools.once], Object.getOwnPropertyDescriptor(_class.prototype, "jsonStream"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "formData", [_functools.once], Object.getOwnPropertyDescriptor(_class.prototype, "formData"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "document", [_functools.once], Object.getOwnPropertyDescriptor(_class.prototype, "document"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "text", [_functools.once], Object.getOwnPropertyDescriptor(_class.prototype, "text"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "textStream", [_functools.once], Object.getOwnPropertyDescriptor(_class.prototype, "textStream"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "stream", [_functools.once], Object.getOwnPropertyDescriptor(_class.prototype, "stream"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "blob", [_functools.once], Object.getOwnPropertyDescriptor(_class.prototype, "blob"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "arrayBuffer", [_functools.once], Object.getOwnPropertyDescriptor(_class.prototype, "arrayBuffer"), _class.prototype)), _class));
exports.default = Response;