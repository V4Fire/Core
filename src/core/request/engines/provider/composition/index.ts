/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/engines/provider/composition/README.md]]
 * @packageDocumentation
 */

import Provider from 'core/data';
import AbortablePromise from 'core/promise/abortable';
import { RequestOptions, Response, RequestEngine, MiddlewareParams } from 'core/request';
import type { StatusCodes } from 'core/status-codes';

import type { CompositionProvider } from 'core/request/engines/provider/composition/interface';

export * from 'core/request/engines/provider/composition/interface';

export function providerCompositionEngine(providers: CompositionProvider[]): RequestEngine {
	const
		boundedProviders = new Set<Provider>();

	return (options: RequestOptions, params: MiddlewareParams) => new AbortablePromise((resolve, reject) => {
			const
				results = {},
				promises = <Array<Promise<unknown>>>[];

			const
				self = params.opts.meta.provider,
				selfOptions = self instanceof Provider ? self.params : undefined;

			if (self instanceof Provider) {
				wrapSelf(self);
			}

			for (const provider of providers) {
				const
					requestFilter = provider.requestFilter?.(options, params, self?.params);

				if (requestFilter === false) {
					continue;

				} else if (Object.isPromise(requestFilter)) {
					const promise = requestFilter.then((value) => {
						if (value === false) {
							return;
						}

						return createRequest(provider);
					});

					promises.push(promise);

				} else {
					promises.push(createRequest(provider));
				}
			}

			Promise.all(promises)
				.then(() => {
					const response = new Response(results, {
						parent: options.parent,
						important: options.important,
						responseType: 'json',
						okStatuses: options.okStatuses,
						status: Object.cast<StatusCodes>(200),
						decoder: options.decoders
					});

					resolve(response);

				}, reject);

			function boundProvider(provider: Provider): Provider {
				boundedProviders.add(provider);
				return provider;
			}

			function wrapSelf(provider: Provider): Provider {
				const
					originalDestroy = provider.destroy.bind(provider),
					originalDropCache = provider.dropCache.bind(provider);

				provider.destroy = (...args) => {
					boundedProviders.forEach((provider) => provider.destroy(...args));
					boundedProviders.clear();
					originalDestroy(...args);
				};

				provider.dropCache = (...args) => {
					boundedProviders.forEach((provider) => provider.dropCache(...args));
					originalDropCache(...args);
				};

				return provider;
			}

			function createRequest(composedProvider: CompositionProvider): Promise<void> {
				const promise = composedProvider.request(
					options,
					params,
					{
						providerWrapper: boundProvider,
						providerOptions: selfOptions
					}
				)
					.then(async (result) => {
						const
							data = await result.data;

						results[composedProvider.as] = data;
					})

					.catch((err) => {
						if (composedProvider.failCompositionOnError) {
							throw err;
						}
					});

				return promise;
			}
	});
}
