"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("fake-indexeddb/auto");

var _browserIndexeddb = require("../../../core/kv-storage/engines/browser-indexeddb");

Object.keys(_browserIndexeddb).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _browserIndexeddb[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _browserIndexeddb[key];
    }
  });
});