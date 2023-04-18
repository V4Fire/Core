"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachMock = attachMock;
var _abortable = _interopRequireDefault(require("../../../../core/promise/abortable"));
var _data = require("../../../../core/data");
var _request = require("../../../../core/request");
var _const = require("../../../../core/data/middlewares/attach-mock/const");
var _helpers = require("../../../../core/data/middlewares/attach-mock/helpers");
async function attachMock(params) {
  if (_const.mockOpts.value == null) {
    await _const.optionsInitializer;
  }
  if (_const.mockOpts.value == null) {
    return;
  }
  const {
      opts,
      ctx
    } = params,
    mocks = await (0, _helpers.getProviderMocks)(this, opts);
  if (mocks == null) {
    return;
  }
  const requestData = Object.select(opts, ['query', 'body', 'headers']),
    mock = (0, _helpers.findMockForRequestData)(mocks[opts.method] ?? [], requestData);
  if (mock == null) {
    return;
  }
  const customResponse = {
    status: undefined,
    responseType: undefined,
    decoders: undefined,
    headers: undefined
  };
  let {
    response
  } = mock;
  if (Object.isFunction(response)) {
    response = response.call(this, params, customResponse);
  }
  return () => _abortable.default.resolve(response, ctx.parent).then(data => {
    const response = new _request.Response(data, {
      status: customResponse.status ?? mock.status ?? 200,
      responseType: customResponse.responseType ?? mock.responseType ?? opts.responseType,
      okStatuses: opts.okStatuses,
      decoder: mock.decoders === false ? undefined : customResponse.decoders ?? ctx.decoders,
      headers: customResponse.headers ?? mock.headers
    });
    if (!response.ok) {
      throw _abortable.default.wrapReasonToIgnore(new _data.RequestError(_data.RequestError.InvalidStatus, {
        request: ctx.params,
        response
      }));
    }
    return response;
  }).then(ctx.wrapAsResponse.bind(ctx));
}