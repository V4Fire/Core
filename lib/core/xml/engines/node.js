"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serialize = serialize;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
let xmlSerializer;
/**
 * Serializes the specified XML node to a string
 * @param node
 */

function serialize(node) {
  xmlSerializer ??= require('w3c-xmlserializer');
  return xmlSerializer(node);
}