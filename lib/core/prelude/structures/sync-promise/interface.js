"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.State = void 0;
let State = function (State) {
  State[State["pending"] = 0] = "pending";
  State[State["fulfilled"] = 1] = "fulfilled";
  State[State["rejected"] = 2] = "rejected";
  return State;
}({});
exports.State = State;