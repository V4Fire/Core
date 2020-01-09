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
import { getStorageKey, getResponseTypeFromURL } from 'core/request/utils';
import { concatUrls } from 'core/url';

import { storage, globalOpts, defaultRequestOpts } from 'core/request/const';
import * as i from 'core/request/interface';

export * from 'core/request/interface';
export * from 'core/request/utils';

export { dropCache } from 'core/request/utils';
export { globalOpts, cache, pendingCache } from 'core/request/const';
export { default as RequestError } from 'core/request/error';
export { default as Response } from 'core/request/response';

/**
 * Creates a new remote request with the specified options
 *
 * @param path - request path URL
 * @param opts - request options:
 *
 * @param [opts.method='GET'] - request method type
 * @param [opts.contentType] - mime type of request data (if not specified, it will be casted dynamically)
 *
 * @param [opts.responseType='text'] - type of response data
 *   (if not specified, it will be casted dynamically from response headers):
 *   <ul>
 *     <li>'text' - result is interpreted as a simple string;</li>
 *     <li>'json' - result is interpreted as a JSON string;</li>
 *     <li>'arrayBuffer' - result is interpreted as an array buffer;</li>
 *     <li>'blob' - result is interpreted as a binary sequence;</li>
 *     <li>'object' - result is interpreted "as is" without any converting.</li>
 *   </ul>
 *
 * @param [opts.body] - request body
 * @param [opts.query] - URL query parameters
 * @param [opts.headers] - additional request headers
 * @param [opts.credentials] - enables providing of credentials for cross-domain requests
 *
 * @param [opts.api] - object with API parameters. If the API is specified it will be concatenated with
 *   a request path URL. It can be useful for creating request factories. In addition, you can provide a function as a
 *   key value, and it will be invoked.
 *   <p>You can provide a direct URL for the API:</p>
 *
 * @param [opts.api.url] - base API URL, such as 'https://google.com'.
 *    <p>Or you can provide a bunch of parameters for mapping on .api parameter from the application config.
 *    For example, if the config.api is equal to 'https://google.com' and you provide parameters like
 *    {domain3: 'foo', namespace: () => 'bar'}, than it builds a string is equal to 'https://foo.google.com/bar'.</p>
 *
 * @param [opts.api.protocol] - api protocol, like 'http' ot 'https'
 * @param [opts.api.auth] - value for an API authorization part, like 'login:password'
 * @param [opts.api.domain6] - value for an API domain level 6 part
 * @param [opts.api.domain5] - value for an API domain level 5 part
 * @param [opts.api.domain4] - value for an API domain level 4 part
 * @param [opts.api.domain3] - value for an API domain level 3 part
 * @param [opts.api.domain2] - value for an API domain level 2 part
 * @param [opts.api.zone] - value for an API domain zone part
 * @param [opts.api.port] - value for an API api port
 * @param [opts.api.namespace] - value for an API namespace part: it follows after '/' character
 *
 * @param [opts.okStatuses=new Range(200, 299)] - list of status codes (or a single code) with HTTP statuses which is ok
 *   for response, also can pass a range of codes
 *
 * @param [opts.timeout] - value in milliseconds for the request timeout
 *
 * @param [opts.cacheStrategy='never'] - type of caching for requests which supports it:
 *   <ol>
 *     <li>
 *       'forever' - caches all requests and stores their values forever within the active session or
 *       until the cache expires (if .cacheTTL is specified);
 *     </li>
 *      <li>'queue' - caches all requests, but more frequent requests will push less frequent requests;</li>
 *      <li>'never' - never caches any requests.</li>
 *   </ol>
 *
 * @param [opts.cacheId] - unique cache id: it can be useful for creating request factories with isolated cache storages
 * @param [opts.cacheMethods=['GET']] - list of request methods that supports caching
 * @param [opts.cacheTTL] - value in milliseconds that indicates how long a value of the request should keep in
 *   the cache (by default, all request is stored within the active session without expiring)
 *
 * @param [opts.offlineCache=false] - enables support of offline caching
 * @param [opts.offlineCacheTTL=(1).day()] - value in milliseconds that indicates how long a value of the request
 *   should keep in the offline cache
 *
 * @param [opts.middlewares] - dictionary or an iterable value with middleware functions:
 *   functions take an environment of request parameters and can modify theirs.
 *   <p>Please notice, that the order of middlewares depends of a structure which you use.
 *   Also, if at least one of middlewares returns a function, than the result of invoking this function
 *   will be returned as the request result. It can be helpful for organizing mocks of data and
 *   other similar cases when you don't want to execute a real request.</p>
 *
 * @param [opts.encoder] - function (or a sequence of functions) that takes data of the current request
 *   (if .body is not specified, it will take .query) and returns a new data for requesting.
 *   If you provides a sequence of functions, then the first function will provide a result to the next function
 *   from the sequence and etc.
 *
 * @param [opts.decoder] - function (or a sequence of functions) that takes response data of the current request
 *   and returns a new data for responsing. If you provides a sequence of functions, then the first function
 *   will provide a result to the next function from te sequence and etc.
 *
 * @param [opts.externalRequest] - special flag which indicates that request will be invoked not directly by a browser,
 *   but some "external" application, such as a native application in a mobile (it's important for offline requests)
 *
 * @param [opts.important] - meta flag which indicates that the request is important: usually it used with middlewares
 *   for indicating that the request need execute as soon as possible
 *
 * @param [opts.meta] - dictionary with some extra parameters for the request: usually it used with middlewares for
 *   providing domain specific information
 */
export default function create<T = unknown>(path: string, opts?: i.CreateRequestOptions<T>): i.RequestResponse<T>;

/**
 * Returns a wrapped request constructor with the specified options
 *
 * @param opts - request options
 * @example
 * request({okStatuses: 200})({query: {bar: true}})('bla/get')
 */
export default function create<T = unknown>(opts: i.CreateRequestOptions<T>): typeof create;

/**
 * Returns a function for creating a new remote request with the specified options.
 * This overload is helpful for creating factories for requests.
 *
 * @param path - request path URL
 * @param resolver - function for request resolving:
 *   this function takes a request URL, request environment and arguments from invoking of the result function and
 *   can returns a modification chunk for the request URL or fully replace it
 *
 * @param opts - request options
 *
 * @example
 * // Modifying of the current URL
 * create('https://foo.com', (url, env, ...args) => args.join('/'))('bla', 'baz') // https://foo.com/bla/baz
 *
 * // Replacing of the current URL
 * create('https://foo.com', () => ['https://bla.com', 'bla', 'baz'])() // https://bla.com/bla/baz
 */
export default function create<T = unknown, A extends unknown[] = unknown[]>(
	path: string,
	resolver: i.RequestResolver<T, A>,
	opts?: i.CreateRequestOptions<T>
): i.RequestFunctionResponse<T, A extends (infer V)[] ? V[] : unknown[]>;

export default function create<T = unknown>(
	path: string | i.CreateRequestOptions<T>,
	...args: any[]
): unknown {
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
				const
					reqPath = String(path),
					type = getResponseTypeFromURL(reqPath);

				if (type) {
					if (!p.responseType) {
						p.responseType = type;
					}

					return reqPath;
				}

				let
					url = concatUrls(api ? this.resolveAPI(api) : null, reqPath);

				if (Object.isFunction(resolver)) {
					const
						res = resolver(url, middlewareParams, ...args);

					if (Object.isArray(res)) {
						url = concatUrls(...res.map(String));

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
