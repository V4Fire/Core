"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _lazy = require("../../core/functools/lazy");
describe('core/functools', () => {
  describe('`@debounce`', () => {
    it('should decorate a method so it runs delayed by a specified number of ms.', done => {
      var _dec, _class;
      let Input = (_dec = (0, _lazy.debounce)(10), (_class = class Input {
        invocationsCount = 0;
        changeValue() {
          this.invocationsCount++;
        }
      }, ((0, _applyDecoratedDescriptor2.default)(_class.prototype, "changeValue", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "changeValue"), _class.prototype)), _class));
      const input1 = new Input();
      input1.changeValue();
      input1.changeValue();
      input1.changeValue();
      input1.changeValue();
      input1.changeValue();
      setTimeout(() => {
        expect(input1.invocationsCount).toBe(1);
        done();
      }, 20);
    });
    it('should work correctly with multiple instances', done => {
      var _dec2, _class2;
      let Input = (_dec2 = (0, _lazy.debounce)(10), (_class2 = class Input {
        invocationsCount = 0;
        changeValue() {
          this.invocationsCount++;
        }
      }, ((0, _applyDecoratedDescriptor2.default)(_class2.prototype, "changeValue", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "changeValue"), _class2.prototype)), _class2));
      const input1 = new Input();
      const input2 = new Input();
      input1.changeValue();
      input2.changeValue();
      input1.changeValue();
      input2.changeValue();
      setTimeout(() => {
        expect(input1.invocationsCount).toBe(1);
        expect(input2.invocationsCount).toBe(1);
        done();
      }, 20);
    });
  });
});