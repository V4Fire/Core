/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Provider from 'core/data';
import type { ProviderOptions } from 'core/data';
import type { RequestOptions, RequestResponseObject, MiddlewareParams, RequestPromise, RequestEngine } from 'core/request';
import type { RawHeaders } from 'core/request/headers';
import type { StatusCodes } from 'core/status-codes';

export interface CompositionEngineOpts {
	/**
	 * If true, the engine will change its behavior and will now wait for the completion
	 * of all requests, regardless of whether they completed with an error or not.
	 *
	 * In case the requests that have the failCompositionOnError flag set completed
	 * with an error, all these errors will be aggregated into {@link AggregateError} and given
	 * to the user.
	 *
	 * @default false
	 */
	aggregateErrors?: boolean;
}

export interface CompositionRequest {
	/**
	 * A function that will be called when the get method or other provider methods are called,
	 * takes several arguments: request options, request parameters, provider constructor parameters,
	 * and a wrapper function for your providers.
	 *
	 * ```typescript
	 * export class MyCompositionProvider extends Provider {
	 *   static override request: typeof Provider.request = Provider.request({
	 *     engine: compositionEngine([
	 *       {
	 *         request: () => new Provider1().get()
	 *         as: 'banners'
	 *       },
	 *       {
	 *         request: () => new Provider2().get()
	 *         as: 'content'
	 *       }
	 *     ])
	 *   });
	 * }
	 * ```
	 *
	 * The request function also passes an argument, which is an object containing various data
	 * such as request parameters, some helper functions, and more.
	 *
	 * Let's implement an example where different query parameters are used for requests in the request function:
	 *
	 * ```typescript
	 * class MyCompositionProvider extends Provider {
	 *   static override request: Provider['request'] = Provider.request({
	 *     engine: compositionEngine([
	 *       {
	 *         request: ({params}) => new Provider1().get(Object.get(params, 'opts.query.provider1')),
	 *         as: 'request1'
	 *       },
	 *       {
	 *         request: ({params}) => new Provider2().get(Object.get(params, 'opts.query.provider2')),
	 *         as: 'request2'
	 *       }
	 *     ])
	 *   });
	 * }
	 * ```
	 *
	 * Additionally, the request function provides a special function called boundRequest,
	 * which is needed to bind the request object to the provider engine. The request object returned
	 * from the request function is automatically wrapped in this function. However, if you make
	 * multiple requests within the request function, it is important to use boundRequest to avoid memory leaks:
	 *
	 * ```typescript
	 * class CompositionProviderDropCache extends Provider {
	 *   static override request: Provider['request'] = Provider.request({
	 *     engine: compositionEngine([
	 *       {
	 *         request: async ({boundRequest}) => {
	 *           const data = await boundRequest(new Provider1().get()).data;
	 *
	 *           if (data.something) {
	 *             return new Provider3().get().data;
	 *           }
	 *
	 *           return data;
	 *         },
	 *         as: 'request1'
	 *       },
	 *       {
	 *         request: () => new Provider2().get(),
	 *         as: 'request2'
	 *       }
	 *     ])
	 *   });
	 * }
	 * ```
	 *
	 * @param options
	 */
	request(options: CompositionRequestOptions): Promise<RequestResponseObject | unknown>;

	/**
	 * Specifies the fields of the resulting object where the response of this request will be stored.
	 *
	 * If `spread` is specified, the result will be added to the resulting object not as a separate
	 * property, but using Object.assign. This means all properties from the request result will be
	 * set on the resulting object.
	 */
	as: 'spread' | string;

	/**
	 * Function that will be called before the request is initiated.
	 *
	 * If the function returns false, the request will not be created.
	 *
	 * If the function returns a promise, it will wait for the resolution of this promise,
	 * and if it resolves to false, the request will not be created.
	 *
	 * @param options
	 * @param params
	 */
	requestFilter?(options: CompositionRequestOptions): CanPromise<boolean>;

	/**
	 * If true, when there is an error in this request, the provider request will be terminated.
	 * If false / undefined, request errors will be ignored.
	 */
	failCompositionOnError?: boolean;

	/**
	 * If true, status code and reponse headers will be propagated from this request to the whole
	 * composition. Note that if there are more than one request with this option set to true,
	 * only last request's data will be propagated.
	 */
	propagateStatusAndHeaders?: boolean;
}

export interface CompositionRequestOptions {
	/**
	 * A wrapper function for requests/providers used inside the {@link CompositionRequest.request} function.
	 * It should wrap each provider you use inside the {@link CompositionRequest.request} function.
	 */
	boundRequest<T extends Provider | RequestPromise | RequestResponseObject>(request: T): T;

	/**
	 * Options passed with the provider constructor.
	 */
	providerOptions?: ProviderOptions;

	/** {@link RequestOptions} */
	options: RequestOptions;

	/** {@link MiddlewareParams} */
	params: MiddlewareParams;

	/** {@link CompositionEngineOpts} */
	engineOptions?: CompositionEngineOpts;

	/** {@link CompositionRequest} */
	compositionRequests: CompositionRequest[];
}

export interface DestroyableObject {
	dropCache?(recursive?: boolean): void;
	destroy?(): void;
}

export interface CompositionRequestEngine extends RequestEngine {
	dropCache: NonNullable<RequestEngine['dropCache']>;
	destroy: NonNullable<RequestEngine['destroy']>;
}

export interface GatheredRequestsData {
	data: Dictionary;
	headers: RawHeaders;
	status: StatusCodes;
}
