/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/README.md]]
 * @packageDocumentation
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import log from 'core/log';

import SyncPromise from 'core/promise/sync';
import AbortablePromise from 'core/promise/abortable';

import { isOnline } from 'core/net';
import { createControllablePromise } from 'core/promise';

import Response from 'core/request/response';
import RequestError from 'core/request/error';

import { merge } from 'core/request/helpers';
import { defaultRequestOpts, globalOpts } from 'core/request/const';

import RequestContext from 'core/request/modules/context';

import type {

	Middleware,
	CreateRequestOptions,
	RetryOptions,

	RequestPromise,
	RequestResolver,

	RequestFunctionResponse,
	RequestResponseObject

} from 'core/request/interface';

export * from 'core/request/helpers';
export * from 'core/request/interface';
export * from 'core/request/response/helpers';
export * from 'core/request/response/interface';

export { globalOpts, cache, pendingCache } from 'core/request/const';
export { default as RequestError } from 'core/request/error';
export { default as Response } from 'core/request/response';

export default request;

/**
 * Creates a new remote request with the specified options
 *
 * @param path - request path URL
 * @param opts - request options
 *
 * @example
 * ```js
 * request('bla/get').then(({data, response}) => {
 *   console.log(data, response.status);
 * });
 * ```
 */
function request<D = unknown>(path: string, opts?: CreateRequestOptions<D>): RequestPromise<D>;

/**
 * Returns a wrapped request constructor with the specified options.
 * This overload helps to organize the "builder" pattern.
 *
 * @param opts - request options
 * @example
 * ```js
 * request({okStatuses: 200})({method: 'POST'})('bla/get').then(({data, response}) => {
 *   console.log(data, response.status);
 * });
 * ```
 */
function request<D = unknown>(opts: CreateRequestOptions<D>): typeof request;

/**
 * Returns a function to create a new remote request with the specified options.
 * This overload helps to create a factory of requests.
 *
 * @param path - request path URL
 * @param resolver - function to resolve a request: it takes a request URL, request environment, and arguments
 *   from invoking the outer function and can modify some request parameters.
 *   Also, if the function returns a new string, the string will be appended to the request URL, or
 *   if the function returns a string wrapped with an array, the string fully overrides the original URL.
 *
 * @param opts - request options
 *
 * @example
 * ```js
 * // Modifying the current URL
 * request('https://foo.com', (url, env, ...args) => args.join('/'))('bla', 'baz') // https://foo.com/bla/baz
 *
 * // Replacing the current URL
 * request('https://foo.com', () => ['https://bla.com', 'bla', 'baz'])() // https://bla.com/bla/baz
 * ```
 */
function request<D = unknown, A extends any[] = unknown[]>(
	path: string,
	resolver: RequestResolver<D, A>,
	opts?: CreateRequestOptions<D>
): RequestFunctionResponse<D, A extends Array<infer V> ? V[] : unknown[]>;

function request<D = unknown>(
	path: string | CreateRequestOptions<D>,
	...args: unknown[]
): unknown {
	if (Object.isPlainObject(path)) {
		const
			defOpts = path;

		return (path, resolver, opts) => {
			if (Object.isPlainObject(path)) {
				return request(merge<CreateRequestOptions<D>>(defOpts, path));
			}

			if (Object.isFunction(resolver)) {
				return request(path, resolver, merge<CreateRequestOptions<D>>(defOpts, opts));
			}

			return request(path, merge<CreateRequestOptions<D>>(defOpts, resolver));
		};
	}

	let
		resolver,
		opts: CanUndef<CreateRequestOptions<D>>;

	if (args.length > 1) {
		[resolver, opts] = Object.cast(args);

	} else if (Object.isDictionary(args[0])) {
		opts = args[0];

	} else if (Object.isFunction(args[0])) {
		resolver = args[0];
	}

	opts ??= {};

	const
		baseCtx = new RequestContext<D>(merge(defaultRequestOpts, opts));

	const run = (...args) => {
		const emitter = new EventEmitter({
			maxListeners: 100,
			newListener: true,
			wildcard: true
		});

		const
			eventBuffer = new Set<string>();

		emitter.on('newListener', (event) => {
			if (event !== 'newListener' && event !== 'drainListeners') {
				eventBuffer.add(event);
			}
		});

		emitter.on('drainListeners', () => {
			eventBuffer.forEach((event) => emitter.emit('newListener', event));
			eventBuffer.clear();
		});

		let
			ctx = RequestContext.decorateContext(baseCtx, path, resolver, ...args);

		const
			requestParams = ctx.params;

		const middlewareParams = {
			ctx,
			globalOpts,
			opts: requestParams
		};

		const errDetails = {
			request: requestParams
		};

		const requestPromise = new AbortablePromise(async (resolve, reject, onAbort) => {
			onAbort((err) => {
				reject(err ?? new RequestError(RequestError.Abort, errDetails));
			});

			await Promise.resolve();
			ctx.parent = requestPromise;

			if (Object.isPromise(ctx.cache)) {
				await AbortablePromise.resolve(ctx.isReady, requestPromise);
			}

			const
				middlewareTasks = <Array<CanPromise<unknown>>>[];

			Object.forEach(requestParams.middlewares, (fn: Middleware<D>) => {
				middlewareTasks.push(fn(middlewareParams));
			});

			const
				middlewareResults = await AbortablePromise.all(middlewareTasks, requestPromise),
				paramsKeyToEncode = ctx.withoutBody ? 'query' : 'body';

			// eslint-disable-next-line require-atomic-updates
			requestParams[paramsKeyToEncode] = Object.cast(await applyEncoders(requestParams[paramsKeyToEncode]));

			for (let i = 0; i < middlewareResults.length; i++) {
				// If a middleware returns a function, the function will be executed.
				// The result of invoking is provided as a result of the whole request.
				if (!Object.isFunction(middlewareResults[i])) {
					continue;
				}

				resolve((() => {
					const
						res: unknown[] = [];

					for (let j = i; j < middlewareResults.length; j++) {
						const
							el = middlewareResults[j];

						if (Object.isFunction(el)) {
							res.push(el());
						}
					}

					if (res.length === 1) {
						return res[0];
					}

					return res;
				})());

				return;
			}

			const
				url = ctx.resolveRequest(globalOpts.api),
				{cacheKey} = ctx;

			let
				fromCache = false;

			if (cacheKey != null && ctx.canCache) {
				if (ctx.pendingCache.has(cacheKey)) {
					try {
						const
							res = await ctx.pendingCache.get(cacheKey);

						if (res?.response instanceof Response) {
							resolve(res);
							return;
						}

					} catch (err) {
						const
							errType = err?.type;

						if (errType === 'clearAsync' || errType === 'abort') {
							reject(err);
							return;
						}
					}

				} else if (requestParams.engine.pendingCache !== false) {
					void ctx.pendingCache.set(cacheKey, Object.cast(createControllablePromise({
						type: AbortablePromise,
						args: [ctx.parent]
					})));
				}

				fromCache = await AbortablePromise.resolve(ctx.cache.has(cacheKey), requestPromise);
			}

			let
				resultPromise,
				cache = 'none';

			if (fromCache) {
				const getFromCache = async () => {
					cache = (await AbortablePromise.resolve(isOnline(), requestPromise)).status ? 'memory' : 'offline';
					return ctx.cache.get(cacheKey!);
				};

				resultPromise = AbortablePromise.resolveAndCall(getFromCache, requestPromise)
					.then(ctx.wrapAsResponse.bind(ctx))
					.then((res) => Object.assign(res, {cache}));

			} else {
				const reqOpts = {
					...requestParams,
					url,
					emitter,
					parent: requestPromise,
					decoders: ctx.decoders,
					streamDecoders: ctx.streamDecoders
				};

				const createEngineRequest = () => {
					const
						{engine} = requestParams;

					const
						req = engine(reqOpts, Object.cast(middlewareParams));

					return req.catch((err) => {
						if (err instanceof RequestError) {
							Object.assign(err.details.deref() ?? {}, errDetails);
						}

						return Promise.reject(err);
					});
				};

				if (requestParams.retry != null) {
					const retryParams: RetryOptions = Object.isNumber(requestParams.retry) ?
						{attempts: requestParams.retry} :
						requestParams.retry;

					const
						attemptLimit = retryParams.attempts ?? Infinity,
						delayFn = retryParams.delay?.bind(retryParams) ?? ((i) => i < 5 ? i * 500 : (5).seconds());

					let
						attempt = 0;

					const createRequestWithRetrying = async () => {
						const calculateDelay = (attempt: number, err: RequestError) => {
							const
								delay = delayFn(attempt, err);

							if (Object.isPromise(delay) || delay === false) {
								return delay;
							}

							return new Promise((r) => {
								setTimeout(r, Object.isNumber(delay) ? delay : (1).second());
							});
						};

						try {
							return await createEngineRequest().then(wrapSuccessResponse);

						} catch (err) {
							if (attempt++ >= attemptLimit) {
								throw err;
							}

							const
								delay = await calculateDelay(attempt, err);

							if (delay === false) {
								throw err;
							}

							return createRequestWithRetrying();
						}
					};

					resultPromise = createRequestWithRetrying();

				} else {
					resultPromise = createEngineRequest().then(wrapSuccessResponse);
				}
			}

			resultPromise
				.then(ctx.saveCache.bind(ctx))

				.then(async ({response, data}) => {
					if (response.bodyUsed === true) {
						log(`request:response:${path}`, await data, {
							cache,
							request: requestParams
						});
					}
				})

				.catch((err) => log.error('request', err));

			resolve(ctx.wrapRequest(resultPromise));

			function applyEncoders(data: unknown): unknown {
				let
					res = AbortablePromise.resolve(data, requestPromise);

				Object.forEach(ctx.encoders, (fn, i: number) => {
					res = res.then((obj) => fn(i > 0 ? obj : Object.fastClone(obj)));
				});

				return res;
			}

			function wrapSuccessResponse(response: Response<D>): RequestResponseObject<D> {
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				void responseIterator.resolve(response[Symbol.asyncIterator].bind(response));

				const
					details = {response, ...errDetails};

				if (!response.ok) {
					throw AbortablePromise.wrapReasonToIgnore(new RequestError(RequestError.InvalidStatus, details));
				}

				let
					customData,
					destroyed = false;

				const res = {
					ctx,
					response,

					get data() {
						return customData ?? response.decode();
					},

					set data(val: Promise<D>) {
						customData = SyncPromise.resolve(val);
					},

					get stream() {
						return response.decodeStream();
					},

					emitter,
					[Symbol.asyncIterator]: response[Symbol.asyncIterator].bind(response),

					dropCache: ctx.dropCache.bind(ctx),

					destroy: () => {
						if (destroyed) {
							return;
						}

						ctx.destroy();
						emitter.removeAllListeners();

						ctx = Object.cast(null);
						Object.set(res, 'ctx', ctx);

						response.destroy();
						response = Object.cast(null);
						Object.set(res, 'response', response);

						customData = undefined;
						Object.delete(res, 'data');

						Object.defineProperty(res, 'stream', {
							configurable: true,
							enumerable: true,
							get: () => Promise.resolve({done: true, value: undefined})
						});

						res.dropCache = () => undefined;
						res[Symbol.asyncIterator] = () => Promise.resolve({done: true, value: undefined});

						Object.keys(middlewareParams).forEach((key) => {
							delete middlewareParams[key];
						});

						Object.keys(errDetails).forEach((key) => {
							delete errDetails[key];
						});

						destroyed = true;
					}
				};

				return res;
			}
		});

		requestPromise['emitter'] = emitter;

		void Object.defineProperty(requestPromise, 'data', {
			configurable: true,
			enumerable: true,
			get: () => requestPromise.then((res: RequestResponseObject) => res.data)
		});

		void Object.defineProperty(requestPromise, 'stream', {
			configurable: true,
			enumerable: true,
			get: () => requestPromise.then((res: RequestResponseObject) => res.stream)
		});

		const responseIterator = createControllablePromise({
			type: AbortablePromise,
			args: [ctx.parent]
		});

		requestPromise[Symbol.asyncIterator] = () => {
			const
				iter = responseIterator.then((iter: Function) => iter());

			return {
				[Symbol.asyncIterator]() {
					return this;
				},

				next() {
					return iter.then((iter) => iter.next());
				}
			};
		};

		return requestPromise;
	};

	if (Object.isFunction(resolver)) {
		return run;
	}

	return run();
}
