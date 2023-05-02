"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  parserStates: true,
  parserStateTypes: true
};
Object.defineProperty(exports, "parserStateTypes", {
  enumerable: true,
  get: function () {
    return _const.parserStateTypes;
  }
});
Object.defineProperty(exports, "parserStates", {
  enumerable: true,
  get: function () {
    return _const.parserStates;
  }
});
var _colon = require("../../../../../core/json/stream/parser/states/colon");
Object.keys(_colon).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _colon[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _colon[key];
    }
  });
});
var _done = require("../../../../../core/json/stream/parser/states/done");
Object.keys(_done).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _done[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _done[key];
    }
  });
});
var _key = require("../../../../../core/json/stream/parser/states/key");
Object.keys(_key).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _key[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _key[key];
    }
  });
});
var _numberStart = require("../../../../../core/json/stream/parser/states/number-start");
Object.keys(_numberStart).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _numberStart[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _numberStart[key];
    }
  });
});
var _numberDigit = require("../../../../../core/json/stream/parser/states/number-digit");
Object.keys(_numberDigit).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _numberDigit[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _numberDigit[key];
    }
  });
});
var _numberExpDigit = require("../../../../../core/json/stream/parser/states/number-exp-digit");
Object.keys(_numberExpDigit).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _numberExpDigit[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _numberExpDigit[key];
    }
  });
});
var _numberExpSign = require("../../../../../core/json/stream/parser/states/number-exp-sign");
Object.keys(_numberExpSign).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _numberExpSign[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _numberExpSign[key];
    }
  });
});
var _numberExpStart = require("../../../../../core/json/stream/parser/states/number-exp-start");
Object.keys(_numberExpStart).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _numberExpStart[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _numberExpStart[key];
    }
  });
});
var _numberExponent = require("../../../../../core/json/stream/parser/states/number-exponent");
Object.keys(_numberExponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _numberExponent[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _numberExponent[key];
    }
  });
});
var _numberFraction = require("../../../../../core/json/stream/parser/states/number-fraction");
Object.keys(_numberFraction).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _numberFraction[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _numberFraction[key];
    }
  });
});
var _numberFractionDigit = require("../../../../../core/json/stream/parser/states/number-fraction-digit");
Object.keys(_numberFractionDigit).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _numberFractionDigit[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _numberFractionDigit[key];
    }
  });
});
var _numberFractionStart = require("../../../../../core/json/stream/parser/states/number-fraction-start");
Object.keys(_numberFractionStart).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _numberFractionStart[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _numberFractionStart[key];
    }
  });
});
var _stop = require("../../../../../core/json/stream/parser/states/stop");
Object.keys(_stop).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _stop[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _stop[key];
    }
  });
});
var _string = require("../../../../../core/json/stream/parser/states/string");
Object.keys(_string).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _string[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _string[key];
    }
  });
});
var _value = require("../../../../../core/json/stream/parser/states/value");
Object.keys(_value).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _value[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _value[key];
    }
  });
});
var _const = require("../../../../../core/json/stream/parser/const");