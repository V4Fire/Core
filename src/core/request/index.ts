import $C = require('collection.js');
import Then from 'core/then';

import StatusCodes from 'core/statusCodes';
import RequestError from 'core/transport/request/error';

import request from 'core/transport/request';
import configurator from 'core/data/configurator';

import { Cache } from 'core/cache';
import { getStorageKey, isOnline } from 'core/data/utils';
import { concatUrls, qsStableStringify } from 'core/helpers';
import { CreateOptions, Rewriter, RequestContext } from 'core/data/interface';
import { storage, requestCache, globalOpts, defaultRequestOpts, SERVICE_UNAVAILABLE } from 'core/data/const';

/**
 * Создает AJAX запрос на заданный URL
 *
 * @param path
 * @param opts
 */
// @ts-ignore
export default function create<T>(path: string, opts?: CreateOptions<T>): () => Then<T>;

/**
 * Создать фасад create c заданными параметрами по умолчанию
 * @param opts
 */
export default function create<T, A>(opts: CreateOptions<T>): typeof create;

/**
 * @param path
 * @param rewriter - функция перезаписи url
 * @param opts
 */
export default function create<T, A>(
	path: string,
	rewriter: (this: CreateOptions<T>, arg: A) => Rewriter,
	opts?: CreateOptions<T>
): (a: A) => Then<T>;

export default function create<T, A1, A2>(
	path: string,
	rewriter: (this: CreateOptions<T>, arg1: A1, arg2: A2) => Rewriter,
	opts?: CreateOptions<T>
): (arg1: A1, arg2: A2) => Then<T>;

export default function create<T, A1, A2, A3>(
	path: string,
	rewriter: (this: CreateOptions<T>, arg1: A1, arg2: A2, arg3: A3) => Rewriter,
	opts?: CreateOptions<T>
): (arg1: A1, arg2: A2, arg3: A3) => Then<T>;

// tslint:disable-next-line
export default function create<T>(path, ...args) {
	if (Object.isObject(path)) {
		const defOpts = path;
		return (path, rewriter, opts) => {
			if (Object.isObject(path)) {
				return create({...path, ...defOpts});
			}

			if (Object.isFunction(rewriter)) {
				return create(path, rewriter, {...defOpts, ...opts});
			}

			return create(path, {...defOpts, ...rewriter});
		};
	}

	let rewriter, params: CreateOptions<T>;

	if (args.length > 1) {
		([rewriter, params] = args);

	} else {
		params = args[0];
	}

	const p: RequestContext<T>['params'] = <any>{
		headers: {},
		...defaultRequestOpts,
		...params
	};

	const ctx: RequestContext<T> = <any>{
		rewriter,
		canCache: p.method === 'GET',
		params: p
	};

	if (p.converterPath) {
		const c = getProtobuf(p.converterPath);
		ctx.decoder = $C(c.decoders).get([p.decoder]),
			ctx.encoder = $C(c.encoders).get([p.encoder]);
	}

	ctx.okStatus = p.okStatus ? (<number[]>[]).concat(p.okStatus) : [StatusCodes.OK];
	ctx.query = p.query ? Object.fastClone(p.query) : {};
	ctx.qs = qsStableStringify(ctx.query);

	if (ctx.canCache) {
		ctx.pendingCache = new Cache<Then<T>>();
		ctx.cache = {default: requestCache, never: null, forever: new Cache<T>()}[p.cacheStrategy];
	}

	/**
	 * Возвращает полную строку АПИ для запроса
	 * @param [base]
	 */
	ctx.resolveAPI = (base = globalOpts.api) => {
		const
			a = <any>p.api,
			rgxp = /(?:^|(https?:\/\/)(?:(.*?)\.)?(.*?)\.(.*?))(\/.*|$)/;

		if (!base) {
			const def = {
				namespace: '',
				...a
			};

			const
				nm = def.namespace;

			if (!def.protocol) {
				return nm[0] === '/' ? nm : `/${nm}`;
			}

			return concatUrls(
				[
					def.protocol + (def.domain3 ? `${def.domain3}.` : '') + a.domain2,
					def.zone
				].join('.'),

				nm
			);
		}

		const v = (f, def) => {
			const
				v = a[f] != null ? a[f] : def || '';

			if (f === 'domain3') {
				return v ? `${v}.` : '';
			}

			return v;
		};

		return base.replace(rgxp, (str, protocol, domain3, domain2, zone, nm) => {
			nm = v('namespace', nm);

			if (!protocol) {
				return nm[0] === '/' ? nm : `/${nm}`;
			}

			return concatUrls(
				[
					v('protocol', protocol) + v('domain3', domain3) + v('domain2', domain2),
					v('zone', zone)
				].join('.'),

				nm
			);
		});
	};

	/**
	 * Декодирует ArrayBuffer в JS объект
	 * @param buffer
	 */
	ctx.decodeResponse = (buffer) => {
		if (ctx.decoder && buffer.byteLength) {
			const decodedData = (<any>ctx.decoder.decode(new Uint8Array(buffer))).toObject();
			return p.postProcessor ? p.postProcessor(decodedData) : decodedData;
		}

		return p.emptyValue;
	};

	let cacheId;

	/**
	 * Фабрика для создания функции кеширования результата запроса
	 * @param url - URL запроса
	 */
	ctx.saveCache = (url) => (res) => {
		if (ctx.canCache && p.offline) {
			storage.set(getStorageKey(url), res, p.cacheTime || (1).day()).catch(() => {
				// ...
			});
		}

		if (ctx.cache) {
			const
				cache = ctx.cache as Cache<T>;

			if (cacheId) {
				clearTimeout(cacheId);
			}

			cache.set(url, res);

			if (p.cacheTime) {
				cacheId = setTimeout(() => cache.remove(url), p.cacheTime);
			}
		}

		return res;
	};

	/**
	 * Враппер для запроса (runtime кеширование и т.д.)
	 *
	 * @param url - URL запроса
	 * @param promise
	 */
	ctx.wrapRequest = (url, promise) => {
		if (ctx.canCache) {
			const
				cache = ctx.pendingCache as Cache<Then<T>>;

			promise = promise.then(
				(v) => {
					cache.remove(url);
					return v;
				},

				(r) => {
					cache.remove(url);
					throw r;
				},

				() => {
					cache.remove(url);
				}
			);

			cache.set(url, promise);
		}

		return promise.then();
	};

	// tslint:disable-next-line
	return async (...args) => {
		let res;

		ctx.isOnline = await isOnline();

		/**
		 * Возвращает полную строку запроса (вместе с параметрами)
		 * @param api - API URL
		 */
		ctx.resolveURL = (api?) => {
			let
				url = concatUrls(api ? ctx.resolveAPI(api) : null, path);

			if (Object.isFunction(rewriter)) {
				const
					mut = rewriter.call(p, ...args) || {};

				if (mut.query) {
					Object.assign(ctx.query, mut.query);
					ctx.qs = qsStableStringify(ctx.query);
				}

				if (mut.subPath) {
					url = concatUrls(url, mut.subPath);
				}
			}

			return url + ctx.qs;
		};

		const
			newRes = await configurator(ctx, globalOpts);

		if (newRes) {
			return newRes();
		}

		if (globalOpts.token) {
			p.headers.Authorization = globalOpts.token;
		}

		const
			url = ctx.resolveURL(globalOpts.api),
			localKey = getStorageKey(url);

		let
			cacheKey,
			fromCache = false;

		if (ctx.canCache) {
			cacheKey = [url, JSON.stringify(p.headers)].join();
			fromCache = Boolean(ctx.cache && ctx.cache.exist(cacheKey));
		}

		const
			fromLocalStorage = !fromCache && ctx.canCache && p.offline && !ctx.isOnline && await storage.exists(localKey);

		if (ctx.canCache) {
			const
				cache = ctx.pendingCache as Cache<Then<T>>;

			if (cache.exist(url)) {
				return cache.get(url).then();
			}
		}

		if (fromCache) {
			res = Then.immediate((<Cache<T>>ctx.cache).get(cacheKey));

		} else if (fromLocalStorage) {
			res = Then.resolve(storage.get(localKey))
				.then((res) => JSON.parse(res))
				.then(ctx.saveCache(cacheKey));

		} else if (!ctx.isOnline && !p.appRequest) {
			res = new Then(() => {
				throw new RequestError(null, 'offline');
			});

		} else {
			const success = (response) => {
				if (response.status === SERVICE_UNAVAILABLE) {
					throw new RequestError({response});
				}

				if (
					response.status === StatusCodes.NO_CONTENT ||
					response.status === StatusCodes.OK && !response.body.byteLength
				) {
					return p.emptyValue;
				}

				if (!ctx.okStatus.includes(response.status)) {
					throw new RequestError({response});
				}

				return response.arrayBuffer().then(ctx.decodeResponse).then((res) => {
					if (p.appRequest && !ctx.isOnline && !res) {
						throw new RequestError(null, 'offline');
					}

					return res;
				});
			};

			let b = p.body;
			if (p.preProcessor) {
				b = p.preProcessor(Object.fastClone(b));
			}

			if (ctx.encoder) {
				b = ctx.encoder.encode(b).finish();
			}

			b = b || null;
			const reqOpts = {
				url,
				method: p.method,
				headers: p.headers,
				body: b,
				encoding: null
			};

			const r = () => request(reqOpts).then(success).then(ctx.saveCache(cacheKey));
			res = ctx.prefetch ? ctx.prefetch.then(r) : r();
		}

		return ctx.wrapRequest(url, res);
	};
}
