"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitLikeEvents = exports.dataProviderMethodsToReplace = exports.asyncOptionsKeys = void 0;
const emitLikeEvents = ['emit', 'fire', 'dispatch', 'dispatchEvent'];
exports.emitLikeEvents = emitLikeEvents;
const dataProviderMethodsToReplace = ['get', 'peek', 'post', 'add', 'update', 'delete'];
exports.dataProviderMethodsToReplace = dataProviderMethodsToReplace;
const asyncOptionsKeys = ['group', 'label', 'join'];
exports.asyncOptionsKeys = asyncOptionsKeys;