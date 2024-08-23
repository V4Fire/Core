"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  toQueryString: true,
  fromQueryString: true
};
exports.fromQueryString = fromQueryString;
exports.toQueryString = toQueryString;
var _json = require("../../core/json");
var _const = require("../../core/url/const");
var _interface = require("../../core/url/interface");
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
function toQueryString(data, optsOrEncode) {
  if (!Object.isDictionary(data)) {
    return Object.isString(data) ? data : '';
  }
  let opts;
  if (Object.isPlainObject(optsOrEncode)) {
    opts = optsOrEncode;
  } else {
    opts = {
      encode: optsOrEncode
    };
  }
  const separator = opts.separator ?? '_',
    paramsFilter = opts.paramsFilter ?? _const.defaultToQueryStringParamsFilter;
  const stack = Object.keys(data).sort().reverse().map(key => ({
    key,
    el: data[key],
    checked: false
  }));
  const dictionaryKeyTransformer = opts.arraySyntax ? (baseKey, additionalKey) => `${baseKey}[${additionalKey}]` : (baseKey, additionalKey) => `${baseKey}${separator}${additionalKey}`;
  const arrayKeyTransformer = opts.arraySyntax ? baseKey => `${baseKey}[]` : baseKey => baseKey;
  let res = '';
  while (stack.length > 0) {
    const item = stack.pop();
    if (item == null) {
      continue;
    }
    const {
      el,
      key
    } = item;
    if (Object.isDictionary(el)) {
      const keys = Object.keys(el).sort();
      if (keys.length > 0) {
        for (let i = keys.length - 1; i >= 0; i--) {
          checkAndPush(item, keys[i], dictionaryKeyTransformer);
        }
        continue;
      }
    }
    if (Object.isArray(el) && el.length > 0) {
      for (let key = el.length - 1; key >= 0; key--) {
        checkAndPush(item, key, arrayKeyTransformer);
      }
      continue;
    }
    if (item.checked || Object.isTruly(paramsFilter(el, key))) {
      let data;
      if (Object.isDictionary(el)) {
        data = '';
      } else {
        data = String(el ?? '');
        if (opts.encode !== false) {
          data = encodeURIComponent(data);
        }
      }
      res += `&${key}=${data}`;
    }
  }
  return res.substr(1);
  function checkAndPush(item, key, keyTransformer) {
    const normalizedKey = String(key),
      nextLvlKey = keyTransformer(item.key, normalizedKey),
      el = Object.get(item.el, [key]);
    if (Object.isTruly(paramsFilter(el, normalizedKey, nextLvlKey))) {
      stack.push({
        key: nextLvlKey,
        el,
        checked: true
      });
    }
  }
}
const isInvalidKey = /\b__proto__\b/,
  arraySyntaxRgxp = /\[([^\]]*)]/g,
  normalizeURLRgxp = /^(?:[^?]*\?|(?:\w+:)?\/\/.*)/;
function fromQueryString(query, optsOrDecode) {
  const queryObj = {};
  query = query.replace(normalizeURLRgxp, '');
  if (query === '') {
    return queryObj;
  }
  let opts;
  if (Object.isPlainObject(optsOrDecode)) {
    opts = optsOrDecode;
  } else {
    opts = {
      decode: optsOrDecode
    };
  }
  const objOpts = {
    separator: opts.arraySyntax ? ']' : opts.separator
  };
  const indices = Object.createDict(),
    variables = query.split('&');
  for (let i = 0; i < variables.length; i++) {
    let [key, val = null] = variables[i].split('=');
    if (opts.decode !== false) {
      key = decodeURIComponent(key);
      if (val != null) {
        val = decodeURIComponent(val);
      }
    }
    if (opts.arraySyntax) {
      let path = '',
        nestedArray = false;
      key = key.replace(arraySyntaxRgxp, (str, prop, lastIndex) => {
        if (path === '') {
          path += key.slice(0, lastIndex);
        }
        path += str;
        if (prop === '') {
          if (nestedArray) {
            prop = '0';
          } else {
            prop = indices[path] ?? '0';
            indices[path] = Number(prop) + 1;
          }
          nestedArray = true;
        }
        return `]${prop}`;
      });
    }
    const oldVal = objOpts.separator != null ? Object.get(queryObj, key, objOpts) : queryObj[key];
    let normalizedVal = opts.convert !== false ? Object.parse(val, _json.convertIfDate) : val;
    if (oldVal !== undefined) {
      normalizedVal = Array.toArray(oldVal, Object.isArray(normalizedVal) ? [normalizedVal] : normalizedVal);
    }
    if (isInvalidKey.test(key)) {
      continue;
    }
    if (objOpts.separator != null) {
      Object.set(queryObj, key, normalizedVal, objOpts);
    } else {
      queryObj[key] = normalizedVal;
    }
  }
  return queryObj;
}