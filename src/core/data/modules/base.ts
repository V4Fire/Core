/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import symbolGenerator from 'core/symbol';

import { readonly } from 'core/object/proxy-readonly';
import { unimplement } from 'core/functools/implementation';

import { deprecate } from 'core/functools';
import { concatURLs } from 'core/url';

import Async from 'core/async';
import IO, { Socket } from 'core/socket';
import type AbortablePromise from 'core/promise/abortable';

import {

	globalOpts,

	CreateRequestOptions,
	MiddlewareParams,

	RequestQuery,
	RequestMethod,
	RequestBody,

	RequestPromise,
	RequestResponseObject,

	ResolverResult,
	RequestFunctionResponse

} from 'core/request';

import type {

	Provider as IProvider,
	ProviderOptions,
	ModelMethod

} from 'core/data/interface';

import {

	namespace,

	providers,
	queryMethods,

	requestCache,
	instanceCache,
	connectCache

} from 'core/data/const';

import ParamsProvider from 'core/data/modules/params';

export * from 'core/data/modules/params';

export const
	$$ = symbolGenerator();

export default abstract class Provider extends ParamsProvider implements IProvider {
	/**
	 * Cache identifier
	 */
	readonly cacheId!: string;

	/** @inheritDoc */
	readonly alias?: string;

	/** @inheritDoc */
	readonly emitter!: EventEmitter;

	/** @inheritDoc */
	readonly params!: ProviderOptions;

	/** @inheritDoc */
	get providerName(): string {
		return this.constructor[namespace];
	}

	/** @inheritDoc */
	get event(): EventEmitter {
		deprecate({name: 'event', type: 'accessor', renamedTo: 'emitter'});
		return this.emitter;
	}

	/**
	 * API for async operations
	 */
	protected readonly async!: Async<this>;

	/**
	 * Socket connection
	 */
	protected connection?: Promise<Socket>;

	/**
	 * @param [opts] - additional options
	 */
	protected constructor(opts: ProviderOptions = {}) {
		super();

		const
			id = this.getCacheKey(opts),
			cacheVal = instanceCache[id];

		if (cacheVal != null) {
			return <this>cacheVal;
		}

		instanceCache[id] = this;
		requestCache[id] = Object.createDict();

		this.cacheId = id;
		this.params = opts;

		this.async = new Async(this);
		this.emitter = new EventEmitter({maxListeners: 1e3, newListener: false});

		if (opts.socket || this.socketURL != null) {
			this.connect().then(this.initSocketBehaviour.bind(this), stderr);
		}
	}

	/**
	 * Returns a key to the class instance cache
	 * @param [paramsForCache]
	 */
	getCacheKey(paramsForCache: ProviderOptions = {}): string {
		return `${this.providerName}:${Object.fastHash(paramsForCache)}`;
	}

	/**
	 * Returns an object with authentication parameters
	 * @param params - additional parameters
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
	getAuthParams(params?: Dictionary): Promise<Dictionary> {
		return Promise.resolve({});
	}

	/**
	 * Function to resolve a request: it takes a request URL and request environment
	 * and can modify some request parameters.
	 *
	 * Also, if the function returns a new string, the string will be appended to the request URL, or
	 * if the function returns a string that wrapped with an array, the string fully override the original URL.
	 *
	 * @see [[RequestResolver]]
	 * @param url - request URL
	 * @param params - request parameters
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
	resolver<T = unknown>(url: string, params: MiddlewareParams<T>): ResolverResult {
		return undefined;
	}

	/**
	 * Connects to a socket server and returns the connection
	 * @param [opts] - additional options for the server
	 */
	async connect(opts?: Dictionary): Promise<Socket> {
		await this.async.wait(() => this.socketURL);

		const
			{socketURL: url} = this,
			key = Object.fastHash(opts);

		if (connectCache[key] == null) {
			connectCache[key] = new Promise((resolve, reject) => {
				const
					socket = IO(url);

				if (!socket) {
					return;
				}

				function onClear(err: unknown): void {
					reject(err);
					delete connectCache[key];
				}

				const asyncParams = {
					group: 'connection',
					label: $$.connect,
					join: true,
					onClear
				};

				this.async.worker(socket, asyncParams);
				this.async.once(socket, 'connect', () => resolve(socket), asyncParams);
			});
		}

		return connectCache[key]!;
	}

	/** @inheritDoc */
	name(): CanUndef<ModelMethod>;

	/** @inheritDoc */
	name(value: ModelMethod): Provider;
	name(value?: ModelMethod): CanUndef<ModelMethod | Provider> {
		if (value == null) {
			return this.eventName;
		}

		const obj = Object.create(this);
		obj.eventName = value;
		return obj;
	}

	/** @inheritDoc */
	method(): CanUndef<RequestMethod>;

	/** @inheritDoc */
	method(value: RequestMethod): Provider;
	method(value?: RequestMethod): CanUndef<RequestMethod | Provider> {
		if (value == null) {
			return this.customMethod;
		}

		const obj = Object.create(this);
		obj.customMethod = value;
		return obj;
	}

	/** @inheritDoc */
	base(): string;

	/** @inheritDoc */
	base(value: string): Provider;
	base(value?: string): string | Provider {
		if (value == null) {
			return this.baseURL;
		}

		const
			obj = Object.create(this);

		obj.baseURL = value;
		obj.baseGetURL = undefined;
		obj.basePeekURL = undefined;
		obj.baseAddURL = undefined;
		obj.baseUpdURL = undefined;
		obj.baseDelURL = undefined;

		return obj;
	}

	/** @inheritDoc */
	url(): string;

	/** @inheritDoc */
	url(value: string): Provider;
	url(value?: string): string | Provider {
		if (value == null) {
			return concatURLs(this.baseURL, this.advURL);
		}

		const obj = Object.create(this);
		obj.advURL = value;
		return obj;
	}

	/** @inheritDoc */
	dropCache(): void {
		const
			cache = requestCache[this.cacheId];

		if (cache) {
			for (let keys = Object.keys(cache), i = 0; i < keys.length; i++) {
				const
					obj = cache[keys[i]];

				if (obj) {
					obj.dropCache();
				}
			}
		}

		requestCache[this.cacheId] = Object.createDict();
		this.emitter.emit('dropCache');
	}

	/** @inheritDoc */
	get<D = unknown>(query?: RequestQuery, opts?: CreateRequestOptions<D>): RequestPromise<D> {
		const
			url = this.resolveURL(this.baseGetURL),
			alias = this.alias ?? this.providerName;

		const
			eventName = this.name(),
			method = this.method() ?? this.getMethod;

		const mergedOpts = this.getRequestOptions<D>('get', {
			...opts,
			[queryMethods[method] != null ? 'query' : 'body']: query,
			method
		});

		const
			req = this.request(url, this.resolver.bind(this), mergedOpts),
			res = eventName != null ? this.updateRequest(url, eventName, req) : this.updateRequest(url, req);

		const extraProviders = Object.isFunction(this.extraProviders) ?
			this.extraProviders({opts: Object.cast(mergedOpts), globalOpts}) :
			this.extraProviders;

		if (extraProviders) {
			const
				composition = <D & object>{},
				tasks: Array<AbortablePromise<RequestResponseObject>> = [],
				cloneTasks: Function[] = [];

			for (let keys = Object.keys(extraProviders), i = 0; i < keys.length; i++) {
				const
					key = keys[i],
					el = extraProviders[key] ?? {};

				const
					ProviderLink = el.provider ?? key,
					alias = el.alias ?? key;

				let
					ProviderConstructor,
					providerInstance: IProvider;

				if (Object.isString(ProviderLink)) {
					ProviderConstructor = <CanUndef<Dictionary & typeof Provider>>providers[ProviderLink];

					if (ProviderConstructor == null) {
						throw new Error(`Provider "${ProviderLink}" is not defined`);
					}

					providerInstance = new ProviderConstructor(el.providerOptions);

				} else if (Object.isSimpleFunction(ProviderLink)) {
					providerInstance = new ProviderLink(el.providerOptions);

				} else {
					providerInstance = ProviderLink;
				}

				const
					req = providerInstance.get(el.query ?? query, el.request);

				tasks.push(
					req.then(async (res) => {
						const
							data = <Nullable<D & object>>(await res.data);

						Object.set(composition, alias, data);
						cloneTasks.push((composition) => Object.set(composition, alias, data?.valueOf()));

						return res;
					})
				);
			}

			const compositionRes = res.then(
				(res) => Promise.all(tasks).then(async () => {
					let
						data = <Nullable<D & object>>(await res.data);

					if (data && Object.hasOwnProperty(data, alias)) {
						data = data[alias];
					}

					Object.set(composition, alias, data);
					cloneTasks.push((composition) => Object.set(composition, alias, data?.valueOf()));

					Object.defineProperty(composition, 'valueOf', {
						writable: true,
						configurable: true,
						value: () => {
							const
								clone = {};

							for (let i = 0; i < cloneTasks.length; i++) {
								cloneTasks[i](clone);
							}

							return clone;
						}
					});

					// eslint-disable-next-line require-atomic-updates
					res.data = Promise.resolve(readonly(composition));
					return res;
				}),

				null,

				() => {
					for (let i = 0; i < tasks.length; i++) {
						tasks[i].abort();
					}
				}
			);

			compositionRes['emitter'] = new EventEmitter();

			void Object.defineProperty(compositionRes, 'data', {
				configurable: true,
				enumerable: true,
				get: () => compositionRes.then((res: RequestResponseObject) => res.data)
			});

			const unimplementedStream = unimplement.bind(null, {
				name: 'Symbol.asyncIterator',
				type: 'property',
				notice: "Requests with extra providers can't be streamed"
			});

			void Object.defineProperty(compositionRes, 'stream', {
				configurable: true,
				enumerable: true,
				get: unimplementedStream
			});

			compositionRes[Symbol.asyncIterator] = unimplementedStream;

			return Object.cast(compositionRes);
		}

		return res;
	}

	/** @inheritDoc */
	peek<D = unknown>(query?: RequestQuery, opts?: CreateRequestOptions<D>): RequestPromise<D> {
		const
			url = this.resolveURL(this.basePeekURL),
			eventName = this.name(),
			method = this.method() ?? this.peekMethod;

		const req = this.request(url, this.resolver.bind(this), this.getRequestOptions('peek', {
			...opts,
			[queryMethods[method] != null ? 'query' : 'body']: query,
			method
		}));

		if (eventName != null) {
			return this.updateRequest(url, eventName, req);
		}

		return this.updateRequest(url, req);
	}

	/** @inheritDoc */
	post<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestPromise<D> {
		const
			url = this.resolveURL(),
			eventName = this.name(),
			method = this.method() ?? 'POST';

		const req = this.request(url, this.resolver.bind(this), this.getRequestOptions(eventName ?? 'post', {
			...opts,
			body,
			method
		}));

		if (eventName != null) {
			return this.updateRequest(url, eventName, req);
		}

		return this.updateRequest(url, req);
	}

	/** @inheritDoc */
	add<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestPromise<D> {
		const
			url = this.resolveURL(this.baseAddURL),
			eventName = this.name() ?? 'add',
			method = this.method() ?? this.addMethod;

		const req = this.request(url, this.resolver.bind(this), this.getRequestOptions('add', {
			...opts,
			body,
			method
		}));

		return this.updateRequest(url, eventName, req);
	}

	/**
	 * @alias
	 * @see [[Provider.upd]]
	 */
	update<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestPromise<D> {
		return this.upd(body, opts);
	}

	/** @inheritDoc */
	upd<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestPromise<D> {
		const
			url = this.resolveURL(this.baseUpdURL),
			eventName = this.name() ?? 'upd',
			method = this.method() ?? this.updMethod;

		const req = this.request(url, this.resolver.bind(this), this.getRequestOptions('upd', {
			...opts,
			body,
			method
		}));

		return this.updateRequest(url, eventName, req);
	}

	/**
	 * @alias
	 * @see [[Provider.del]]
	 */
	delete<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestPromise<D> {
		return this.del(body, opts);
	}

	/** @inheritDoc */
	del<D = unknown>(body?: RequestBody, opts?: CreateRequestOptions<D>): RequestPromise<D> {
		const
			url = this.resolveURL(this.baseDelURL),
			eventName = this.name() ?? 'del',
			method = this.method() ?? this.delMethod;

		const req = this.request(url, this.resolver.bind(this), this.getRequestOptions('del', {
			...opts,
			body,
			method
		}));

		return this.updateRequest(url, eventName, req);
	}

	/**
	 * Returns full request URL by the specified URL chunks
	 *
	 * @param [baseURL]
	 * @param [advURL]
	 */
	protected resolveURL(baseURL?: Nullable<string>, advURL?: Nullable<string>): string {
		return concatURLs(baseURL == null ? this.baseURL : baseURL, advURL == null ? this.advURL : advURL);
	}

	/**
	 * Sets a readonly value by the specified key to the current provider
	 */
	protected setReadonlyParam(key: string, val: unknown): void {
		Object.defineProperty(this, key, {
			configurable: true,
			get: () => val,
			set: () => {
				// Loopback
			}
		});
	}

	/**
	 * Returns an event cache key by the specified parameters
	 *
	 * @param event - event name
	 * @param data - event data
	 */
	protected getEventKey(event: string, data: unknown): unknown {
		if (Object.isArray(data) || Object.isDictionary(data)) {
			return `${event}::${Object.fastHash(data)}`;
		}

		return {};
	}

	/**
	 * Returns an object with request options by the specified model name and object with additional parameters
	 *
	 * @param method - model method
	 * @param [params] - additional parameters
	 */
	protected getRequestOptions<D = unknown>(
		method: ModelMethod,
		params?: CreateRequestOptions<D>
	): CreateRequestOptions<D> {
		const
			{middlewares, encoders, decoders} = <typeof Provider>this.constructor;

		const merge = (a, b) => {
			a = Object.isFunction(a) ? [a] : a;
			b = Object.isFunction(b) ? [b] : b;
			return {...a, ...b};
		};

		const
			mappedMiddlewares = merge(middlewares, params?.middlewares);

		for (let keys = Object.keys(mappedMiddlewares), i = 0; i < keys.length; i++) {
			const key = keys[i];
			mappedMiddlewares[key] = mappedMiddlewares[key].bind(this);
		}

		return {
			...params,

			cacheId: this.cacheId,
			middlewares: mappedMiddlewares,

			encoder: merge(encoders[method] ?? encoders['def'], params?.encoder),
			decoder: merge(decoders[method] ?? decoders['def'], params?.decoder),

			meta: {
				provider: this,
				providerMethod: method,
				providerParams: params
			}
		};
	}

	/**
	 * Updates the specified request with adding caching, etc.
	 *
	 * @param url - request url
	 * @param factory - request factory
	 */
	protected updateRequest<D = unknown>(url: string, factory: RequestFunctionResponse<D>): RequestPromise<D>;

	/**
	 * Updates the specified request with adding caching, etc.
	 *
	 * @param url - request url
	 * @param event - event name that is fired after resolving of the request
	 * @param factory - request factory
	 */
	protected updateRequest<D = unknown>(
		url: string,
		event: string,
		factory: RequestFunctionResponse<D>
	): RequestPromise<D>;

	protected updateRequest<D = unknown>(
		url: string,
		eventOrFactory: string | RequestFunctionResponse<D>,
		factory?: RequestFunctionResponse<D>
	): RequestPromise<D> {
		let
			event;

		if (Object.isFunction(eventOrFactory)) {
			factory = eventOrFactory;

		} else {
			event = eventOrFactory;
		}

		if (factory == null) {
			throw new ReferenceError('A factory function to create the requests is not specified');
		}

		const
			req = factory();

		req
			.then((res) => {
				try {
					const
						cache = requestCache[this.cacheId];

					const {
						ctx: {
							canCache,
							cacheKey
						}
					} = res;

					if (canCache && cacheKey != null && cache != null) {
						cache[cacheKey] = Object.cast(res);
					}

				} catch (err) {
					stderr(err);
				}

				if (event != null) {
					this.emitter.emit(event, () => res.data);
				}
			})

			.catch(() => {
				// Do nothing. Logging is already handled in the request factory.
			});

		return req;
	}

	/**
	 * Initializes the socket behaviour after successful connecting
	 */
	protected initSocketBehaviour(): Promise<void> {
		return Promise.resolve();
	}
}
