"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _interface = require("../../core/range/interface");
Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});
class Range {
  isReversed = false;
  constructor(start = -Infinity, end = Infinity) {
    const unwrap = v => Object.isArray(v) ? v[0] : v;
    const unwrappedStart = unwrap(start),
      unwrappedEnd = unwrap(end);
    let type;
    if (Object.isArray(start)) {
      const r = new Range(unwrappedStart);
      if (unwrappedStart !== unwrappedEnd) {
        start = r.toType(r.start + (unwrappedStart > unwrappedEnd ? -1 : 1));
      } else {
        start = NaN;
        type = r.type;
      }
    }
    if (Object.isArray(end)) {
      const r = new Range(unwrappedEnd);
      if (unwrappedStart !== unwrappedEnd) {
        end = r.toType(r.start + (unwrappedStart > unwrappedEnd ? 1 : -1));
      } else {
        end = NaN;
        type ??= r.type;
      }
    }
    if (Object.isString(start) || Object.isString(end)) {
      this.type = 'string';
      if (Object.isString(start)) {
        this.start = codePointAt(start);
      } else if (Object.isNumber(start)) {
        if (isFinite(start)) {
          this.start = codePointAt(String.fromCodePoint(start));
        } else {
          this.start = start;
        }
      } else if (start == null) {
        this.start = -Infinity;
      } else {
        this.start = NaN;
      }
      if (Object.isString(end)) {
        this.end = codePointAt(end);
      } else if (Object.isNumber(end)) {
        if (isFinite(end)) {
          this.end = codePointAt(String.fromCodePoint(end));
        } else {
          this.end = end;
        }
      } else if (end == null) {
        this.end = Infinity;
      } else {
        this.end = NaN;
      }
    } else {
      this.type = type ?? (Object.isDate(start) || Object.isDate(end) ? 'date' : 'number');
      this.start = start == null ? -Infinity : Number(start);
      this.end = Number(end);
    }
    if (this.start > this.end) {
      [this.start, this.end] = [this.end, this.start];
      this.isReversed = true;
    }
  }
  [Symbol.iterator]() {
    return this.values();
  }
  isValid() {
    return !Number.isNaN(this.start) && !Number.isNaN(this.end);
  }
  contains(el) {
    if (el instanceof Range) {
      return this.start <= el.start && this.end >= el.end;
    }
    const val = Object.isString(el) ? codePointAt(el) : Number(el);
    return this.start <= val && val <= this.end;
  }
  intersect(range) {
    const start = Math.max(this.start, range.start),
      end = Math.min(this.end, range.end);
    if (this.type !== range.type) {
      return new Range(0, [0]);
    }
    const newRange = start <= end ? new Range(start, end) : new Range(0, [0]);
    newRange.type = this.type;
    newRange.isReversed = this.isReversed;
    return newRange;
  }
  union(range) {
    if (this.type !== range.type) {
      return new Range(0, [0]);
    }
    const newRange = new Range(Math.min(this.start, range.start), Math.max(this.end, range.end));
    newRange.type = this.type;
    newRange.isReversed = this.isReversed;
    return newRange;
  }
  clone() {
    const range = new Range(this.start, this.end);
    range.type = this.type;
    range.isReversed = this.isReversed;
    return range;
  }
  reverse() {
    const range = new Range(this.end, this.start);
    range.type = this.type;
    return range;
  }
  clamp(el) {
    const val = Object.isString(el) ? codePointAt(el) : Number(el);
    if (!this.isValid()) {
      return null;
    }
    if (this.end < val) {
      return this.toType(this.end);
    }
    if (this.start > val) {
      return this.toType(this.start);
    }
    return this.toType(val);
  }
  span() {
    if (!this.isValid()) {
      return 0;
    }
    if (!isFinite(this.start) || !isFinite(this.end)) {
      return Infinity;
    }
    return this.end - this.start + 1;
  }
  values(step) {
    const that = this,
      iter = createIter();
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: iter.next.bind(iter)
    };
    function* createIter() {
      if (!that.isValid()) {
        return;
      }
      if (step == null || step === 0) {
        if (that.type === 'date') {
          if (isFinite(that.start) && isFinite(that.end)) {
            step = (that.end - that.start) * 0.01;
          } else {
            step = 30 .days();
          }
        } else {
          step = 1;
        }
      }
      if (!Number.isNatural(step)) {
        throw new TypeError('Step value can be only a natural number');
      }
      let start, end;
      const isStringRange = that.type === 'string';
      if (isFinite(that.start)) {
        start = that.start;
      } else if (isStringRange) {
        start = 0;
      } else {
        start = Number.MIN_SAFE_INTEGER;
      }
      if (isFinite(that.end)) {
        end = that.end;
      } else {
        end = Number.MAX_SAFE_INTEGER;
      }
      if (that.isReversed) {
        for (let i = end; i >= start; i -= step) {
          try {
            yield that.toType(i);
          } catch {
            break;
          }
        }
      } else {
        for (let i = start; i <= end; i += step) {
          try {
            yield that.toType(i);
          } catch {
            break;
          }
        }
      }
    }
  }
  indices(step) {
    const that = this,
      iter = createIter();
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: iter.next.bind(iter)
    };
    function* createIter() {
      const iter = that.values(step);
      for (let el = iter.next(), i = 0; !el.done; el = iter.next(), i++) {
        yield i;
      }
    }
  }
  entries(step) {
    const that = this,
      iter = createIter();
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: iter.next.bind(iter)
    };
    function* createIter() {
      const iter = that.values(step);
      for (let el = iter.next(), i = 0; !el.done; el = iter.next(), i++) {
        yield [i, el.value];
      }
    }
  }
  toArray(step) {
    if (this.isValid() && !isFinite(this.span())) {
      throw new RangeError("Can't create an array of the infinitive range. Use an iterator instead.");
    }
    return [...this.values(step)];
  }
  toString() {
    if (!this.isValid()) {
      return '';
    }
    const res = [];
    if (isFinite(this.start)) {
      res.push(this.toType(this.start));
    } else {
      res.push('');
    }
    if (isFinite(this.end)) {
      res.push(this.toType(this.end));
    } else {
      res.push('');
    }
    if (this.isReversed) {
      res.reverse();
    }
    return res.join('..');
  }
  toType(value) {
    switch (this.type) {
      case 'string':
        return String.fromCodePoint(value);
      case 'date':
        return new Date(value);
      default:
        return value;
    }
  }
}
exports.default = Range;
function codePointAt(str, pos = 0) {
  const v = str.codePointAt(pos);
  return v == null || Number.isNaN(v) ? NaN : v;
}