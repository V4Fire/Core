/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { EventEmitter2 as EventEmitter } from 'eventemitter2';
import request, { Middlewares, RequestMethod } from '../../../core/request';
import { SelectParams } from '../../../core/object/select';
import type { ModelMethod, FunctionalExtraProviders, EncodersMap, DecodersMap, Mocks } from '../../../core/data/interface';
export default abstract class Provider {
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
    static readonly request: typeof request;
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
    static readonly middlewares: Middlewares;
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
    static readonly encoders: EncodersMap;
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
    static readonly decoders: DecodersMap;
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
    static mocks?: Mocks;
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
    static select<T = unknown>(obj: unknown, params: SelectParams): CanUndef<T>;
    /**
     * Global event emitter to broadcast provider events
     */
    readonly globalEmitter: EventEmitter;
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
    baseURL: string;
    /**
     * Advanced part of URL for a request of all request methods
     * (it is concatenated with the base part)
     */
    advURL: string;
    /**
     * URL for a socket connection
     */
    socketURL?: string;
    /**
     * Base part of URL for a request for the "get" method
     *
     * @example
     * ```js
     * class Profile extends Provider {
     *   // For all request methods despite the "get" is used this URL
     *   baseURL: 'profile/info'
     *   baseGetURL: 'profile/info/get'
     * }
     * ```
     */
    baseGetURL?: string;
    /**
     * Base part of URL for a request for the "peek" method
     *
     * @example
     * ```js
     * class Profile extends Provider {
     *   // For all request methods despite the "peek" is used this URL
     *   baseURL: 'profile/info'
     *   basePeekURL: 'profile/info/peek'
     * }
     * ```
     */
    basePeekURL?: string;
    /**
     * Base part of URL for a request for the "add" method
     *
     * @example
     * ```js
     * class Profile extends Provider {
     *   // baseURL request methods despite the "add" is used this URL
     *   basePeekURL: 'profile/info'
     *   baseAddURL: 'profile/info/add'
     * }
     * ```
     */
    baseAddURL?: string;
    /**
     * Base part of URL for a request for the "upd" method
     *
     * @example
     * ```js
     * class Profile extends Provider {
     *   // baseURL request methods despite the "upd" is used this URL
     *   basePeekURL: 'profile/info'
     *   baseUpdateURL: 'profile/info/upd'
     * }
     * ```
     */
    baseUpdateURL?: string;
    /**
     * Base part of URL for a request for the "del" method
     *
     * @example
     * ```js
     * class Profile extends Provider {
     *   // baseURL request methods despite the "del" is used this URL
     *   basePeekURL: 'profile/info'
     *   baseDeleteURL: 'profile/info/del'
     * }
     * ```
     */
    baseDeleteURL?: string;
    /**
     * List of additional data providers for the "get" method.
     * It can be useful if you have some providers that you want combine to one.
     *
     * @example
     * ```js
     * class User extends Provider {
     *   baseURL: 'user/info',
     *
     *   extraProviders: {
     *     balance: {
     *       provider: 'UserBalance'
     *     },
     *
     *     hobby: {
     *       provider: 'UserHobby'
     *     },
     *   }
     * }
     * ```
     */
    extraProviders?: FunctionalExtraProviders;
    /**
     * Default HTTP request method for the "get" method
     */
    getMethod: RequestMethod;
    /**
     * Default HTTP request method for the "peek" method
     */
    peekMethod: RequestMethod;
    /**
     * Default HTTP request method for the "add" method
     */
    addMethod: RequestMethod;
    /**
     * Default HTTP request method for the "upd" method
     */
    updateMethod: RequestMethod;
    /**
     * Default HTTP request method for the "del" method
     */
    deleteMethod: RequestMethod;
    /**
     * HTTP request method for all request methods.
     * This parameter will override other method parameters, such as "getMethod" or "deleteMethod".
     */
    customMethod: CanUndef<RequestMethod>;
    /**
     * Event name for requests.
     * Please notice that all request methods except "get", "peek" and "request" emit events by default.
     */
    eventName: CanUndef<ModelMethod>;
    /**
     * @deprecated
     * @see [[Provider.mocks]]
     */
    mocks?: Mocks;
    /**
     * @deprecated
     * @see [[Provider.globalEmitter]]
     */
    get globalEvent(): EventEmitter;
    /**
     * Alias for the request function
     */
    get request(): typeof request;
}
