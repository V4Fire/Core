/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/engines/composition/README.md]]
 * @packageDocumentation
 */

import Async from 'core/async';
import type { Provider } from 'core/data';
import { StatusCodes } from 'core/status-codes';
import AbortablePromise from 'core/promise/abortable';
import { SyncPromise } from 'core/prelude/structures';
import { RequestOptions, Response, MiddlewareParams, RequestResponseObject } from 'core/request';

import type {

	DestroyableObject,
	CompositionEngineOpts,
	CompositionRequestEngine,
	CompositionRequest,
	CompositionRequestOptions

} from 'core/request/engines/composition/interface';

import { compositionEngineSpreadResult } from 'core/request/engines/composition/const';

export * from 'core/request/engines/composition/const';
export * from 'core/request/engines/composition/interface';

/**
 * Creates a new composition engine to process composition requests.
 *
 * @param compositionRequests - An array of composition requests.
 * @param [engineOptions] - Optional settings for the composition engine.
 */
export function compositionEngine(
	compositionRequests: CompositionRequest[],
	engineOptions?: CompositionEngineOpts
): CompositionRequestEngine {
	const
		async: Async = new Async();

	const engine: CompositionRequestEngine = (requestOptions: RequestOptions, params: MiddlewareParams) => {
		const options = {
			boundRequest: boundRequest.bind(null, async),
			options: requestOptions,
			params,
			providerOptions: requestOptions.meta?.provider?.params,
			engineOptions,
			compositionRequests
		};

		return new AbortablePromise((resolve, reject) => {
			// Sets up a handler to call dropCache/destroy on the provider
			// that uses this CompositionRequestEngine.
			// This is necessary to invoke the corresponding methods on the engine.
			const {provider} = params.opts.meta;

			if (provider) {
				async.on(provider.emitter, 'dropCache', (recursive?: boolean) => {
					engine.dropCache(recursive);
				}, {label: 'dropCacheListener'});
			}

			const promises = compositionRequests.map((r) => SyncPromise.resolve(r.requestFilter?.(options))
				.then((filterValue) => {
					if (filterValue === false) {
						return;
					}

					return r.request(options)
						.then(boundRequest.bind(null, async))
						.then((request) => isRequestResponseObject(request) ? request.data : request)
						.catch((err) => {
							if (r.failCompositionOnError) {
								throw err;
							}
						});
				}));

			gatherDataFromRequests(promises, options).then((data) => {
				resolve(new Response(data, {
					parent: requestOptions.parent,
					important: requestOptions.important,
					responseType: 'object',
					okStatuses: requestOptions.okStatuses,
					status: StatusCodes.OK,
					decoder: requestOptions.decoders
				}));
			}).catch(reject);
		});
	};

	engine.dropCache = () => async.clearAll({group: 'cache'});

	return engine;
}

/**
 * Binds a request object with engine for cache dropping and destroy.
 *
 * @param async - Async instance for handling asynchronous operations.
 * @param requestObject - The request object to bind.
 */
function boundRequest<T extends unknown>(
	async: Async,
	requestObject: T
): T {
	if (isDestroyableObject(requestObject)) {
		// If the request is made using a provider method,
		// calling destroy/dropCache on the RequestResponseObject
		// is not identical to calling dropCache/destroy on the provider that
		// created this RequestResponseObject.
		// Therefore, we extract the provider from the object and
		// call the methods as necessary.
		const provider = tryGetProvider(requestObject);

		if (requestObject.dropCache != null) {
			async.worker(() => {
				provider?.dropCache();
				requestObject.dropCache?.(true);

			}, {group: 'cache'});
		}
	}

	return requestObject;
}

/**
 * Gathers data from multiple requests and returns accumulated results.
 *
 * @param promises - An array of promises representing individual requests.
 * @param options - Options related to composition requests.
 */
async function gatherDataFromRequests(
	promises: Array<Promise<unknown>>,
	options: CompositionRequestOptions
): Promise<Dictionary> {
	const accumulator = {};

	if (options.engineOptions?.aggregateErrors) {
		await Promise.allSettled(promises)
			.then((results) => {
				const
					errors = <object[]>[];

				results.forEach((res, index) => {
					const
						{failCompositionOnError} = options.compositionRequests[index];

					if (res.status === 'rejected' && failCompositionOnError) {
						errors.push(res.reason);
					}

					if (res.status === 'fulfilled') {
						accumulateData(accumulator, res.value, options.compositionRequests[index]);
					}
				});

				if (errors.length > 0) {
					throw new AggregateError(errors);
				}
			});

	} else {
		const results = await Promise.all(promises);
		results.forEach((value, index) => accumulateData(accumulator, value, options.compositionRequests[index]));
	}

	return accumulator;
}

/**
 * Accumulates data into an accumulator object based on the composition request.
 *
 * @param accumulator
 * @param data
 * @param compositionRequest
 */
function accumulateData(
	accumulator: Dictionary,
	data: unknown,
	compositionRequest: CompositionRequest
): Dictionary {
	const
		{as} = compositionRequest;

	if (as === compositionEngineSpreadResult) {
		Object.assign(accumulator, data);

	} else {
		Object.set(accumulator, as, data);
	}

	return accumulator;
}

/**
 * Checks if the provided argument is of type BoundedCompositionEngineRequest.
 *
 * This function will return true if the argument is an object and has either a 'dropCache' or 'destroy' property.
 *
 * @param something - The value to be checked.
 * @returns True if the argument is a BoundedCompositionEngineRequest, otherwise false.
 */

function isDestroyableObject(something: unknown): something is DestroyableObject {
	return Object.isPlainObject(something) &&
		(
			'dropCache' in something ||
			'destroy' in something
		);
}

/**
 * Checks if the provided argument is of type `RequestResponseObject`.
 *
 * This function returns true if the argument is like a request object and also contains `data`
 * and `response` properties.
 *
 * @param something
 */
function isRequestResponseObject(something: unknown): something is RequestResponseObject {
	return isDestroyableObject(something) && 'data' in something && 'response' in something;
}

/**
 * Attempts to retrieve a Provider object from an input object.
 *
 * This function will return the 'provider' property if it exists under 'ctx.params.meta' of the provided object.
 * If the input is not an object or the 'provider' property is not found, it returns undefined.
 *
 * @param from - The input object from which the provider should be retrieved.
 * @returns The Provider object if found, otherwise undefined.
 */
function tryGetProvider(from: unknown): CanUndef<Provider> {
	return (Object.isPlainObject(from) && Object.get<Provider>(from, 'ctx.params.meta.provider')) || undefined;
}
