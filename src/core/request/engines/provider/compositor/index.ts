import AbortablePromise from 'core/promise/abortable';
import { RequestOptions, Response, RequestEngine, MiddlewareParams } from 'core/request';
import type { StatusCodes } from 'core/status-codes';

import type { CompositionProvider } from 'core/request/engines/provider/compositor/interface';

export function providerCompositionEngine(providers: CompositionProvider[]): RequestEngine {
	return (options: RequestOptions, params: MiddlewareParams) => new AbortablePromise((resolve, reject) => {
			const
				results = {},
				promises = <Array<Promise<unknown>>>[];

			for (const provider of providers) {
				const
					requestFilter = provider.requestFilter?.(options, params);

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

			function createRequest(provider: CompositionProvider): Promise<void> {
				const promise = provider.request(options, params)
					.then(async (result) => {
						const
							data = await result.data;

						results[provider.as] = data;
					})

					.catch((err) => {
						if (provider.failCompositionOnError) {
							throw err;
						}
					});

				return promise;
			}
	});
}
