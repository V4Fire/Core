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
	urlProperties as providerUrlProperties,
	methodProperties as providerMethodProperties,
	globalOpts

} from 'core/data';

import { RequestEngine, RequestOptions } from 'core/request/interface';

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
	methodsMapping: MethodsMapping = {}
): RequestEngine {
	function dataProviderEngine(params: RequestOptions): Then<Response> {
		const
			p = <AvailableOptions>Object.select(params, availableParams),
			provider = getProviderInstance(src, p.meta),
			defaultRequestMethods = <MethodsMapping>providerMethodProperties.reduceRight((carry, key) => {
				if (key in provider && provider[key] !== '' && provider[key] != null) {
					carry[provider[key]] = key.replace('Method', '');
				}

				return carry;
			}, {});

		methodsMapping = {
			...defaultRequestMethods,
			...methodsMapping
		};

		const parent = new Then<Response>(async (resolve, reject, onAbort): Then<Response> => {
			await new Promise((r) => {
				globalThis['setImmediate'](r);
			});

			p.parent = <Then>parent;

			let
				{providerMethod} = p.meta;

			const
				isSimpleRequest = providerMethod === undefined,
				getMethod = (key) => key in methodsMapping ? methodsMapping[key] : key;

			providerMethod = getMethod(providerMethod === undefined ? p.method : providerMethod);

			if (!(providerMethod !== undefined && providerMethod in provider)) {
				throw new ReferenceError('A provider method not found');
			}

			const
				method = providerMethod === 'post' ? 'POST' : provider[`${providerMethod}Method`],
				body = method in queryMethods ? p.query : p.body;

			let
				urlProperty = `base-${providerMethod}-URL`.camelize(false);

			if (!(urlProperty in provider && provider[urlProperty] !== '' && provider[urlProperty] != null)) {
				urlProperty = providerUrlProperties[0];
			}

			const pr = isSimpleRequest ?
				createMixedProvider(provider, {
					[urlProperty]: p.url.replace(globalOpts.api ?? '', '').split('?')[0]
				}) :
				provider;

			const
				req = pr[<string>providerMethod](body, p);

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
		return createMixedProvider(provider, <Provider>meta.provider);
	}

	return provider;
}

/**
 * Creates mixed provider that has concatenated base URLs
 *
 * @param base - base provider
 * @param [additional] - provider or dictionary with additional base urls
 */
function createMixedProvider(base: Provider, additional: Provider | Dictionary<string> = {}): Provider {
	const
		// Method base needs not empty string in that case
		mixedProvider = base.base('just do it');

	providerUrlProperties.forEach((key) => {
		if (base[key] === undefined && additional[key] === undefined) {
			mixedProvider[key] = undefined;
		} else {
			mixedProvider[key] = concatUrls(base[key], additional[key]);
		}
	});

	return mixedProvider;
}
