"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDateModifier = createDateModifier;
exports.createStaticDateComparator = createStaticDateComparator;
exports.createStaticDateFormatter = createStaticDateFormatter;
exports.createStaticDateModifier = createStaticDateModifier;
function createDateModifier(mod = a => a) {
  return function modifyDate(params, reset) {
    const resetValues = {};
    const setResetValue = (...keys) => {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (resetValues[key] !== false) {
          resetValues[key] = true;
        }
      }
    };
    for (let keys = Object.keys(params), i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!key.endsWith('s')) {
        params[`${key}s`] = params[key];
      }
    }
    if (params.milliseconds != null) {
      resetValues.milliseconds = false;
      this.setMilliseconds(mod(params.milliseconds, this.getMilliseconds()));
    }
    if (params.seconds != null) {
      resetValues.seconds = false;
      setResetValue('milliseconds');
      this.setSeconds(mod(params.seconds, this.getSeconds()));
    }
    if (params.minutes != null) {
      resetValues.minutes = false;
      setResetValue('milliseconds', 'seconds');
      this.setMinutes(mod(params.minutes, this.getMinutes()));
    }
    if (params.hours != null) {
      resetValues.hours = false;
      setResetValue('milliseconds', 'seconds', 'minutes');
      this.setHours(mod(params.hours, this.getHours()));
    }
    if (params.days != null) {
      resetValues.days = false;
      setResetValue('milliseconds', 'seconds', 'minutes', 'hours');
      this.setDate(mod(params.days, this.getDate()));
    }
    if (params.months != null) {
      resetValues.months = false;
      setResetValue('milliseconds', 'seconds', 'minutes', 'hours', 'days');
      this.setMonth(mod(params.months, this.getMonth()));
    }
    if (params.years != null) {
      resetValues.years = false;
      setResetValue('milliseconds', 'seconds', 'minutes', 'hours', 'days', 'months');
      this.setFullYear(mod(params.years, this.getFullYear()));
    }
    if (reset) {
      if (resetValues.milliseconds) {
        this.setMilliseconds(0);
      }
      if (resetValues.seconds) {
        this.setSeconds(0);
      }
      if (resetValues.minutes) {
        this.setMinutes(0);
      }
      if (resetValues.hours) {
        this.setHours(0);
      }
      if (resetValues.days) {
        this.setDate(1);
      }
      if (resetValues.months) {
        this.setMonth(0);
      }
    }
    return this;
  };
}
function createStaticDateModifier(method) {
  return (date, units, reset) => {
    if (Object.isPlainObject(date) || Object.isBoolean(units)) {
      reset = Boolean(units);
      units = date;
      return date => Date[Symbol.for('[[V4_EXTEND_API]]')][method](date, units, reset);
    }
    return date[method](units, reset);
  };
}
function createStaticDateComparator(method) {
  return function comparator(date1, date2, margin) {
    if (arguments.length < 2 || arguments.length < 3 && Object.isNumber(date1)) {
      if (Object.isNumber(date1)) {
        margin = date1;
        date1 = date2;
      }
      return (date2, m) => Date[Symbol.for('[[V4_EXTEND_API]]')][method](date1, date2, margin ?? m);
    }
    return Date.create(date1)[method](date2, margin);
  };
}
function createStaticDateFormatter(method) {
  return (date, opts) => {
    if (Object.isString(date) || Object.isPlainObject(date)) {
      opts = date;
      return date => Date[Symbol.for('[[V4_EXTEND_API]]')][method](date, opts);
    }
    return date[method](opts);
  };
}