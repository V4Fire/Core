"use strict";

var _mimeType = require("../../core/mime-type");
describe('core/mime-type', () => {
  it('`getDataType`', () => {
    expect((0, _mimeType.getDataType)('application/json')).toBe('json');
    expect((0, _mimeType.getDataType)('application/x-protobuf;...')).toBe('arrayBuffer');
  });
  it('getData`TypeFromURI', () => {
    expect((0, _mimeType.getDataTypeFromURI)('data:application/javascript;...')).toBe('text');
  });
});