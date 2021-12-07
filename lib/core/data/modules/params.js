"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _functools = require("../../../core/functools");

var _request = _interopRequireDefault(require("../../../core/request"));

var _select = _interopRequireDefault(require("../../../core/object/select"));

var _const = require("../../../core/data/const");

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
class Provider {
  /**
   * Transport function for a request.
   * Basically, you can use an overload of the request API for flexibly extending.
   *
   * @see [[request]]
   * @see [[CreateRequestOptions]]
   *
   * @example
   * ```js
   * import request from '../../../core/request';
   *
   * class Parent extends Provider {
   *   static request = request({responseType: 'json'})
   * }
   *
   * class Children extends Parent {
   *   static request = Parent.request({credentials: true})
   * }
   * ```
   */
  static request = _request.default;
  /**
   * Sequence of middlewares that is provided to the request function.
   * An object form is easily to extend, bur you can choose any different form.
   *
   * @see [[Middlewares]]
   * @example
   * ```js
   * import request from '../../../core/request';
   *
   * class Parent extends Provider {
   *   static middlewares = {
   *     attachGeoCoords() { ... }
   *   };
   * }
   *
   * class Children extends Parent {
   *   static middlewares = {
   *     ...Parent.middlewares,
   *     addSession() {
   *       ...
   *     }
   *   };
   * }
   * ```
   */

  static middlewares = {};
  /**
   * Map of data encoder sequences.
   * The key of a map element represent a name of the provider method: 'get', 'post', etc.
   * The value of a map element represent a sequence of encoders for the specified provider method.
   *
   * @see [[Encoders]]
   * @example
   * ```js
   * class MyProvider extends Provider {
   *   static encoders = {
   *     get: [convertToJSON],
   *     upd: [convertToBuffer]
   *   };
   * }
   * ```
   */

  static encoders = {};
  /**
   * Map of data decoder sequences.
   * The key of a map element represent a name of the provider method: 'get', 'post', etc.
   * The value of a map element represent a sequence of decoders for the specified provider method.
   *
   * @see [[Decoders]]
   * @example
   * ```js
   * class MyProvider extends Provider {
   *   static decoders = {
   *     get: [fromJSON],
   *     upd: [fromBuffer]
   *   };
   * }
   * ```
   */

  static decoders = {};
  /**
   * Map of data mocks.
   * This object can be used with a middleware that implements API for data mocking,
   * for example [[attachMock]] from `'core/data/middlewares'`.
   *
   * The key of a map element represent a method request type: 'GET', 'POST', etc.
   * The value of a map element represent a list of parameters to match.
   *
   * @see [[Middlewares]]
   * @example
   * ```js
   * import { attachMock } from '../../../core/data/middlewares';
   *
   * class MyProvider extends Provider {
   *   static mocks = {
   *     GET: [
   *       // The mock for a GET request with a query parameter that contains
   *       // `search=foo` parameter
   *       {
   *         status: 200,
   *
   *         // For the mock response won't be applied decoders
   *         // (by default, `true`)
   *         decoders: false,
   *
   *         query: {
   *           search: 'foo'
   *         },
   *
   *         // The response
   *         response: {
   *           data: [
   *             'bla',
   *             'baz
   *           ]
   *         }
   *       }
   *     ],
   *
   *     POST: [
   *       // The mock is catches all POST requests and dynamically generated responses
   *       {
   *         response(params, response) {
   *           if (!params.opts.query?.data) {
   *             response.status = 400;
   *             return;
   *           }
   *
   *           response.status = 200;
   *           response.responseType = 'string';
   *           return 'ok';
   *         }
   *       }
   *     ]
   *   };
   *
   *   static middlewares = {attachMock};
   * }
   * ```
   */

  /**
   * Finds an element from an object by the specified parameters
   *
   * @param obj - object to search
   * @param params - search parameters
   *
   * @example
   * ```js
   * class MyProvider extends Provider {}
   * MyProvider.select([{test: 1}], {where: {test: 1}}) // {test: 1}
   * ```
   */
  static select(obj, params) {
    return (0, _select.default)(obj, params);
  }
  /**
   * Global event emitter to broadcast provider events
   */


  globalEmitter = _const.emitter;
  /**
   * Base part of URL for a request of all request methods
   *
   * @example
   * ```js
   * class Profile extends Provider {
   *   baseURL: 'profile/info'
   * }
   * ```
   */

  baseURL = '';
  /**
   * Advanced part of URL for a request of all request methods
   * (it is concatenated with the base part)
   */

  advURL = '';
  /**
   * URL for a socket connection
   */

  /**
   * Default HTTP request method for the "get" method
   */
  getMethod = 'GET';
  /**
   * Default HTTP request method for the "peek" method
   */

  peekMethod = 'HEAD';
  /**
   * Default HTTP request method for the "add" method
   */

  addMethod = 'POST';
  /**
   * Default HTTP request method for the "upd" method
   */

  updMethod = 'PUT';
  /**
   * Default HTTP request method for the "del" method
   */

  delMethod = 'DELETE';
  /**
   * HTTP request method for all request methods.
   * This parameter will override other method parameters, such as "getMethod" or "delMethod".
   */

  /**
   * @deprecated
   * @see [[Provider.globalEmitter]]
   */
  get globalEvent() {
    (0, _functools.deprecate)({
      name: 'globalEvent',
      type: 'accessor',
      renamedTo: 'globalEmitter'
    });
    return this.globalEmitter;
  }
  /**
   * Alias for the request function
   */


  get request() {
    return this.constructor.request;
  }

}

exports.default = Provider;