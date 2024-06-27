"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deniedProviderParams = exports.availableParams = void 0;
const deniedProviderParams = ['socket'];
exports.deniedProviderParams = deniedProviderParams;
const availableParams = ['url', 'method', 'contentType', 'body', 'query', 'headers', 'okStatuses', 'noContentStatuses', 'timeout', 'important', 'meta', 'parent'];
exports.availableParams = availableParams;