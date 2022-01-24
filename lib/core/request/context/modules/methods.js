"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));

var _functools = require("../../../../core/functools");

var _url = require("../../../../core/url");

var _utils = require("../../../../core/request/utils");

var _const = require("../../../../core/request/const");

var _const2 = require("../../../../core/request/context/const");

var _params = _interopRequireDefault(require("../../../../core/request/context/modules/params"));

var _dec, _class;

let RequestContext = (_dec = (0, _functools.deprecated)({
  renamedTo: 'resolveRequest'
}), (_class = class RequestContext extends _params.default {
  /**
   * Generates a string cache key for specified url and returns it
   * @param url
   */
  getRequestKey(url) {
    const p = this.params,
          cacheId = p.cacheId ?? '',
          strategy = Object.isString(p.cacheStrategy) ? p.cacheStrategy : p.cacheStrategy.constructor.name;
    return [(0, _utils.getRequestKey)(url, this.params), strategy, cacheId].join();
  }
  /**
   * Returns an absolute URL for the request API
   * @param [apiURL] - base API URL
   */


  resolveAPI(apiURL = _const.globalOpts.api) {
    const compute = v => Object.isFunction(v) ? v() : v,
          api = { ...this.params.api
    };

    for (let keys = Object.keys(api), i = 0; i < keys.length; i++) {
      const key = keys[i];
      api[key] = compute(api[key]);
    }

    if (api.url != null) {
      return api.url;
    }

    if (apiURL == null) {
      const nm = api.namespace ?? '';

      if (api.protocol == null) {
        return nm.startsWith('/') ? nm : `/${nm}`;
      }

      return (0, _url.concatURLs)(resolve('protocol') + resolve('auth') + resolveDomains().toString() + resolve('port'), nm);
    }

    if (!RegExp.test(_const2.resolveURLRgxp, apiURL)) {
      return (0, _url.concatURLs)(...resolveDomains({
        slice: 2,
        join: false
      }), resolve('namespace'));
    }

    return apiURL.replace(_const2.resolveURLRgxp, (str, protocol, auth, domains, port, nm) => {
      domains = domains?.split('.').reverse();
      nm = resolve('namespace', nm);

      if (protocol == null) {
        return (0, _url.concatURLs)(...resolveDomains({
          slice: 2,
          join: false
        }), nm);
      }

      return (0, _url.concatURLs)(resolve('protocol', protocol) + resolve('auth', auth) + resolveDomains({
        def: domains
      }).toString() + resolve('port', port), nm);
    });

    function resolveDomains({
      def = [],
      slice = 0,
      join = true
    } = {}) {
      const list = Array.from({
        length: 6
      }, (el, i) => i + 1).slice(slice).reverse(),
            url = [];

      for (let i = 0; i < list.length; i++) {
        const lvl = list[i];
        let domain = lvl === 1 ? api.zone : api[`domain${lvl}`];

        if (domain == null) {
          domain = def[lvl - 1];
        } else if (domain === '') {
          domain = undefined;
        }

        if (domain != null) {
          url.push(domain);
        }
      }

      return join !== false ? url.join('.') : url;
    }

    function resolve(name, def) {
      const val = String((api[name] != null ? api[name] : def) ?? '');

      switch (name) {
        case 'auth':
          return val !== '' ? `${val}@` : '';

        case 'port':
          return val !== '' ? `:${val}` : '';

        case 'protocol':
          return val !== '' ? `${val.replace(/:\/+$/, '')}://` : '';

        default:
          return val;
      }
    }
  }
  /**
   * Resolves request parameters and returns an absolute URL for the request
   * @param [url] - base request URL
   */


  resolveRequest(url) {
    if (url == null) {
      url = '';
    } else {
      const p = this.params,
            q = this.query;
      let data;

      if (this.withoutBody) {
        data = q;
      } else {
        data = Object.isPlainObject(p.body) ? p.body : q;
      }

      if (Object.isPlainObject(data)) {
        p.headers = (0, _utils.normalizeHeaders)(p.headers, data);
        url = (0, _utils.applyQueryForStr)(url, data, _const2.queryTplRgxp);
      } else {
        p.headers = (0, _utils.normalizeHeaders)(p.headers);
      }

      const urlChunks = url.split('?', 2);

      if (urlChunks.length > 1) {
        Object.assign(q, (0, _url.fromQueryString)(url));
        url = urlChunks[0];
      }

      if (Object.size(q) > 0) {
        url = `${url}?${p.querySerializer(q)}`;
      }

      if (this.canCache) {
        this.cacheKey = this.getRequestKey(url);
      }
    }

    return this.params.url = url;
  }
  /**
   * Returns an absolute URL for the request
   *
   * @see [[RequestContext.resolveRequest]]
   * @param [url] - base request URL
   */


  resolveURL(url) {
    return this.resolveRequest(url);
  }
  /**
   * Drops a value of the request from the cache
   */


  dropCache() {
    const key = this.cacheKey;

    if (key != null) {
      this.cache.remove(key);
    }
  }

}, ((0, _applyDecoratedDescriptor2.default)(_class.prototype, "resolveURL", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "resolveURL"), _class.prototype)), _class));
exports.default = RequestContext;