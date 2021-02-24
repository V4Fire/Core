/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Provider, {

	ProviderConstructor,
	ExtraProviderConstructor,

	providers,
	queryMethods,
	urlProperties as providerUrlProperties

} from 'core/data';

import {

	RequestEngine,
	RequestOptions,
	RequestResponse

} from 'core/request/interface';

import Response from 'core/request/response';
import { ResponseTypeValue } from 'core/request/response/interface';

import Then from 'core/then';
import { concatUrls } from 'core/url';

import type { AvailableOptions, MethodsMapping, Meta } from 'core/request/engines/provider/interface';
import { availableParams } from 'core/request/engines/provider/const';

export * from 'core/request/engines/provider/interface';
export * from 'core/request/engines/provider/const';

/**
 * Creates a request engine from the specified data provider
 *
 * @param src - provider constructor, an instance, or the global name
 * @param [methodsMapping] - how to map original provider methods on engine methods
 * (by default will be used the scheme from the provider options)
 *
 * @example
 * ```js
 * createProviderEngine('MegaSourceOfAllData', {
 *   post: 'put',
 *   put: 'post'
 * })
 * ```
 */
export default function createProviderEngine(
	src: ExtraProviderConstructor,
	methodsMapping?: MethodsMapping
): RequestEngine {
	function dataProviderEngine(params: RequestOptions): Then<Response> {
		const
			p = <AvailableOptions>Object.select(params, availableParams),
			{providerMethod} = p.meta,
			provider = getProviderInstance(src, p.meta);

		const parent = new Then<Response>(async (resolve, reject, onAbort): Then<Response> => {
			await new Promise((r) => {
				globalThis['setImmediate'](r);
			});

			p.parent = <Then>parent;

			const getMethod = (key) => {
				if (methodsMapping && key in methodsMapping) {
					return methodsMapping[key];
				}

				return key;
			};

			let
				req: Then<RequestResponse>;

			if (providerMethod !== undefined) {
				req = getRequestByProviderMethod(provider, getMethod(providerMethod), p);

			} else {
				p.method = getMethod(p.method);
				req = provider.request(params.url.split('?')[0], p);
			}

			onAbort(() => {
				req.abort();
			});

			const
				{data, response: res} = (await req),
				headers = {...res.headers};

			delete headers['content-type'];

			let
				responseBody = data;

			if (Object.isArray(data)) {
				responseBody = [...data];

			} else if (Object.isPlainObject(data)) {
				responseBody = {...data};
			}

			return resolve(new Response(<ResponseTypeValue>responseBody, {
				parent: params.parent,
				important: res.important,
				responseType: 'object',
				okStatuses: res.okStatuses,
				status: res.status,
				headers,
				jsonReviver: params.jsonReviver,
				decoder: params.decoders
			}));
		}, params.parent);

		return parent;
	}

	dataProviderEngine.pendingCache = false;

	return dataProviderEngine;
}

/**
 * Returns an instance of a data provider by the specified global name or constructor
 *
 * @param src - provider constructor, an instance, or the global name
 * @param [meta] - meta params of current provider
 */
function getProviderInstance(src: ExtraProviderConstructor, meta?: Meta): Provider {
	if (Object.isString(src)) {
		if (!(src in providers)) {
			throw new ReferenceError(`A provider "${src}" is not registered`);
		}

		src = <ProviderConstructor>providers[src];
	}

	let
		provider: Provider;

	if (src instanceof Provider) {
		provider = src;

	} else {
		provider = <Provider>new (<ProviderConstructor>src)();
	}

	if (meta !== undefined && 'provider' in meta) {
		const
			metaProvider = <Provider>meta.provider,
			mixedProvider = provider.base('just do it');

		providerUrlProperties.forEach((key) => {
			if (provider[key] == null || provider[key] === '') {
				mixedProvider[key] = metaProvider[key];

			} else {
				mixedProvider[key] = concatUrls(provider[key], metaProvider[key]);
			}
		});

		return mixedProvider;
	}

	return provider;
}

/**
 * Returns a request promise created by using the specified data provider and the passed method
 *
 * @param provider
 * @param providerMethod
 * @param requestParams
 */
function getRequestByProviderMethod(
	provider: Provider,
	providerMethod: string,
	requestParams: AvailableOptions
): Then<RequestResponse> {
	const
		method = providerMethod === 'post' ? 'POST' : provider[`${providerMethod}Method`],
		body = method in queryMethods ? requestParams.query : requestParams.body;

	return provider[providerMethod](body, requestParams);
}
