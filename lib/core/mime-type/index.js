"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getDataTypeFromURI: true,
  getDataTypeFromURL: true,
  getDataType: true
};
exports.getDataType = getDataType;
exports.getDataTypeFromURI = getDataTypeFromURI;
exports.getDataTypeFromURL = getDataTypeFromURL;
var _deprecation = require("../../core/functools/deprecation");
var _const = require("../../core/mime-type/const");
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
var _interface = require("../../core/mime-type/interface");
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
function getDataTypeFromURI(uri) {
  const mime = _const.dataURIRgxp.exec(uri)?.[1];
  return mime != null ? getDataType(mime) : undefined;
}
function getDataTypeFromURL(url) {
  (0, _deprecation.deprecate)({
    type: 'function',
    name: 'getDataTypeFromURL',
    renamedTo: 'getDataTypeFromURI'
  });
  return getDataTypeFromURI(url);
}
function getDataType(str) {
  const type = str.toLowerCase().replace(_const.normalizeMimeStrRgxp, '').trim(),
    predefinedType = _const.mimeTypes[type];
  if (predefinedType != null) {
    return predefinedType;
  }
  if (_const.isXMLType.test(type)) {
    return 'document';
  }
  if (_const.isTextType.test(type)) {
    return 'text';
  }
  return 'blob';
}