"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serialize = serialize;
let xmlSerializer;
function serialize(node) {
  xmlSerializer ??= require('w3c-xmlserializer');
  return xmlSerializer(node);
}