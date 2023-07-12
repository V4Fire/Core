"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _const = require("../../../../core/kv-storage/engines/string/const");
class StringEngine {
  get serializedData() {
    return this.data;
  }
  separators = _const.defaultDataSeparators;
  set serializedData(data) {
    this.data = data;
  }
  constructor(opts = {}) {
    this.data = opts.data ?? '';
    Object.assign(this.separators, opts.separators);
  }
  has(key) {
    return key in this.getDataFromRaw();
  }
  get(key) {
    return this.getDataFromRaw()[key];
  }
  set(key, value) {
    const separators = Object.values(this.separators),
      isForbiddenCharacterUsed = separators.some(el => key.includes(el) || String(value).includes(el));
    if (isForbiddenCharacterUsed) {
      throw new TypeError(`The forbidden character used in string storage keys is "${key}", with value "${String(value)}"`);
    }
    this.updateData({
      [key]: String(value)
    });
  }
  remove(key) {
    this.updateData({
      [key]: undefined
    });
  }
  keys() {
    return Object.keys(this.getDataFromRaw());
  }
  clear(filter) {
    if (filter != null) {
      const state = this.getDataFromRaw();
      Object.entries(state).forEach(([key, value]) => {
        if (filter(String(value), key) === true) {
          delete state[key];
        }
      });
      this.overwriteData(state);
    } else {
      this.overwriteData({});
    }
  }
  updateData(data) {
    const currentState = this.getDataFromRaw();
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined) {
        delete currentState[key];
      } else {
        currentState[key] = value;
      }
    });
    this.overwriteData(currentState);
  }
  overwriteData(data) {
    const s = this.separators;
    this.serializedData = Object.entries(data).map(([key, value]) => `${key}${s.record}${value}`).join(s.chunk);
  }
  getDataFromRaw() {
    const {
      serializedData
    } = this;
    if (serializedData === '') {
      return {};
    }
    const s = this.separators;
    return serializedData.split(s.chunk).reduce((acc, el) => {
      const [key, value] = el.split(s.record);
      acc[key] = value;
      return acc;
    }, {});
  }
}
exports.default = StringEngine;