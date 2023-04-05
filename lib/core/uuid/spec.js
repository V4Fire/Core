"use strict";

var _uuid = require("../../core/uuid");
describe('core/uuid', () => {
  const uuid = new Uint8Array([174, 42, 253, 26, 185, 60, 17, 234, 179, 222, 2, 66, 172, 19, 0, 4]);
  it('`generate`', () => {
    expect((0, _uuid.generate)()).toBeInstanceOf(Uint8Array);
  });
  it('`serialize`', () => {
    expect((0, _uuid.serialize)(uuid)).toEqual('ae2afd1a-b93c-11ea-b3de-0242ac130004');
  });
  it('`parse`', () => {
    expect((0, _uuid.parse)('ae2afd1a-b93c-11ea-b3de-0242ac130004')).toEqual(uuid);
  });
});