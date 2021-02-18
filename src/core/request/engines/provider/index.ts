/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import {

	RequestEngine,
	RequestOptions,
	RequestResponse,

	Response,
	ResponseTypeValue

} from 'core/request';
import type iProvider from 'core/data/interface';
import type { ProviderConstructor, ExtraProviderConstructor } from 'core/data/interface/types';
import Provider, { providers, queryMethods } from 'core/data';
import Then from 'core/then';
import { concatUrls } from 'core/url';

import type { AvailableOptions, MethodsMapping } from 'core/request/engines/provider/interface';
import { availableParams } from 'core/request/engines/provider/const';

export * from 'core/request/engines/provider/interface';
export * from 'core/request/engines/provider/const';

/**
 * Returns provider class or object.
 *
 * @param providerOrNamespace - provider class or object, or provider namespace in the global store
 * @param meta - meta params of current provider
 */
function getProvider(providerOrNamespace: ExtraProviderConstructor, meta: Dictionary = {}): iProvider {
	if (Object.isString(providerOrNamespace)) {
		if (!(providerOrNamespace in providers)) {
			throw new ReferenceError(`A provider "${providerOrNamespace}" is not registered`);
		}

		providerOrNamespace = <ProviderConstructor>providers[providerOrNamespace];
	}

	const provider = providerOrNamespace instanceof Provider ?
		providerOrNamespace :
		new (<ProviderConstructor>providerOrNamespace)();

	if ('providerBaseUrls' in meta) {
		const providerBaseUrls = <Dictionary<string>>meta.providerBaseUrls;

		return new Proxy(provider, {
			get(target: typeof provider, prop: string): any {
				// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
				if ({}.hasOwnProperty.call(providerBaseUrls, prop)) {
					return concatUrls(target[prop] ?? '', providerBaseUrls[prop] ?? '');
				}

				return target[prop];
			}
		});
	}

	return provider;
}

/**
 * Returns request promise created by provider method
 *
 * @param provider
 * @param providerMethod
 * @param params
 */
function getRequestByProviderMethod(
	provider: iProvider,
	providerMethod: string,
	params: AvailableOptions
): Then<RequestResponse> {
	let method;

	if (providerMethod === 'post') {
		method = 'POST';
	} else {
		const methodPropertyName = `${providerMethod}Method`;

		method = provider[methodPropertyName];
	}

	const body = method in queryMethods ? params.query : params.body;

	return provider[providerMethod](body, params);
}

/**
 * Returns request promise created by path (default request)
 *
 * @param provider
 * @param params
 */
function getRequestByPath(provider: iProvider, params: AvailableOptions): Then<RequestResponse> {
	// @ts-ignore - Property 'request' does not exist on type 'Provider'.
	return provider.request(params.url.split('?')[0], params);
}

/**
 * Creates engine for request by using data provider as source
 *
 * @param providerOrNamespace - provider class or object, or provider namespace in the global store
 * @param methodsMapping - mapping of current to source data provider methods
 *
 * @example
 * ```js
 * makeProviderEngine('MegaSourceOfAllData', {
 *   post: 'put',
 *   put: 'post'
 * })
 * ```
 */
export default function makeProviderEngine(
	providerOrNamespace: ExtraProviderConstructor,
	methodsMapping?: MethodsMapping
): RequestEngine {
	function dataProviderEngine(params: RequestOptions): Then<Response> {
		const p = <AvailableOptions>Object.select(params, availableParams);
		const provider = getProvider(providerOrNamespace, p.meta);

		const parent = new Then<Response>(async (resolve, reject, onAbort): Then<Response> => {
			await new Promise((r) => {
				globalThis['setImmediate'](r);
			});

			p.parent = <Then>parent;

			let providerMethod = <string | undefined>p.meta.providerMethod;
			let req: Then<RequestResponse>;

			if (providerMethod !== undefined) {
				if (methodsMapping && providerMethod in methodsMapping) {
					providerMethod = methodsMapping[providerMethod];
				}

				req = getRequestByProviderMethod(provider, providerMethod!, p);
			} else {
				req = getRequestByPath(provider, p);
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
