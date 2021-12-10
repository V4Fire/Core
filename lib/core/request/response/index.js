"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));

var _range = _interopRequireDefault(require("../../../core/range"));

var _abortable = _interopRequireDefault(require("../../../core/promise/abortable"));

var _env = require("../../../core/env");

var _functools = require("../../../core/functools");

var _json = require("../../../core/json");

var _mimeType = require("../../../core/mime-type");

var _utils = require("../../../core/request/utils");

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

var _class;

/**
 * Class of a remote response
 * @typeparam D - response data type
 */
let Response = (_class = class Response {
  /**
   * Value of the response data type
   */

  /**
   * Original value of the response data type
   */

  /**
   * Value of the response status code
   */

  /**
   * True if the response is valid
   */

  /**
   * List of status codes (or a single code) that is ok for the response,
   * also can pass a range of codes
   */

  /**
   * Map of response headers
   */

  /**
   * Sequence of response decoders
   */

  /**
   * Reviver function for JSON.parse
   * @default `convertIfDate`
   */

  /**
   * True, if the request is important
   */

  /**
   * Parent operation promise
   */

  /**
   * Value of the response body
   */

  /**
   * @param [body] - response body
   * @param [opts] - additional options
   */
  constructor(body, opts) {
    const p = Object.mixin(false, {}, _const.defaultResponseOpts, opts),
          ok = p.okStatuses;
    this.parent = p.parent;
    this.important = p.important;
    this.status = p.status;
    this.okStatuses = ok;
    this.ok = ok instanceof _range.default ? ok.contains(this.status) : Array.concat([], ok).includes(this.status);
    this.headers = this.parseHeaders(p.headers);
    const contentType = this.getHeader('content-type');
    this.responseType = contentType != null ? (0, _mimeType.getDataType)(contentType) : p.responseType;
    this.sourceResponseType = this.responseType; // tslint:disable-next-line:prefer-conditional-expression

    if (p.decoder == null) {
      this.decoders = [];
    } else {
      this.decoders = Object.isFunction(p.decoder) ? [p.decoder] : p.decoder;
    }

    if (Object.isFunction(p.jsonReviver)) {
      this.jsonReviver = p.jsonReviver;
    } else if (p.jsonReviver !== false) {
      this.jsonReviver = _json.convertIfDate;
    }

    this.body = Object.isFunction(body) ? body() : body;
  }
  /**
   * Returns an HTTP header value by the specified name
   * @param name
   */


  getHeader(name) {
    return this.headers[(0, _utils.normalizeHeaderName)(name)];
  }
  /**
   * Parses a body of the response and returns the result
   */


  decode() {
    let data;

    if (_const.noContentStatusCodes.includes(this.status)) {
      data = _abortable.default.resolve(null, this.parent);
    } else {
      switch (this.sourceResponseType) {
        case 'json':
          data = this.json();
          break;

        case 'arrayBuffer':
          data = this.arrayBuffer();
          break;

        case 'blob':
          data = this.blob();
          break;

        case 'document':
          data = this.document();
          break;

        case 'object':
          data = _abortable.default.resolve(this.body, this.parent);
          break;

        default:
          data = this.text();
      }
    }

    let decoders = data.then(obj => _abortable.default.resolve(obj, this.parent));
    Object.forEach(this.decoders, fn => {
      decoders = decoders.then(data => {
        if (data != null && Object.isFrozen(data)) {
          data = data.valueOf();
        }

        return fn(data, Object.cast(this));
      });
    });
    return decoders.then(res => {
      if (Object.isFrozen(res)) {
        return res;
      }

      if (Object.isArray(res) || Object.isPlainObject(res)) {
        Object.defineProperty(res, 'valueOf', {
          value: () => Object.fastClone(res, {
            freezable: false
          })
        });
        Object.freeze(res);
      }

      return res;
    });
  }
  /**
   * Parses the response body as a Document instance and returns it
   */


  document() {
    return _abortable.default.resolve(this.body, this.parent).then(body => {
      if (_env.IS_NODE) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {
          JSDOM
        } = require('jsdom');

        return this.text().then(text => new JSDOM(text)).then(res => Object.get(res, 'window.document'));
      }

      if (Object.isString(body) || body instanceof ArrayBuffer) {
        return this.text().then(text => {
          const type = this.getHeader('content-type') ?? 'text/html';
          return new DOMParser().parseFromString(text ?? '', Object.cast(type));
        });
      }

      if (!(body instanceof Document)) {
        throw new TypeError('Invalid data type');
      }

      return body;
    });
  }
  /**
   * Parses the response body as a JSON object and returns it
   */


  json() {
    return _abortable.default.resolve(this.body, this.parent).then(body => {
      if (!_env.IS_NODE && body instanceof Document) {
        throw new TypeError('Invalid data type');
      }

      if (body == null || body === '') {
        return null;
      }

      if (Object.isString(body) || body instanceof ArrayBuffer || body instanceof Uint8Array) {
        return this.text().then(text => {
          if (text == null || text === '') {
            return null;
          }

          return JSON.parse(text, this.jsonReviver);
        });
      }

      return Object.size(this.decoders) > 0 && !Object.isFrozen(body) ? Object.fastClone(body) : body;
    });
  }
  /**
   * Parses the response body as an ArrayBuffer object and returns it
   */


  arrayBuffer() {
    return _abortable.default.resolve(this.body, this.parent).then(body => {
      if (!(body instanceof Buffer) && !(body instanceof ArrayBuffer)) {
        throw new TypeError('Invalid data type');
      }

      if (body.byteLength === 0) {
        return null;
      }

      return body;
    });
  }
  /**
   * Parses the response body as a Blob structure and returns it
   */


  blob() {
    return _abortable.default.resolve(this.body, this.parent).then(body => {
      if (!_env.IS_NODE && body instanceof Document) {
        throw new TypeError('Invalid data type');
      }

      if (body == null) {
        return null;
      }

      let {
        Blob
      } = globalThis;

      if (_env.IS_NODE) {
        Blob = require('node-blob');
      }

      return new Blob([Object.cast(body)], {
        type: this.getHeader('content-type')
      });
    });
  }
  /**
   * Parses the response body as a string and returns it
   */


  text() {
    return _abortable.default.resolve(this.body, this.parent).then(body => {
      if (body == null || body instanceof ArrayBuffer && body.byteLength === 0) {
        return null;
      }

      if (_env.IS_NODE) {
        if (body instanceof Buffer && body.byteLength === 0) {
          throw new TypeError('Invalid data type');
        }
      } else if (body instanceof Document) {
        return String(body);
      }

      if (Object.isString(body)) {
        return body;
      }

      if (Object.isDictionary(body)) {
        return JSON.stringify(body);
      }

      const contentType = this.getHeader('content-type');
      let encoding = 'utf-8';

      if (contentType != null) {
        const search = /charset=(\S+)/.exec(contentType);

        if (search) {
          encoding = search[1].toLowerCase();
        }
      }

      if (_env.IS_NODE) {
        return Buffer.from(Object.cast(body)).toString(encoding);
      }

      if (typeof TextDecoder !== 'undefined') {
        const decoder = new TextDecoder(encoding, {
          fatal: true
        });
        return decoder.decode(new DataView(Object.cast(body)));
      }

      return new _abortable.default((resolve, reject, onAbort) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.onerror = reject;
        reader.onerror = reject;
        this.blob().then(blob => {
          onAbort(() => reader.abort());
          reader.readAsText(blob, encoding);
        }).catch(stderr);
      }, this.parent);
    });
  }
  /**
   * Returns a normalized object of HTTP headers from the specified string or object
   * @param headers
   */


  parseHeaders(headers) {
    const res = {};

    if (Object.isString(headers)) {
      for (let o = headers.split(/[\r\n]+/), i = 0; i < o.length; i++) {
        const header = o[i];

        if (header === '') {
          continue;
        }

        const [name, value] = header.split(':', 2);
        res[(0, _utils.normalizeHeaderName)(name)] = value.trim();
      }
    } else if (headers != null) {
      for (let keys = Object.keys(headers), i = 0; i < keys.length; i++) {
        const name = keys[i],
              value = headers[name];

        if (value == null || name === '') {
          continue;
        }

        res[(0, _utils.normalizeHeaderName)(name)] = (Object.isArray(value) ? value.join(';') : value).trim();
      }
    }

    return Object.freeze(res);
  }

}, ((0, _applyDecoratedDescriptor2.default)(_class.prototype, "decode", [_functools.once], Object.getOwnPropertyDescriptor(_class.prototype, "decode"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "document", [_functools.once], Object.getOwnPropertyDescriptor(_class.prototype, "document"), _class.prototype), (0, _applyDecoratedDescriptor2.default)(_class.prototype, "text", [_functools.once], Object.getOwnPropertyDescriptor(_class.prototype, "text"), _class.prototype)), _class);
exports.default = Response;