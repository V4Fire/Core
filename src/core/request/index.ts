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

import log from 'core/log';
import Then from 'core/then';
import { isOnline } from 'core/net';

import Response from 'core/request/response';
import RequestError from 'core/request/error';
import RequestContext from 'core/request/context';

import { merge, getStorageKey } from 'core/request/utils';
import { storage, globalOpts, defaultRequestOpts } from 'core/request/const';

import {

	CreateRequestOptions,
	RequestResolver,
	RequestResponse,
	RequestFunctionResponse,
	Middleware

} from 'core/request/interface';

export * from 'core/request/utils';
export * from 'core/request/interface';
export * from 'core/request/response/interface';

export { globalOpts, cache, pendingCache } from 'core/request/const';
export { default as RequestError } from 'core/request/error';
export { default as Response } from 'core/request/response';

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
export default function request<T = unknown>(path: string, opts?: CreateRequestOptions<T>): RequestResponse<T>;

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
export default function request<T = unknown>(opts: CreateRequestOptions<T>): typeof request;

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
export default function request<T = unknown, A extends unknown[] = unknown[]>(
	path: string,
	resolver: RequestResolver<T, A>,
	opts?: CreateRequestOptions<T>
): RequestFunctionResponse<T, A extends (infer V)[] ? V[] : unknown[]>;

export default function request<T = unknown>(
	path: string | CreateRequestOptions<T>,
	...args: any[]
): unknown {
	if (Object.isPlainObject(path)) {
		const
			defOpts = path;

		return (path, resolver, opts) => {
			if (Object.isPlainObject(path)) {
				return request(merge<CreateRequestOptions<T>>(defOpts, path));
			}

			if (Object.isFunction(resolver)) {
				return request(path, resolver, merge<CreateRequestOptions<T>>(defOpts, opts));
			}

			return request(path, merge<CreateRequestOptions<T>>(defOpts, resolver));
		};
	}

	let
		resolver, opts: CreateRequestOptions<T>;

	if (args.length > 1) {
		([resolver, opts] = args);

	} else {
		opts = args[0];
	}

	opts = opts || {};

	const
		baseCtx = new RequestContext<T>(merge(defaultRequestOpts, opts));

	const run = (...args) => {
		const
			ctx = RequestContext.decorateContext(baseCtx, path, resolver, ...args),
			requestParams = ctx.params;

		const middlewareParams = {
			opts: requestParams,
			ctx,
			globalOpts
		};

		const parent = new Then(async (resolve, reject, onAbort) => {
			const errDetails = {
				request: requestParams
			};

			onAbort((err) => {
				reject(err || new RequestError('abort', errDetails));
			});

			await new Promise((r) => {
				// tslint:disable-next-line:no-string-literal
				globalThis['setImmediate'](r);
			});

			ctx.parent = parent;
			ctx.isOnline = (await Then.resolve(isOnline(), parent)).status;

			const
				tasks = <CanPromise<unknown>[]>[];

			Object.forEach(requestParams.middlewares, (fn: Middleware<T>) => {
				tasks.push(fn(middlewareParams));
			});

			const
				middlewareResults = await Then.all(tasks, parent);

			const applyEncoders = (data) => {
				let
					res = Then.resolve(data, parent);

				Object.forEach(ctx.encoders, (fn, i) => {
					res = res.then((obj) => fn(i ? obj : Object.fastClone(obj)));
				});

				return res;
			};

			const keyToEncode = ctx.withoutBody ? 'query' : 'body';
			requestParams[keyToEncode] = await applyEncoders(requestParams[keyToEncode]);

			for (let i = 0; i < middlewareResults.length; i++) {
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
				localCacheKey,
				fromCache = false,
				fromLocalStorage = false;

			if (cacheKey && ctx.canCache) {
				if (ctx.pendingCache.has(cacheKey)) {
					try {
						const
							res = await ctx.pendingCache.get(cacheKey);

						if (res?.response instanceof Response) {
							resolve(res);
							return;
						}

					} catch (err) {
						if (err && !{clearAsync: true, abort: true}[err.type]) {
							reject(err);
							return;
						}
					}
				}

				localCacheKey = getStorageKey(cacheKey);
				fromCache = ctx.cache.has(cacheKey);
				fromLocalStorage = Boolean(
					!fromCache &&
					requestParams.offlineCache &&
					!ctx.isOnline &&
					storage &&
					await (await storage).has(localCacheKey)
				);
			}

			let
				res,
				cache = 'none';

			if (fromCache) {
				cache = 'memory';
				res = Then.resolveAndCall(() => ctx.cache.get(cacheKey!), parent)
					.then(ctx.wrapAsResponse);

			} else if (fromLocalStorage) {
				cache = 'offline';
				res = Then.resolveAndCall(() => storage!
					.then((storage) => storage.get(localCacheKey)), parent)
					.then(ctx.wrapAsResponse)
					.then(ctx.saveCache);

			} else if (!ctx.isOnline && !requestParams.externalRequest) {
				res = Then.reject(new RequestError('offline', errDetails));

			} else {
				const success = async (response) => {
					if (!response.ok) {
						throw new RequestError('invalidStatus', {response, ...errDetails});
					}

					const
						data = await response.decode();

					if (requestParams.externalRequest && !ctx.isOnline && !data) {
						throw new RequestError('offline', {response, ...errDetails});
					}

					return {data, response, ctx, dropCache: ctx.dropCache};
				};

				const reqOpts = {
					...requestParams,
					url,
					parent,
					decoders: ctx.decoders
				};

				res = requestParams.engine(reqOpts).then(success).then(ctx.saveCache);
			}

			res.then((response) => log(`response:${path}`, response.data, {
				cache,
				externalRequest: requestParams.externalRequest,
				request: requestParams
			}));

			resolve(ctx.wrapRequest(res));
		});

		return parent;
	};

	if (Object.isFunction(resolver)) {
		return run;
	}

	return run();
}
