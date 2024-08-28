"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../../core/prelude/extend"));
(0, _extend.default)(Object, 'forEach', (obj, optsOrCb, cbOrOpts) => {
  if (obj == null) {
    return;
  }
  let p, cb;
  if (Object.isFunction(cbOrOpts)) {
    cb = cbOrOpts;
    p = Object.isPlainObject(optsOrCb) ? optsOrCb : {};
  } else {
    if (Object.isFunction(optsOrCb)) {
      cb = optsOrCb;
    } else {
      throw new ReferenceError('A callback to iterate is not specified');
    }
    p = Object.isPlainObject(cbOrOpts) ? cbOrOpts : {};
  }
  const passDescriptor = p.passDescriptor ?? p.withDescriptor;
  let notOwn;
  switch (p.propsToIterate) {
    case 'all':
      notOwn = true;
      break;
    case 'own':
      notOwn = false;
      break;
    case 'inherited':
      notOwn = -1;
      break;
    default:
      notOwn = p.notOwn;
  }
  if (Object.isString(obj)) {
    let i = 0;
    for (const el of obj) {
      let iterVal = el;
      if (passDescriptor) {
        iterVal = {
          configurable: false,
          enumerable: true,
          writable: false,
          value: el
        };
      }
      cb(iterVal, i++, obj);
    }
    return;
  }
  if (typeof obj !== 'object') {
    return;
  }
  if (!passDescriptor && notOwn == null) {
    if (Object.isArrayLike(obj)) {
      for (var i = 0; i < obj.length; i++) {
        cb(obj[i], i, obj);
      }
      return;
    }
    if (Object.isMap(obj) || Object.isSet(obj)) {
      for (const [key, el] of obj.entries()) {
        cb(el, key, obj);
      }
      return;
    }
    if (Object.isIterable(obj)) {
      let i = 0;
      for (const el of obj) {
        if (Object.isArray(el) && el.length === 2) {
          cb(el[1], el[0], obj);
        } else {
          cb(el, i++, obj);
        }
      }
      return;
    }
  }
  if (Object.isTruly(notOwn)) {
    if (notOwn === -1) {
      for (const key in obj) {
        if (Object.hasOwnProperty(obj, key)) {
          continue;
        }
        cb(passDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key], key, obj);
      }
      return;
    }
    if (p.withNonEnumerables) {
      Object.forEach(obj, cb, {
        withNonEnumerables: true,
        passDescriptor
      });
      Object.forEach(Object.getPrototypeOf(obj), cb, {
        propsToIterate: 'all',
        passDescriptor
      });
      return;
    }
    for (const key in obj) {
      const el = passDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key];
      cb(el, key, obj);
    }
    return;
  }
  const keys = p.withNonEnumerables ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
  keys.forEach(key => {
    const el = passDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key];
    cb(el, key, obj);
  });
});