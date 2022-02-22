"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _json = require("../../../../core/json");

var _parser = _interopRequireDefault(require("../../../../core/json/stream/parser"));

var _assembler = _interopRequireDefault(require("../../../../core/json/stream/assembler"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/json/stream/assembler', () => {
  it('should assemble tokens to a valid object', async () => {
    const data = [{
      a: 1,
      b: {
        c: [1, 2, 3]
      }
    }, true, false, null, 'hello world', 'bla\t\'bla\'\n"bla"', 2, -1, 1e10, -1E10, 1e-10, 1.2, -1.242, 3.53e-2, -7.341E-5];

    for await (const val of _parser.default.from(JSON.stringify(data), new _assembler.default())) {
      expect(val).toEqual(data);
    }
  });
  it('should assemble a tokens to a valid object with the custom reviver', async () => {
    const data = [new Date()];

    for await (const val of _parser.default.from(JSON.stringify(data), new _assembler.default({
      reviver: _json.convertIfDate
    }))) {
      expect(val).toEqual(data);
    }
  });
  it('should assemble tokens to a valid object with numbers as strings', async () => {
    for await (const val of _parser.default.from('-13.4e-3', new _assembler.default({
      numberAsString: true
    }))) {
      expect(val).toEqual('-13.4e-3');
    }
  });
});