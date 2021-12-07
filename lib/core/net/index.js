"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  isOnline: true,
  syncStatusWithStorage: true,
  updateStatus: true
};
exports.isOnline = isOnline;
exports.syncStatusWithStorage = syncStatusWithStorage;
exports.updateStatus = updateStatus;

var _config = _interopRequireDefault(require("../../config"));

var netEngine = _interopRequireWildcard(require("../../core/net/engines"));

var _const = require("../../core/net/const");

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

var _interface = require("../../core/net/interface");

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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const {
  online
} = _config.default;
let storage, cache; // eslint-disable-next-line prefer-const

storage = Promise.resolve().then(() => _interopRequireWildcard(require('../../core/kv-storage'))).then(({
  asyncLocal
}) => asyncLocal.namespace('[[NET]]'));
/**
 * Returns information about the internet connection status
 *
 * @param [engine] - engine to test online connection
 *
 * @emits `online()`
 * @emits `offline(lastOnline: Date)`
 * @emits `status(value:` [[NetStatus]] `)`
 */

function isOnline(engine = netEngine) {
  if (cache != null) {
    return cache;
  }

  const res = (async () => {
    const prevStatus = _const.state.status; // eslint-disable-next-line require-atomic-updates

    _const.state.status = await engine.isOnline();

    if (_const.state.status == null) {
      return {
        status: true,
        lastOnline: undefined
      };
    }

    if (online.persistence && _const.state.lastOnline == null) {
      if (storage == null) {
        throw new ReferenceError("kv-storage module isn't loaded");
      }

      try {
        const lastStoredOnline = await (await storage).get('lastOnline');

        if (lastStoredOnline != null) {
          // eslint-disable-next-line require-atomic-updates
          _const.state.lastOnline = lastStoredOnline;
        }
      } catch {}
    }

    if (online.cacheTTL != null) {
      setTimeout(() => cache = undefined, online.cacheTTL);
    }

    if (prevStatus === undefined || _const.state.status !== prevStatus) {
      if (_const.state.status) {
        _const.emitter.emit('online', _const.state.lastOnline);
      } else {
        _const.emitter.emit('offline');
      }

      syncStatusWithStorage().catch(stderr);

      _const.emitter.emit('status', { ..._const.state
      });
    }

    return { ..._const.state
    };
  })();

  if (online.cacheTTL != null) {
    cache = res;
  }

  return res; // eslint-disable-next-line no-unreachable

  return Promise.resolve({
    status: true
  });
}

let storageSyncTimer;
/**
 * Synchronizes the online status with a local storage
 */

async function syncStatusWithStorage() {
  if (_const.state.status !== true) {
    return;
  }

  _const.state.lastOnline = new Date();

  const clear = () => {
    if (storageSyncTimer != null) {
      clearTimeout(storageSyncTimer);
      storageSyncTimer = undefined;
    }
  };

  clear();

  if (online.persistence) {
    if (storage == null) {
      throw new ReferenceError("kv-storage module isn't loaded");
    }

    try {
      await (await storage).set('lastOnline', _const.state.lastOnline);
    } catch (err) {
      stderr(err);
    }
  }

  if (online.lastDateSyncInterval != null) {
    clear();
    storageSyncTimer = setTimeout(() => {
      storageSyncTimer = undefined;
      syncStatusWithStorage().catch(stderr);
    }, online.lastDateSyncInterval);
  }
}

let checkTimer;
/**
 * Updates the online status
 */

async function updateStatus() {
  const clear = () => {
    if (checkTimer != null) {
      clearTimeout(checkTimer);
      checkTimer = undefined;
    }
  };

  clear();

  try {
    await isOnline();
  } catch (err) {
    stderr(err);
  }

  if (online.checkInterval != null) {
    clear();
    checkTimer = setTimeout(() => {
      checkTimer = undefined;
      updateStatus().catch(stderr);
    }, online.checkInterval);
  }
}

_const.emitter.on('sync', updateStatus);

updateStatus().catch(stderr);