"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extend = _interopRequireDefault(require("../../../core/prelude/extend"));
var _const = require("../../../core/prelude/string/const");
(0, _extend.default)(String.prototype, 'letters', function* letters() {
  let baseStr = null,
    prevChar = null;
  let needConcat = false;
  for (const char of this) {
    let saveConcat = false;
    if (_const.unicode.modifiers.test(char) || _const.unicode.textModifiers.test(char)) {
      needConcat = true;
      if (_const.unicode.zeroWidthJoiner.test(char)) {
        saveConcat = true;
      }
    } else if (prevChar != null) {
      const isColor = _const.unicode.colorModifiers.test(char);
      if (isColor && _const.unicode.zeroWidthJoiner.test(prevChar)) {
        needConcat = true;
        saveConcat = true;
      } else if (!needConcat) {
        needConcat = isColor && _const.unicode.emojiWithColorModifiers.test(prevChar) || _const.unicode.regionalIndicators.test(char) && _const.unicode.regionalIndicators.test(prevChar);
      }
    }
    if (needConcat) {
      baseStr = (baseStr ?? '') + char;
    } else {
      if (baseStr != null) {
        yield baseStr;
      }
      baseStr = char;
    }
    prevChar = char;
    if (!saveConcat) {
      needConcat = false;
    }
  }
  if (baseStr != null) {
    yield baseStr;
  }
});
(0, _extend.default)(String, 'letters', str => str.letters());