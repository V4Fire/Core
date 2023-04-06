"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Xor128 = void 0;
exports.default = random;
class Xor128 {
  y = 0;
  z = 0;
  w = 0;
  constructor(seed) {
    this.x = seed;
    for (let i = 0; i < 64; i++) {
      this.next();
    }
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    const t = this.x ^ this.x << 11;
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w ^= this.w >> 19 ^ t ^ t >> 8;
    return {
      done: false,
      value: this.w
    };
  }
}
exports.Xor128 = Xor128;
const generator = new Xor128(19881989);
function random() {
  return (generator.next().value >>> 0) / ((1 << 30) * 4);
}