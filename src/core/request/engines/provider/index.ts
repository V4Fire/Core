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

import AbortablePromise from 'core/promise/abortable';
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

	function dataProviderEngine(params: RequestOptions): AbortablePromise<Response> {
		const
			p = Object.cast<AvailableOptions>(Object.select(params, availableParams)),
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

		const requestPromise = new AbortablePromise<Response>(async (resolve, reject, onAbort) => {
			await new Promise((r) => {
				setImmediate(r);
			});

			p.parent = <AbortablePromise>requestPromise;

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
				body = queryMethods[requestMethod] != null ? p.query : p.body,
				urlProp = `base-${providerMethod}-URL`.camelize(false);

			if (!Object.isTruly(provider[urlProp])) {
				urlProp = providerUrlProperties[0];
			}

			const providerToRequest = isSimpleRequest ?
				createMixedProvider(provider, {
					[urlProp]: p.url.replace(globalOpts.api ?? '', '')
				}) :

				provider;

			if (Object.isDictionary(body)) {
				body = Object.mixin({withNonEnumerables: true}, {}, body);
			}

			const
				req = providerToRequest[<string>providerMethod](body, p);

			onAbort((reason) => {
				req.abort(reason);
			});

			const
				registeredEvents = Object.createDict<boolean>();

			params.emitter.on('newListener', (event: string) => {
				if (registeredEvents[event]) {
					return;
				}

				registeredEvents[event] = true;
				req.emitter.on(event, (e) => params.emitter.emit(event, e));
			});

			params.emitter.emit('drainListeners');

			let providerResObj;

			try {
				providerResObj = await req;

			} catch (err) {
				reject(err);
				return;
			}

			const
				providerResponse = providerResObj.response,
				getResponse = () => providerResObj.data;

			getResponse[Symbol.asyncIterator] = () => {
				const
					type = providerResponse.sourceResponseType;

				if (!(`${type}Stream` in providerResponse)) {
					return providerResponse[Symbol.asyncIterator]();
				}

				const
					stream = providerResponse.decodeStream();

				return {
					[Symbol.asyncIterator]() {
						return this;
					},

					async next() {
						const
							{done, value} = <IteratorResult<unknown>>(await stream.next());

						return {
							done,
							value: {data: value}
						};
					}
				};
			};

			return resolve(new Response(getResponse, {
				url: providerResponse.url,
				redirected: providerResponse.redirected,

				parent: params.parent,
				important: providerResponse.important,

				okStatuses: providerResponse.okStatuses,
				noContentStatuses: providerResponse.noContentStatuses,
				status: providerResponse.status,
				statusText: providerResponse.statusText,

				headers: providerResponse.headers,
				responseType: 'object',
				forceResponseType: true,

				decoder: params.decoders,
				streamDecoder: params.streamDecoders,
				jsonReviver: params.jsonReviver
			}));

		}, params.parent);

		return requestPromise;
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
		return createMixedProvider(provider, Object.cast(meta.provider));
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
