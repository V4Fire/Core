"use strict";

var _mimeType = require("../../core/mime-type");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/mime-type', () => {
  it('`getDataType`', () => {
    expect((0, _mimeType.getDataType)('application/json')).toBe('json');
    expect((0, _mimeType.getDataType)('application/x-protobuf;...')).toBe('arrayBuffer');
  });
  it('getData`TypeFromURI', () => {
    expect((0, _mimeType.getDataTypeFromURI)('data:application/javascript;...')).toBe('text');
  });
});