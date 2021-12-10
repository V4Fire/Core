"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.State = void 0;

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
let State;
exports.State = State;

(function (State) {
  State[State["pending"] = 0] = "pending";
  State[State["fulfilled"] = 1] = "fulfilled";
  State[State["rejected"] = 2] = "rejected";
})(State || (exports.State = State = {}));