"use strict";

var _extractor = require("../../../../core/log/middlewares/extractor");
var _testing = require("../../../../core/log/middlewares/extractor/testing");
let middleware;
describe('middlewares/extractor', () => {
  describe('no error extractors', () => {
    beforeEach(() => {
      middleware = new _extractor.ExtractorMiddleware();
    });
    afterEach(() => {
      middleware = undefined;
    });
    it('no error within a log event', () => {
      const logEvent = createLogEvent();
      middleware.exec(logEvent, res => {
        expect(res).toEqual(copyLogEvent(logEvent));
      });
    });
    it('error without details', () => {
      const logEvent = createLogEvent(new Error('no details'));
      middleware.exec(logEvent, res => {
        expect(res).toEqual(copyLogEvent(logEvent));
      });
    });
    it('error with details', () => {
      const errorDetails = {
          msg: 'just for fun'
        },
        logEvent = createLogEvent(new _testing.TestDetailedError('details', errorDetails));
      middleware.exec(logEvent, res => {
        expect(res).toEqual(copyLogEvent(logEvent, {
          error: {
            details: {
              reason: errorDetails
            }
          }
        }));
      });
    });
    it('error with a cause', () => {
      const causeErrorMessage = 'general error',
        logEvent = createLogEvent(new _testing.TestBaseError('no details', new Error(causeErrorMessage)));
      middleware.exec(logEvent, res => {
        expect(res).toEqual(copyLogEvent(logEvent, {
          error: {
            cause: {
              error: {
                name: 'Error',
                message: causeErrorMessage
              }
            }
          }
        }));
      });
    });
    it('error with details and a cause', () => {
      const errorDetails = {
          msg: 'yep'
        },
        causeErrorMessage = 'general error',
        logEvent = createLogEvent(new _testing.TestDetailedBaseError('details', errorDetails, new Error(causeErrorMessage)));
      middleware.exec(logEvent, res => {
        expect(res).toEqual(copyLogEvent(logEvent, {
          error: {
            details: {
              reason: errorDetails
            },
            cause: {
              error: {
                name: 'Error',
                message: causeErrorMessage
              }
            }
          }
        }));
      });
    });
    it('error with details and cause that has its own details and cause', () => {
      const errorDetails = {
          msg: 'yep'
        },
        causeDetails = {
          count: 7
        },
        causeMessage = 'cause error',
        causeCauseMessage = 'cause of the cause';
      const logEvent = createLogEvent(new _testing.TestDetailedBaseError('error details', errorDetails, new _testing.TestDetailedBaseError(causeMessage, causeDetails, new Error(causeCauseMessage))));
      middleware.exec(logEvent, res => {
        expect(res).toEqual(copyLogEvent(logEvent, {
          error: {
            details: {
              reason: errorDetails
            },
            cause: {
              error: {
                name: 'TestDetailedBaseError',
                message: causeMessage
              },
              details: {
                reason: causeDetails
              },
              cause: {
                error: {
                  name: 'Error',
                  message: causeCauseMessage
                }
              }
            }
          }
        }));
      });
    });
  });
  describe('has extractor', () => {
    beforeEach(() => {
      middleware = new _extractor.ExtractorMiddleware(new _testing.TestExtractor());
    });
    afterEach(() => {
      middleware = undefined;
    });
    it('error matches some extractor', () => {
      const errorDetails = {
          msg: 'yep'
        },
        logEvent = createLogEvent(new _testing.TestDetailedBaseError('details', errorDetails));
      middleware.exec(logEvent, res => {
        expect(res).toEqual(copyLogEvent(logEvent, {
          error: {
            details: errorDetails
          }
        }));
      });
    });
    it('error does not match any extractor', () => {
      const errorDetails = {
          msg: 'yep'
        },
        logEvent = createLogEvent(new _testing.TestDetailedError('details', errorDetails));
      middleware.exec(logEvent, res => {
        expect(res).toEqual(copyLogEvent(logEvent, {
          error: {
            details: {
              reason: errorDetails
            }
          }
        }));
      });
    });
  });
  function createLogEvent(error) {
    const logEvent = {
      context: 'test',
      level: error ? 'error' : 'info',
      additionals: {}
    };
    if (error) {
      logEvent.error = error;
    }
    return logEvent;
  }
  function copyLogEvent(srcLogEvent, additionals) {
    const copy = {
      context: srcLogEvent.context,
      level: srcLogEvent.level,
      additionals: additionals ?? srcLogEvent.additionals
    };
    if (srcLogEvent.error) {
      copy.error = srcLogEvent.error;
    }
    return copy;
  }
});