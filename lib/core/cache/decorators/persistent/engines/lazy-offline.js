"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _net = require("../../../../../core/net");
var _lazy = _interopRequireDefault(require("../../../../../core/cache/decorators/persistent/engines/lazy"));
class LazyPersistentOfflineEngine extends _lazy.default {
  async getCheckStorageState() {
    const online = (await (0, _net.isOnline)()).status;
    if (online) {
      return {
        available: false,
        checked: false
      };
    }
    return {
      available: true,
      checked: true
    };
  }
}
exports.default = LazyPersistentOfflineEngine;