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
import { RequestOptions, Response, MiddlewareParams, RequestResponseObject, RequestPromise } from 'core/request';
import type { StatusCodes } from 'core/status-codes';

import type { CompositionEngineOpts, CompositionRequestEngine, CompositionRequests } from 'core/request/engines/composition/interface';

export * from 'core/request/engines/composition/interface';

/**
 * Creates an engine that allows you to create a composition of requests
 *
 * @param requests
 * @param opts
 */
export function compositionEngine(
	requests: CompositionRequests[],
	opts?: CompositionEngineOpts
): CompositionRequestEngine {
	const
		boundedProviders = new Set<Provider>(),
		boundedRequests = new Map<string, RequestResponseObject>();

	const engine: CompositionRequestEngine = (options: RequestOptions, params: MiddlewareParams) =>
		new AbortablePromise((resolve, reject) => {
			const
				result = {},
				promises = <Array<Promise<unknown>>>[];

			for (const provider of requests) {
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

			const resultPromise = (() => {
				if (opts?.aggregateErrors) {
					return Promise.allSettled(promises)
						.then((results) => {
							const errors = <object[]>[];

							results.forEach((res, index) => {
								const
									{failCompositionOnError} = requests[index];

								if (res.status === 'rejected' && failCompositionOnError) {
									errors.push(res.reason);
								}
							});

							if (errors.length > 0) {
								throw new AggregateError(errors);
							}
						});
				}

				return Promise.all(promises);
			})();

			resultPromise.then(() => {
				const response = new Response(result, {
					parent: options.parent,
					important: options.important,
					responseType: 'json',
					okStatuses: options.okStatuses,
					status: Object.cast<StatusCodes>(200),
					decoder: options.decoders
				});

				resolve(response);
			}, reject);

			const
				context = params.opts.meta.provider ?? params.ctx,
				providerParams = context instanceof Provider ? context.params : undefined;

			function boundRequest<T extends Provider | RequestResponseObject | RequestPromise>(request: T): T {
				if (request instanceof Provider) {
					boundedProviders.add(request);

					const forkedDestroy = request.destroy.bind(request);

					request.destroy = (...args) => {
						boundedProviders.delete(request);
						forkedDestroy(...args);
					};

					return request;
				}

				const wrapRequestResponseObject = (r: RequestResponseObject) => {
					const
						{cacheKey} = r.ctx;

					if (cacheKey != null && !r.destroyed) {
						boundedRequests.set(cacheKey, r);

						const forkedDestroy = r.destroy;

						r.destroy = (...args) => {
							boundedRequests.delete(cacheKey);
							forkedDestroy(...args);
						};
					}

					return r;
				};

				if (Object.isPromise(request)) {
					return <T>request.then((requestResponseObj) => wrapRequestResponseObject(requestResponseObj));
				}

				return <T>wrapRequestResponseObject(request);
			}

			function createRequest(composedProvider: CompositionRequests): Promise<void> {
				const promise = composedProvider.request(
					options,
					params,
					{
						boundRequest,
						providerOptions: providerParams
					}
				)
					.then(async (requestResponseObject) => {
						const
							data = await requestResponseObject.data;

						result[composedProvider.as] = data;
					})

					.catch((err) => {
						if (composedProvider.failCompositionOnError) {
							throw err;
						}
					});

				return promise;
			}
	});

	engine.dropCache = (recursive) => {
		boundedRequests.forEach((request) => request.dropCache(recursive));
		boundedProviders.forEach((request) => request.dropCache(recursive));
	};

	engine.destroy = () => {
		boundedRequests.forEach((request) => request.destroy());
		boundedProviders.forEach((request) => request.destroy());

		boundedRequests.clear();
		boundedProviders.clear();
	};

	engine.boundedRequests = boundedRequests;
	engine.boundedProviders = boundedProviders;

	return engine;
}
