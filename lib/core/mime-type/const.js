"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeMimeStrRgxp = exports.mimeTypes = exports.isXMLType = exports.isTextType = exports.dataURIRgxp = void 0;
const normalizeMimeStrRgxp = /;.*/,
  dataURIRgxp = /^data:([^;]+);/;
exports.dataURIRgxp = dataURIRgxp;
exports.normalizeMimeStrRgxp = normalizeMimeStrRgxp;
const isTextType = /^text(?:\/|$)/,
  isXMLType = /^\w+\/\w+[-+]xml\b/;
exports.isXMLType = isXMLType;
exports.isTextType = isTextType;
const mimeTypes = Object.createDict({
  'application/json': 'json',
  'application/javascript': 'text',
  'application/xml': 'document',
  'text/xml': 'document',
  'text/html': 'document',
  'multipart/form-data': 'formData',
  'application/x-www-form-urlencoded': 'text',
  'application/x-msgpack': 'arrayBuffer',
  'application/x-protobuf': 'arrayBuffer',
  'application/vnd.google.protobuf': 'arrayBuffer',
  'application/octet-stream': 'arrayBuffer'
});
exports.mimeTypes = mimeTypes;