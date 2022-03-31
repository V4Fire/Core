"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertDataToSend = convertDataToSend;

var _env = require("../../../core/env");

var _const = require("../../../core/request/engines/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Converts the specified data to send via request engines.
 * The function returns a tuple, where on the first position is converted data and its new content type on
 * the second position.
 *
 * @param data
 * @param [contentType]
 */
function convertDataToSend(data, contentType) {
  if (data == null) {
    return [undefined, contentType];
  }

  if (Object.isPrimitive(data)) {
    return [String(data), contentType];
  }

  if (Object.isDictionary(data)) {
    const keys = Object.keys(data);
    let needFormData = false;

    for (let i = 0; i < keys.length; i++) {
      if (needFormToSend(data[keys[i]])) {
        needFormData = true;
        break;
      }
    }

    if (needFormData) {
      const formData = new _const.FormData();

      const append = (key, val) => {
        if (Object.isIterable(val)) {
          Object.forEach(val, val => append(key, val));
          return;
        }

        if (needFormToSend(val)) {
          formData.append(key, val);
        } else {
          formData.append(key, JSON.stringify(val));
        }
      };

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        append(key, data[key]);
      }

      return [formData, contentType];
    }

    if (contentType == null) {
      contentType = 'application/json;charset=UTF-8';
    }

    return [JSON.stringify(data), contentType];
  }

  return [Object.cast(data), contentType];

  function needFormToSend(val) {
    if (Object.isArray(val)) {
      return val.some(needFormToSend);
    }

    if (_env.IS_NODE) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-nodejs-modules
      return val instanceof Buffer || val instanceof require('stream').Readable;
    }

    return val instanceof File || val instanceof FileList;
  }
}