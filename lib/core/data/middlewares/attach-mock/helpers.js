"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateMockMatchScore = calculateMockMatchScore;
exports.findMockForRequestData = findMockForRequestData;
exports.getProviderMocks = getProviderMocks;
var _const = require("../../../../core/data/middlewares/attach-mock/const");
async function getProviderMocks(provider, opts) {
  const id = opts.cacheId,
    mocksDecl = provider.constructor.mocks ?? provider.mocks;
  const canIgnore = mocksDecl == null || !Object.isString(id) || _const.mockOpts.value?.patterns.every(rgxp => !RegExp.test(rgxp, id));
  if (canIgnore) {
    return null;
  }
  let mocks = await mocksDecl;
  if (mocks == null) {
    return null;
  }
  if ('default' in mocks) {
    mocks = mocks.default;
  }
  return mocks;
}
function findMockForRequestData(mocks, requestData) {
  let bestMatch = {
    score: -1,
    mismatches: Number.MAX_SAFE_INTEGER,
    mock: null
  };
  mocks.forEach(mock => {
    if (mock != null) {
      const [score, mismatches] = calculateMockMatchScore(mock, requestData);
      if (score !== 0 && score >= bestMatch.score && bestMatch.mismatches > mismatches) {
        bestMatch = {
          score,
          mismatches,
          mock
        };
      }
    }
  });
  return bestMatch.mock ?? mocks[0];
}
function calculateMockMatchScore(mock, requestData) {
  const requestKeys = Object.keys(requestData);
  let score = 0,
    mismatches = 0;
  requestKeys: for (let i = 0; i < requestKeys.length; i++) {
    const key = requestKeys[i];
    if (!(key in mock)) {
      mismatches += 1;
      continue;
    }
    const valFromMock = mock[key],
      reqVal = requestData[key];
    if (Object.isPlainObject(valFromMock)) {
      for (let keys = Object.keys(valFromMock), i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!Object.fastCompare(valFromMock[key], reqVal[key])) {
          score = 0;
          break requestKeys;
        }
      }
      score += 1;
    } else if (Object.fastCompare(reqVal, valFromMock)) {
      score += 1;
    } else {
      score = 0;
    }
  }
  return [mismatches === requestKeys.length ? -1 : score, mismatches];
}