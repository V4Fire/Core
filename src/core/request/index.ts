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

import Then from 'core/then';
import log from 'core/log';

import { isOnline } from 'core/net';
import { concatUrls } from 'core/url';

import Response from 'core/request/response';
import RequestError from 'core/request/error';
import RequestContext from 'core/request/context';

import { getStorageKey, getResponseTypeFromURL } from 'core/request/utils';
import { storage, globalOpts, defaultRequestOpts, isAbsoluteURL } from 'core/request/const';

import {

	CreateRequestOptions,
	NormalizedCreateRequestOptions,

	RequestResolver,
	RequestResponse,
	RequestFunctionResponse,

	Middleware,
	WrappedEncoder,
	WrappedDecoder

} from 'core/request/interface';

export * from 'core/request/utils';
export * from 'core/request/interface';
export * from 'core/request/response/interface';

export { dropCache } from 'core/request/utils';
export { globalOpts, cache, pendingCache } from 'core/request/const';
export { default as RequestError } from 'core/request/error';
export { default as Response } from 'core/request/response';

/**
 * Creates a new remote request with the specified options
 *
 * @param path - request path URL
 * @param opts - request options
 */
export default function request<T = unknown>(path: string, opts?: CreateRequestOptions<T>): RequestResponse<T>;

/**
 * Returns a wrapped request constructor with the specified options
 *
 * @param opts - request options
 * @example
 * ```js
 * request({okStatuses: 200})({query: {bar: true}})('bla/get')
 * ```
 */
export default function request<T = unknown>(opts: CreateRequestOptions<T>): typeof request;

/**
 * Returns a function to create a new remote request with the specified options.
 * This overload is helpful to create factories for requests.
 *
 * @param path - request path URL
 * @param resolver - function for request resolving:
 *   this function takes a request URL, request environment and arguments from invoking of the result function and
 *   can returns a modification chunk for the request URL or fully replace it
 *
 * @param opts - request options
 *
 * @example
 * ```js
 * // Modifying of the current URL
 * request('https://foo.com', (url, env, ...args) => args.join('/'))('bla', 'baz') // https://foo.com/bla/baz
 *
 * // Replacing of the current URL
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
	const merge = <T>(...args: unknown[]) => Object.mixin<T>({
		deep: true,
		concatArray: true,
		concatFn: (a: unknown[], b: unknown[]) => a.union(b),
		extendFilter: (d, v) => Array.isArray(v) || Object.isPlainObject(v)
	}, undefined, ...args);

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
		baseCtx: RequestContext<T> = new RequestContext<T>(merge(defaultRequestOpts, opts));

	const run = (...args) => {
		const
			p = merge<NormalizedCreateRequestOptions<T>>(baseCtx.params),
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
				clone = (data) => () => Object.isPlainObject(data) || Object.isArray(data) ? Object.fastClone(data) : data;

			if (Object.isPromise(res)) {
				res.then((data) => log(loggingContext, getTime(), clone(data)));

			} else {
				log(loggingContext, getTime(), clone(res));
			}

			return res;
		};

		const
			encoders = <WrappedEncoder[]>[],
			decoders = <WrappedDecoder[]>[];

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
			resolveRequest(api?: Nullable<string>): string {
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
					url = isAbsoluteURL.test(reqPath) ? reqPath : concatUrls(api ? this.resolveAPI(api) : null, reqPath);

				if (Object.isFunction(resolver)) {
					const
						res = resolver(url, middlewareParams, ...args);

					if (Object.isArray(res)) {
						url = concatUrls(...res.map(String));

					} else if (res) {
						url = concatUrls(url, res);
					}
				}

				return baseCtx.resolveRequest.call(this, url);
			}
		});

		const parent = new Then(async (resolve, reject, onAbort) => {
			onAbort((err) => {
				reject(err || new RequestError('abort', {request: ctx.params}));
			});

			await new Promise((r) => {
				// tslint:disable-next-line:no-string-literal
				globalThis['setImmediate'](r);
			});

			ctx.parent = parent;
			ctx.isOnline = (await Then.resolve(isOnline(), parent)).status;

			const
				tasks = <CanPromise<unknown>[]>[];

			Object.forEach(p.middlewares, (fn: Middleware<T>) => {
				tasks.push(fn(middlewareParams));
			});

			const
				middlewareResults = await Then.all(tasks, parent);

			const applyEncoders = (data) => {
				let
					res = Then.resolve(data, parent);

				Object.forEach(<typeof encoders>ctx.encoders, (fn, i) => {
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
				url = ctx.resolveRequest(globalOpts.api),
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
				res = Then.reject(new RequestError('offline', {request: ctx.params}));

			} else {
				const success = async (response) => {
					if (!response.ok) {
						throw new RequestError('invalidStatus', {request: ctx.params, response});
					}

					const
						data = await response.decode();

					if (p.externalRequest && !ctx.isOnline && !data) {
						throw new RequestError('offline', {request: ctx.params, response});
					}

					return {data, response, ctx, dropCache: ctx.dropCache};
				};

				const reqOpts = {
					...p,
					url,
					parent,
					decoders: ctx.decoders
				};

				res = p.engine(reqOpts).then(success).then(ctx.saveCache);
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
