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

import AbortablePromise from 'core/promise/abortable';
import { isOnline } from 'core/net';

import Response from 'core/request/response';
import RequestError from 'core/request/error';
import RequestContext from 'core/request/modules/context';

import { merge } from 'core/request/helpers';
import { defaultRequestOpts, globalOpts } from 'core/request/const';

import type {

	Middleware,
	CreateRequestOptions,
	RetryOptions,

	RequestResolver,
	RequestChunk,
	RequestResponse,
	RequestFunctionResponse,
	RequestResponseObject,
	RequestPromise

} from 'core/request/interface';

export * from 'core/request/helpers';
export * from 'core/request/interface';
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
function request<D = unknown>(path: string, opts?: CreateRequestOptions<D>): AbortablePromise<RequestResponse<D>>;

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
 * @param resolver - function to resolve a request: it takes a request URL, request environment and arguments
 *   from invoking of the outer function and can modify some request parameters.
 *   Also, if the function returns a new string, the string will be appended to the request URL, or
 *   if the function returns a string that wrapped with an array, the string fully override the original URL.
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
		const
			emitter = new EventEmitter({maxListeners: 1e3, newListener: false}),
			ctx = RequestContext.decorateContext(baseCtx, path, resolver, ...args),
			requestParams = ctx.params;

		const middlewareParams = {
			ctx,
			globalOpts,
			opts: requestParams
		};

		const requestPromise = <RequestPromise>new AbortablePromise(async (resolve, reject, onAbort) => {
			const errDetails = {
				request: requestParams
			};

			onAbort((err) => {
				reject(err ?? new RequestError(RequestError.Abort, errDetails));
			});

			await new Promise(setImmediate);
			ctx.parent = requestPromise;

			if (Object.isPromise(ctx.cache)) {
				await AbortablePromise.resolve(ctx.isReady, requestPromise);
			}

			const
				tasks = <Array<CanPromise<unknown>>>[];

			Object.forEach(requestParams.middlewares, (fn: Middleware<D>) => {
				tasks.push(fn(middlewareParams));
			});

			const
				middlewareResults = await AbortablePromise.all(tasks, requestPromise),
				keyToEncode = ctx.withoutBody ? 'query' : 'body';

			// eslint-disable-next-line require-atomic-updates
			requestParams[keyToEncode] = Object.cast(await applyEncoders(requestParams[keyToEncode]));

			for (let i = 0; i < middlewareResults.length; i++) {
				// If the middleware returns a function, the function will be executed.
				// The result of invoking is provided as a result of the whole request.
				if (!Object.isFunction(middlewareResults[i])) {
					continue;
				}

				resolve((() => {
					const
						res = <unknown[]>[];

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
				url = ctx.resolveRequest(globalOpts.api);

			const
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
							isRequestCanceled = {clearAsync: true, abort: true}[err?.type] === true;

						if (isRequestCanceled) {
							reject(err);
							return;
						}
					}
				}

				fromCache = await AbortablePromise.resolve(ctx.cache.has(cacheKey), requestPromise);
			}

			let
				res,
				cache = 'none';

			if (fromCache) {
				const getFromCache = async () => {
					cache = (await AbortablePromise.resolve(isOnline(), requestPromise)).status ? 'memory' : 'offline';
					return ctx.cache.get(cacheKey!);
				};

				res = AbortablePromise.resolveAndCall(getFromCache, requestPromise)
					.then(ctx.wrapAsResponse.bind(ctx))
					.then((res) => Object.assign(res, {cache}));

			} else {
				const reqOpts = {
					...requestParams,
					url,
					emitter,
					parent: requestPromise,
					decoders: ctx.decoders
				};

				const
					createReq = () => requestParams.engine(reqOpts);

				if (requestParams.retry != null) {
					const retryParams: RetryOptions = Object.isNumber(requestParams.retry) ?
						{attempts: requestParams.retry} :
						requestParams.retry;

					const
						attemptLimit = retryParams.attempts ?? Infinity,
						delayFn = retryParams.delay?.bind(retryParams) ?? ((i) => i < 5 ? i * 500 : (5).seconds());

					let
						attempt = 0;

					const createReqWithRetrying = async () => {
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
							return await createReq().then(wrapSuccessResponse);

						} catch (err) {
							if (attempt++ >= attemptLimit) {
								throw err;
							}

							const
								delay = await calculateDelay(attempt, err);

							if (delay === false) {
								throw err;
							}

							return createReqWithRetrying();
						}
					};

					res = createReqWithRetrying();

				} else {
					res = createReq().then(wrapSuccessResponse);
				}
			}

			res = res.then(ctx.saveCache.bind(ctx));

			res
				.then((response) => log(`request:response:${path}`, response.data, {
					cache,
					request: requestParams
				}))

				.catch((err) => log.error('request', err));

			resolve(
				ctx.wrapRequest(res)
			);

			function applyEncoders(data: unknown): unknown {
				let
					res = AbortablePromise.resolve(data, requestPromise);

				Object.forEach(ctx.encoders, (fn, i: number) => {
					res = res.then((obj) => fn(i > 0 ? obj : Object.fastClone(obj)));
				});

				return res;
			}

			async function wrapSuccessResponse(response: Response<D>): Promise<RequestResponseObject<D>> {
				const
					details = {response, ...errDetails};

				if (!response.ok) {
					const
						requestError = new RequestError(RequestError.InvalidStatus, details);

					await response.body;
					response.stream?.destroy(requestError);
					throw AbortablePromise.wrapReasonToIgnore(requestError);
				}

				const
					data = await response.decode();

				return {
					data,
					response,
					ctx,

					dropCache: ctx.dropCache.bind(ctx),

					[Symbol.asyncIterator](): AsyncGenerator<RequestChunk> {
						return response[Symbol.asyncIterator]();
					}
				};
			}
		});

		requestPromise.emitter = emitter;

		return requestPromise;
	};

	if (Object.isFunction(resolver)) {
		return run;
	}

	return run();
}
