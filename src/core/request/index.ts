/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';

import log from 'core/log';
import request from 'core/request/engines';

import Response from 'core/request/response';
import RequestError from 'core/request/error';
import RequestContext from 'core/request/context';

import { isOnline } from 'core/net';
import { getStorageKey } from 'core/request/utils';
import { concatUrls } from 'core/url';

import { storage, globalOpts, defaultRequestOpts, mimeTypes } from 'core/request/const';
import * as i from 'core/request/interface';

export * from 'core/request/interface';
export * from 'core/request/utils';

export { globalOpts, cache, pendingCache, dropCache } from 'core/request/const';
export { default as RequestError } from 'core/request/error';
export { default as Response } from 'core/request/response';

/**
 * Creates a new remote request with the specified options
 *
 * @param path - request path URL
 * @param opts - request options:
 *   *) [method='GET'] - request method type
 *
 *   *) [contentType] - mime type of request data (if not specified, it will be casted dynamically)
 *   *) [responseType='text'] - type of response data
 *      (if not specified, it will be casted dynamically from response headers):
 *
 *      1) 'text' - result is interpreted as a simple string;
 *      2) 'json' - result is interpreted as a JSON string;
 *      2) 'arrayBuffer' - result is interpreted as an array buffer;
 *      2) 'blob' - result is interpreted as a binary sequence;
 *      2) 'object' - result is interpreted "as is" without any converting.
 *
 *   *) [body] - request body
 *   *) [query] - URL query parameters
 *   *) [headers] - additional request headers
 *   *) [credentials] - enables providing of credentials for cross-domain requests
 *
 *   *) [api] - object with API parameters. If the API is specified it will be concatenated with a request path URL.
 *      It can be useful for creating request factories.
 *      You can provide a direct URL for the API:
 *
 *      *) [url] - base API URL, such as 'https://google.com'.
 *
 *      Or you can provide a bunch of parameters for mapping on .api parameter from the application config.
 *      For example, if the config.api is equal to 'https://google.com' and you provide parameters like
 *      {domain3: 'foo', namespace: 'bar'}, than it builds a string is equal to 'https://foo.google.com/bar'.
 *
 *      *) [protocol] - api protocol, like 'http' ot 'https'
 *      *) [domain3] - value for an API domain level 3 part
 *      *) [domain2] - value for an API domain level 2 part
 *      *) [zone] - value for an API domain zone part
 *      *) [namespace] - value for an API namespace part: it follows after '/' character
 *
 *   *) [okStatuses=new Range(200, 299)] - list of status codes (or a single code) with HTTP statuses which is ok
 *      for response, also can pass a range of codes
 *
 *   *) [timeout] - value in milliseconds for the request timeout
 *
 *   *) [cacheStrategy='never'] - type of caching for requests which supports it:
 *      1) 'forever' - caches all requests and stores their values forever within the active session or
 *         until the cache expires (if .cacheTTL is specified);
 *
 *      2) 'queue' - caches all requests, but more frequent requests will push less frequent requests;
 *      3) 'never' - never caches any requests.
 *
 *   *) [cacheId] - unique cache id: it can be useful for creating request factories with isolated cache storages
 *   *) [cacheMethods=['GET']] - list of request methods that supports caching
 *   *) [cacheTTL] - value in milliseconds that indicates how long a value of the request should keep in the cache
 *      (by default, all request is stored within the active session without expiring)
 *
 *   *) [offlineCache=false] - enables the support of offline caching
 *   *) [offlineCacheTTL=(1).day()] - value in milliseconds that indicates how long a value of the request
 *      should keep in the offline cache
 *
 *   *) [middlewares] - dictionary or an iterable value with middleware functions:
 *      functions take an environment of request parameters and can modify theirs.
 *      Please notice, that the order of middlewares depends of a structure which you use.
 *      Also, if at least one of middlewares returns a function, than the result of invoking this function
 *      will be returned as the request result. It can be helpful for organizing mocks of data and
 *      other similar cases when you don't want to execute a real request.
 *
 *   *) [encoder] - function (or a sequence of functions) that takes data of the current request
 *      (if .body is not specified, it will take .query) and returns a new data for requesting.
 *      If you provides a sequence of functions, then the first function will provide a result to the next function
 *      from the sequence and etc.
 *
 *   *) [decoder] - function (or a sequence of functions) that takes response data of the current request
 *      and returns a new data for responsing. If you provides a sequence of functions, then the first function
 *      will provide a result to the next function from the sequence and etc.
 *
 *   *) [externalRequest] - special flag which indicates that request will be invoked not directly by a browser,
 *      but some "external" application, such as a native application in a mobile (it's important for offline requests)
 *
 *   *) [important] - meta flag which indicates that the request is important: usually it used with middlewares for
 *      indicating that the request need execute as soon as possible
 *
 *   *) [meta] - dictionary with some extra parameters for the request: usually it used with middlewares for
 *      providing domain specific information
 */
export default function create<T = unknown>(path: string, opts?: i.CreateRequestOptions<T>): i.RequestResponse<T>;

/**
 * Returns a wrapped request constructor with the specified options
 *
 * @param opts
 * @example
 * request({okStatuses: 200})({query: {bar: true}})('bla/get')
 */
export default function create<T = unknown>(opts: i.CreateRequestOptions<T>): typeof create;

/**
 * @param path
 * @param resolver - request resolve function
 * @param opts
 */
export default function create<T = unknown, A extends unknown[] = unknown[]>(
	path: string,
	resolver: i.RequestResolver<T, A>,
	opts?: i.CreateRequestOptions<T>
): i.RequestFunctionResponse<T, A extends (infer V)[] ? V[] : unknown[]>;

export default function create<T = unknown>(path: any, ...args: any[]): unknown {
	const merge = <T>(...args: unknown[]) => Object.mixin<T>({
		deep: true,
		concatArray: true,
		concatFn: (a: unknown[], b: unknown[]) => a.union(b),
		extendFilter: (d, v) => Array.isArray(v) || Object.isObject(v)
	}, undefined, ...args);

	if (Object.isObject(path)) {
		const
			defOpts = path;

		return (path, resolver, opts) => {
			if (Object.isObject(path)) {
				return create(merge<i.CreateRequestOptions<T>>(defOpts, path));
			}

			if (Object.isFunction(resolver)) {
				return create(path, resolver, merge<i.CreateRequestOptions<T>>(defOpts, opts));
			}

			return create(path, merge<i.CreateRequestOptions<T>>(defOpts, resolver));
		};
	}

	let
		resolver, opts: i.CreateRequestOptions<T>;

	if (args.length > 1) {
		([resolver, opts] = args);

	} else {
		opts = args[0];
	}

	opts = opts || {};

	const
		baseCtx: RequestContext<T> = new RequestContext<T>(merge(defaultRequestOpts, opts));

	const run = (...args) => {
		const
			p = merge<i.CreateRequestOptions<T>>(baseCtx.params),
			ctx = Object.create(baseCtx);

		const middlewareParams = {
			opts: p,
			ctx,
			globalOpts
		};

		const wrapProcessor = (namespace, fn, key) => (data, ...args) => {
			const
				time = Date.now(),
				res = fn(data, middlewareParams, ...args);

			const
				loggingContext = `request:${namespace}:${key}:${path}`,
				getTime = () => `Finished at ${Date.now() - time}ms`,
				clone = (data) => () => Object.isObject(data) || Object.isArray(data) ? Object.fastClone(data) : data;

			if (Object.isPromise(res)) {
				res.then((data) => log(loggingContext, getTime(), clone(data)));

			} else {
				log(loggingContext, getTime(), clone(res));
			}

			return res;
		};

		const
			encoders = <Function[]>[],
			decoders = <Function[]>[];

		Object.forEach(merge(ctx.encoders), (el, key) => {
			encoders.push(wrapProcessor('encoders', el, key));
		});

		Object.forEach(merge(ctx.decoders), (el, key) => {
			decoders.push(wrapProcessor('decoders', el, key));
		});

		Object.assign(ctx, {
			// Merge request options
			params: p,
			encoders,
			decoders,

			// Bind middlewares to new context
			saveCache: ctx.saveCache.bind(ctx),
			dropCache: ctx.dropCache.bind(ctx),
			wrapAsResponse: ctx.wrapAsResponse.bind(ctx),
			wrapRequest: ctx.wrapRequest.bind(ctx),

			// Wrap resolve function with .resolver
			resolveURL(api?: Nullable<string>): string {
				if (/^\w+:/.test(path)) {
					const
						dataURI = /^data:([^;]+);/.exec(path),
						type = dataURI && dataURI[1];

					if (type && !p.responseType) {
						if (mimeTypes[type]) {
							p.responseType = mimeTypes[type];

						} else if (/^text(?:\/|$)/.test(type)) {
							p.responseType = 'text';

						} else {
							p.responseType = 'arrayBuffer';
						}
					}

					return path;
				}

				let
					url = concatUrls(api ? this.resolveAPI(api) : null, path);

				if (Object.isFunction(resolver)) {
					const
						res = resolver(url, middlewareParams, ...args);

					if (Object.isArray(res)) {
						url = <string>res[0];

					} else if (res) {
						url = concatUrls(url, res);
					}
				}

				return baseCtx.resolveURL.call(this, url);
			}
		});

		const parent = new Then(async (resolve, reject, onAbort) => {
			onAbort((err) => {
				reject(err || new RequestError('abort'));
			});

			await new Promise((r) => {
				// tslint:disable-next-line:no-string-literal
				globalThis['setImmediate'](r);
			});

			ctx.parent = parent;
			ctx.isOnline = (await Then.resolve(isOnline(), parent)).status;

			const
				tasks = <any[]>[];

			Object.forEach(p.middlewares, (fn: Function) => {
				tasks.push(fn(middlewareParams));
			});

			const
				middlewareResults = await Then.all(tasks, parent);

			const applyEncoders = (data) => {
				let
					res = Then.resolve(data, parent);

				Object.forEach(ctx.encoders, (fn: Function, i) => {
					res = res.then((obj) => fn(i ? obj : Object.fastClone(obj)));
				});

				return res;
			};

			if (ctx.withoutBody) {
				p.query = await applyEncoders(p.query);

			} else {
				p.body = await applyEncoders(p.body);
			}

			for (let i = 0; i < middlewareResults.length; i++) {
				if (!Object.isFunction(middlewareResults[i])) {
					continue;
				}

				resolve((() => {
					const
						res = <any[]>[];

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
				url = ctx.resolveURL(globalOpts.api),
				cacheKey = ctx.cacheKey;

			let
				localCacheKey,
				fromCache = false,
				fromLocalStorage = false;

			if (ctx.canCache) {
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
					p.offlineCache &&
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
				res = Then.resolveAndCall(() => ctx.cache.get(cacheKey), parent)
					.then(ctx.wrapAsResponse);

			} else if (fromLocalStorage) {
				cache = 'offline';
				res = Then.resolveAndCall(() => storage!
					.then((storage) => storage.get(localCacheKey)), parent)
					.then(ctx.wrapAsResponse)
					.then(ctx.saveCache);

			} else if (!ctx.isOnline && !p.externalRequest) {
				res = Then.reject(new RequestError('offline'));

			} else {
				const success = async (response) => {
					if (!response.ok) {
						throw new RequestError('invalidStatus', {response});
					}

					const
						data = await response.decode();

					if (p.externalRequest && !ctx.isOnline && !data) {
						throw new RequestError('offline');
					}

					return {data, response, ctx, dropCache: ctx.dropCache};
				};

				const reqOpts = {
					...p,
					url,
					parent,
					decoder: ctx.decoders
				};

				res = request(reqOpts).then(success).then(ctx.saveCache);
			}

			res.then((response) => log(`response:${path}`, response.data, {
				cache,
				externalRequest: opts.externalRequest,
				request: opts
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
