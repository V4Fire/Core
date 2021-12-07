"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleEngine = void 0;

var _styles = require("../../../core/log/config/styles");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
class ConsoleEngine {
  stringifiedStylesCache = Object.createDict();

  constructor(styles) {
    if (styles != null) {
      this.stylesCache = (0, _styles.createStyleCache)(styles);
    }
  }
  /**
   * Prints the specified event to a console
   * @param event - log event to print
   */


  log(event) {
    if (Object.size(event.additionals) === 0 && event.error == null) {
      console.log(`%c${event.context}`, this.getStringifiedStyle(event.level));
    } else {
      const details = [];

      if (Object.size(event.additionals) > 0) {
        details.push(event.additionals);
      }

      if (event.error != null) {
        details.push(event.error);
      }

      console.log(`%c${event.context}`, this.getStringifiedStyle(event.level), ...details);
    }
  }
  /**
   * Returns a string representing of a style for the specified log level
   * @param logLevel - level of logging that needs a style
   */


  getStringifiedStyle(logLevel) {
    if (!this.stylesCache) {
      return '';
    }

    const val = this.stringifiedStylesCache[logLevel];

    if (val !== undefined) {
      return val;
    }

    const style = this.stylesCache.getStyle(logLevel);

    if (!style) {
      return '';
    }

    let stringifiedStyle = '';

    for (let keys = Object.keys(style), i = 0; i < keys.length; i++) {
      const key = keys[i];
      stringifiedStyle += `${key.dasherize()}:${String(style[key])};`;
    }

    if (stringifiedStyle === '') {
      return '';
    }

    return this.stringifiedStylesCache[logLevel] = stringifiedStyle;
  }

}

exports.ConsoleEngine = ConsoleEngine;