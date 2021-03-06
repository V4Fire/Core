/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/engines/provider/README.md]]
 * @packageDocumentation
 */

import Then from 'core/then';
import { concatURLs } from 'core/url';

import Provider, {

	providers,
	globalOpts,

	queryMethods,
	urlProperties as providerUrlProperties,
	methodProperties as providerMethodProperties,

	ProviderConstructor,
	ExtraProviderConstructor

} from 'core/data';

import Response from 'core/request/response';
import type { RequestEngine, RequestOptions } from 'core/request/interface';

import { availableParams } from 'core/request/engines/provider/const';
import type { AvailableOptions, MethodsMapping, Meta } from 'core/request/engines/provider/interface';

export * from 'core/request/engines/provider/const';
export * from 'core/request/engines/provider/interface';

/**
 * Creates a request engine from the specified data provider
 *
 * @param src - provider constructor, an instance, or the global name
 * @param [methodsMapping] - how to map original provider methods on engine methods
 *   (by default will be used the scheme from the provider options)
 *
 * @example
 * ```js
 * createProviderEngine('MegaSourceOfAllData', {
 *   // Map an HTTP method on the provider method
 *   PUT: 'put',
 *
 *   // Map a method of the "outer" data provider on the source provider method
 *   put: 'post'
 * })
 * ```
 */
export default function createProviderEngine(
	src: ExtraProviderConstructor,
	methodsMapping: MethodsMapping = {}
): RequestEngine {
	dataProviderEngine.pendingCache = false;
	return dataProviderEngine;

	function dataProviderEngine(params: RequestOptions): Then<Response> {
		const
			p = <AvailableOptions>Object.select(params, availableParams),
			provider = getProviderInstance(src, p.meta);

		const defaultRequestMethods = providerMethodProperties.reduceRight((carry, key) => {
			const
				method = provider[key];

			if (Object.isTruly(method)) {
				carry[method] = key.replace('Method', '');
			}

			return carry;
		}, {});

		methodsMapping = {
			...defaultRequestMethods,
			...methodsMapping
		};

		const parent = new Then<Response>(async (resolve, reject, onAbort): Then<Response> => {
			await new Promise((r) => {
				setImmediate(r);
			});

			p.parent = <Then>parent;

			let
				{providerMethod} = p.meta;

			const
				isSimpleRequest = providerMethod === undefined,
				getProviderMethod = (key) => key in methodsMapping ? methodsMapping[key] : key;

			providerMethod = getProviderMethod(
				isSimpleRequest ? p.method : providerMethod
			);

			if (providerMethod == null || !Object.isFunction(provider[providerMethod])) {
				throw new ReferenceError('A provider method is not found at the data provider instance');
			}

			const
				requestMethod = provider[`${providerMethod}Method`] ?? 'post';

			let
				body = queryMethods[requestMethod] === true ? p.query : p.body;

			let
				urlProperty = `base-${providerMethod}-URL`.camelize(false);

			if (!Object.isTruly(provider[urlProperty])) {
				urlProperty = providerUrlProperties[0];
			}

			const providerToRequest = isSimpleRequest ?
				createMixedProvider(provider, {
					[urlProperty]: p.url.replace(globalOpts.api ?? '', '')
				}) :

				provider;

			if (Object.isDictionary(body)) {
				body = Object.mixin({withNonEnumerables: true}, {}, body);
			}

			const
				req = providerToRequest[<string>providerMethod](body, p);

			onAbort(() => {
				req.abort();
			});

			const
				{data, response: res} = await req;

			const
				headers = Object.reject(res.headers, 'content-type');

			return resolve(new Response(data, {
				responseType: 'object',
				important: res.important,
				parent: params.parent,

				okStatuses: res.okStatuses,
				status: res.status,

				headers,
				decoder: params.decoders,
				jsonReviver: params.jsonReviver
			}));

		}, params.parent);

		return parent;
	}
}

/**
 * Returns a data provider instance by the specified global name or constructor
 *
 * @param src - provider constructor, an instance, or the global name
 * @param [meta] - meta parameters of the provider
 */
function getProviderInstance(src: ExtraProviderConstructor, meta?: Meta): Provider {
	if (Object.isString(src)) {
		const
			provider = providers[src];

		if (provider == null) {
			throw new ReferenceError(`A provider "${src}" is not registered`);
		}

		src = provider;
	}

	let
		provider: Provider;

	if (src instanceof Provider) {
		provider = src;

	} else {
		provider = <Provider>new (<ProviderConstructor>src)();
	}

	if (meta?.provider != null) {
		return createMixedProvider(provider, <any>meta.provider);
	}

	return provider;
}

/**
 * Takes a data provider as the base and another one as a modifier and returns a new data provider.
 * The new provider has URL-s produced by using a concatenation of the base and modifier provider URL-s.
 *
 * @param base - base provider
 * @param [modifier] - provider or a simple dictionary with URL-s that look like a provider
 */
function createMixedProvider(base: Provider, modifier: Provider | Dictionary<string> = {}): Provider {
	const
		mixedProvider = Object.create(base);

	providerUrlProperties.forEach((key) => {
		if (base[key] == null && modifier[key] == null) {
			mixedProvider[key] = undefined;

		} else {
			mixedProvider[key] = concatURLs(base[key], modifier[key]);
		}
	});

	return mixedProvider;
}
