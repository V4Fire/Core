/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Provider from 'core/data';
import type { ProviderOptions } from 'core/data';
import type { RequestOptions, RequestResponseObject, MiddlewareParams } from 'core/request';

/**
 * A wrapper function for providers used inside the {@link CompositionProvider.request} function.
 * It should wrap each provider you use inside the {@link CompositionProvider.request} function.
 */
export interface ProviderWrapper {
	(provider: Provider): Provider;
}

export interface CompositionProviderParams {
	/** {@link ProviderWrapper} */
	providerWrapper: ProviderWrapper;

	/**
	 * Options passed with the provider constructor.
	 */
	providerOptions?: ProviderOptions;
}

export interface CompositionProvider {
	/**
	 * A function that will be called when the get method or other provider methods are called,
	 * takes several arguments: request options, request parameters, provider constructor parameters,
	 * and a wrapper function for your providers.
	 *
	 * Let's dive deeper into the wrapper function and why it is needed.
	 * Each provider that you use in the request function should be wrapped with this wrapper.
	 * Thanks to this wrapper, when the destroy/dropCache methods are called on MyCompositionProvider,
	 * these same methods will be called on all providers that were wrapped.
	 * Otherwise, a memory leak may occur.
	 *
	 * @param requestOptions
	 * @param requestParams
	 * @param params
	 *
	 * @example
	 *
	 * ```typescript
	 * export class MyCompositionProvider extends Provider {
	 *  static override request: typeof Provider.request = Provider.request({
	 *    engine: providerCompositionEngine([
	 *      {
	 *        request: (_, params, {providerWrapper}) =>
	 *          providerWrapper(new Banners()).get(Object.get(params, 'opts.query.bannersQuery')),
	 *        as: 'banners'
	 *      },
	 *      {
	 *        request: (_, params, {providerWrapper}) =>
	 *          providerWrapper(new Cards()).get(Object.get(params, 'opts.query.cardsQuery')),
	 *        as: 'content'
	 *      }
	 *    ])
	 *  });
	 * }
	 * ```
	 */
	request(
		requestOptions: RequestOptions,
		requestParams: MiddlewareParams,
		params: CompositionProviderParams
	): Promise<RequestResponseObject>;

	/**
	 * In which fields of the resulting object the response of this request will be stored.
	 */
	as: string;

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
	 * @param [providerOptions]
	 */
	requestFilter?(
		options: RequestOptions,
		params: MiddlewareParams,
		providerOptions?: ProviderOptions
	): CanPromise<boolean>;

	/**
	 * If true, when there is an error in this request, the provider request will be terminated.
	 * If false / undefined, request errors will be ignored.
	 */
	failCompositionOnError?: boolean;
}
