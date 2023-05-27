"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generate = generate;
exports.parse = parse;
exports.serialize = serialize;
var _env = require("../../core/env");
var _const = require("../../core/uuid/const");
function generate() {
  if (_env.IS_NODE) {
    const crypto = require('crypto');
    const uuid = crypto.randomBytes(16);
    uuid[6] = uuid[6] & 0x0f | 0x40;
    uuid[8] = uuid[8] & 0x3f | 0x80;
    const {
      toString
    } = uuid;
    uuid.toString = (...args) => {
      if (args.length === 0) {
        return serialize(uuid);
      }
      return toString.apply(uuid, args);
    };
    return uuid;
  }
  const tmpUrl = URL.createObjectURL(new Blob());
  URL.revokeObjectURL(tmpUrl);
  let uuidStr = tmpUrl.toString();
  uuidStr = uuidStr.split(/[:/]/g).pop().toLowerCase();
  const uuid = parse(uuidStr);
  uuid.toString = () => uuidStr;
  return uuid;
}
function serialize(uuid) {
  let res = '';
  for (let i = 0; i < uuid.length; ++i) {
    let chunk = uuid[i].toString(16);
    if (chunk.length < 2) {
      chunk = `0${chunk}`;
    }
    res += chunk + (_const.separatorIndices[i] === true ? '-' : '');
  }
  return res;
}
function parse(uuid) {
  const arr = new Uint8Array(16);
  for (let i = 0, byteIndex = 0; i < uuid.length; i++) {
    if (uuid[i] === '-') {
      continue;
    }
    arr[byteIndex++] = parseInt(uuid[i] + uuid[++i], 16);
  }
  return arr;
}