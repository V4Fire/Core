"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serialize = serialize;
let xmlSerializer;
function serialize(node) {
  xmlSerializer ??= new XMLSerializer();
  return xmlSerializer.serializeToString(node);
}