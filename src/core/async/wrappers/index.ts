/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/async/wrappers/README.md]]
 * @packageDocumentation
 */

import type { Provider } from 'core/data';

import type { CreateRequestOptions, RequestQuery, RequestBody } from 'core/request';
import type { AsyncStorage, AsyncStorageNamespace, ClearFilter } from 'core/kv-storage';

import Super, { AsyncOptions, EventEmitterLike } from 'core/async/events';

import { emitLikeEvents, asyncOptionsKeys, dataProviderMethodsToReplace } from 'core/async/wrappers/consts';

import type {

	WrappedDataProvider,
	DataProviderMethodsToReplace,
	DataProviderQueryMethodsToReplace,

	EventEmitterWrapper,
	EventEmitterOverwritten,

	WrappedAsyncStorageNamespace,
	WrappedAsyncStorage,

	AsyncOptionsForWrappers

} from 'core/async/interface';

export * from 'core/async/events';
export * from 'core/async/wrappers/consts';
export * from 'core/async/interface';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * The wrapper takes a link to the "raw" data provider and returns a new object based on the original.
	 * All asynchronous methods and properties are wrapped by Async.
	 *
	 * Note that the wrapped methods can take additional Async parameters, such as `group` or `label`.
	 * If you don't provide a group, it will be taken from the provider name.
	 *
	 * @param provider
	 * @param [opts] - additional options for the wrapper
	 *
	 * @example
	 * ```js
	 * import Async from 'core/async';
	 * import Provider, { provider } from 'core/data';
	 *
	 * @provider('api')
	 * export default class User extends Provider {
	 *   baseURL = 'user/:id';
	 * }
	 *
	 * const
	 *   $a = new Async(),
	 *   wrappedProvider = $a.wrapDataProvider(new User());
	 *
	 * wrappedProvider.get({uuid: 1}).then((res) => {
	 *   console.log(res);
	 * });
	 *
	 * // By default, all wrapped methods have a group name that is equal to the provider's name.
	 * // This allows us to clear or suspend requests, among other things.
	 * $a.clearAll({group: 'api.User'})
	 *
	 * wrappedProvider.update({uuid: 1}, {
	 *   // All wrapped methods can take additional Async parameters as the second argument: group, label, and join
	 *   group: 'bla',
	 *   label: 'foo',
	 *   join: true,
	 *
	 *   // Additionally, the second argument of the wrapped method can take the original parameters from the provider
	 *   headers: {
	 *     'X-Foo': '1'
	 *   }
	 *
	 * }).then((res) => {
	 *   console.log(res);
	 * });
	 *
	 * // If we provide a group to the method, it will be joined with the global group using the `:` character
	 * $a.suspendAll({group: 'api.User:bla'});
	 *
	 * // We can use a group as a RegExp
	 * $a.muteAll({group: /api\.User/});
	 *
	 * // We can use any methods or properties from the original data provider
	 * wrappedProvider.dropCache();
	 * ```
	 */
	wrapDataProvider<
		P extends Provider,
		W extends WrappedDataProvider
	>(provider: P, opts?: AsyncOptionsForWrappers): W {
		const
			wrappedProvider: W = Object.create(provider),
			wrappedProviderGroup = opts?.group ?? provider.providerName;

		dataProviderMethodsToReplace.forEach((methodName) => {
			Object.defineProperty(wrappedProvider, methodName, {
				configurable: true,
				writable: true,
				value: <D = unknown>(
					body?: RequestBody | RequestQuery,
					opts?: CreateRequestOptions<D> & AsyncOptions
				) => {
					const
						ownParams = Object.reject(opts, asyncOptionsKeys),
						asyncParams = Object.select(opts, asyncOptionsKeys),
						group = `${wrappedProviderGroup}${asyncParams.group != null ? `:${asyncParams.group}` : ''}`;

					if (isQueryMethod(methodName)) {
						return this.request(provider[methodName](<RequestQuery>body, ownParams), {
							...asyncParams,
							group
						});
					}

					return this.request(provider[methodName](<RequestBody>body, ownParams), {
						...asyncParams,
						group
					});
				}
			});
		});

		Object.defineProperty(wrappedProvider, 'emitter', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: this.wrapEventEmitter(provider.emitter, opts)
		});

		return wrappedProvider;

		function isQueryMethod(name: DataProviderMethodsToReplace): name is DataProviderQueryMethodsToReplace {
			return ['get', 'peek'].includes(name);
		}
	}

	/**
	 * The wrapper takes a link to the "raw" event emitter and returns a new object based on the original,
	 * but all asynchronous methods and properties are wrapped by Async.
	 *
	 * Note that the wrapped methods can take additional Async parameters, such as `group` or `label`.
	 * In addition, the wrapper adds new methods, such as "on" and "off", to make the emitter API more standard.
	 *
	 * @param emitter
	 * @param [opts] - additional options for the wrapper
	 *
	 * @example
	 * ```js
	 * import Async from 'core/async';
	 *
	 * const
	 *   $a = new Async(),
	 *   wrappedEventEmitter = $a.wrapEventEmitter(window);
	 *
	 * const handler = () => console.log('scroll event');
	 *
	 * // We can safely listen to emitter events because all emitter methods,
	 * // such as addListener or on, are wrapped by Async
	 * const id = wrappedEventEmitter.addEventListener('scroll', handler, {
	 *   // Note that the third argument can take Async parameters in addition to the native emitter parameters
	 *   capture: true,
	 *   label: 'label'
	 * });
	 *
	 * // The wrapper preserves the original API of the emitter methods, so we can call something like this:
	 * wrappedEventEmitter.removeEventListener('scroll', handler);
	 *
	 * // Finally, the wrapper adds a bunch of standard methods to the emitter,
	 * // such as on, once, and other functionalities.
	 * // We can use them instead of the original methods to make our code more universal.
	 * wrappedEventEmitter.once('resize', (e) => {
	 *   console.log(e);
	 * }, {group: 'resizers'});
	 *
	 * $a.muteAll({group: 'resizers'});
	 *
	 * // We can use any methods or properties from the original emitter
	 * console.log(wrappedEventEmitter.name); // window.name
	 * ```
	 */
	wrapEventEmitter<T extends EventEmitterLike>(
		emitter: T,
		opts?: AsyncOptionsForWrappers
	): EventEmitterOverwritten<T> & EventEmitterWrapper {
		const
			wrappedEmitter = Object.create(emitter),
			links = new WeakMap<Function, Function>();

		Object.defineProperty(wrappedEmitter, 'on', {
			configurable: true,
			writable: true,
			value: (event: string, cb: Function, ...args: unknown[]) => {
				if (!Object.isFunction(cb)) {
					throw new TypeError('Wrapped emitters methods `on, addEventListener, addListener` accept only a function as the second parameter');
				}

				const link = Object.cast<Nullable<{handler: Function}>>(
					this.on(emitter, event, cb, ...normalizeAdditionalArgs(args))
				);

				if (link != null) {
					links.set(cb, link.handler);
				}

				return link;
			}
		});

		Object.defineProperty(wrappedEmitter, 'addEventListener', {
			configurable: true,
			writable: true,
			value: wrappedEmitter.on
		});

		Object.defineProperty(wrappedEmitter, 'addListener', {
			configurable: true,
			writable: true,
			value: wrappedEmitter.on
		});

		Object.defineProperty(wrappedEmitter, 'once', {
			configurable: true,
			writable: true,
			value: (event: string, cb: Function, ...args: unknown[]) =>
				this.once(emitter, event, cb, ...normalizeAdditionalArgs(args))
		});

		Object.defineProperty(wrappedEmitter, 'promisifyOnce', {
			configurable: true,
			writable: true,
			value: (event: string, ...args: unknown[]) =>
				this.promisifyOnce(emitter, event, ...normalizeAdditionalArgs(args))
		});

		const wrapOff = (originalMethod: Nullable<Function>) => (link: any, ...args: any[]) => {
			if (link != null && typeof link !== 'object' || args.length > 0) {
				args = args.map((val) => links.get(val) ?? val);
				return Object.isFunction(originalMethod) ? originalMethod.call(emitter, link, ...args) : null;
			}

			return this.off(link);
		};

		Object.defineProperty(wrappedEmitter, 'off', {
			configurable: true,
			writable: true,
			value: wrapOff(emitter.off)
		});

		Object.defineProperty(wrappedEmitter, 'removeEventListener', {
			configurable: true,
			writable: true,
			value: wrapOff(emitter.removeEventListener)
		});

		Object.defineProperty(wrappedEmitter, 'removeListener', {
			configurable: true,
			writable: true,
			value: wrapOff(emitter.removeListener)
		});

		Object.defineProperty(wrappedEmitter, 'emit', {
			configurable: true,
			writable: true,
			value: (event: string, ...args: unknown[]) => {
				for (const key of emitLikeEvents) {
					const property = emitter[key];

					if (Object.isFunction(property)) {
						return property.call(emitter, event, ...args);
					}
				}
			}
		});

		return wrappedEmitter;

		function normalizeAdditionalArgs(params: unknown[]): unknown[] {
			if (Object.isPlainObject(params[0])) {
				const
					ownParam = Object.reject(params[0], asyncOptionsKeys),
					asyncParam = Object.select(params[0], asyncOptionsKeys);

				return [
					{
						...asyncParam,
						group: [opts?.group, asyncParam.group].filter(Boolean).join(':')
					},

					ownParam,
					...params.slice(1)
				];
			}

			return [opts?.group != null ? {group: opts.group} : {}, ...params];
		}
	}

	/**
	 * The wrapper takes a link to the "raw" asynchronous storage and returns a new object based on the original,
	 * but all asynchronous methods and properties are wrapped by Async.
	 *
	 * Note that the wrapped methods can take additional Async parameters, such as `group` or `label`.
	 *
	 * @param storage
	 * @param opts
	 *
	 * @example
	 * ```js
	 * import Async from 'core/async';
	 * import { asyncLocal } from 'core/kv-storage';
	 *
	 * const
	 *   $a = new Async(),
	 *   wrappedStorage = $a.wrapStorage(asyncLocal, {group: 'bar'});
	 *
	 * wrappedStorage.set('someKey', 'someValue', {
	 *   // If we provide a group to the method, it will be joined with the global group using the ":" character
	 *   group: 'bla',
	 *   label: 'foo',
	 *   join: true,
	 * }).then(async () => {
	 *   console.log(await wrappedStorage.get('someKey') === 'someValue');
	 * });
	 *
	 * $a.suspendAll({group: 'bar:bla'});
	 *
	 * // We can provide our own global group to the namespace, and it will be joined with the parent's global group
	 * const blaStore = wrappedStorage.namespace('[[BLA]]', {group: 'bla'});
	 *
	 * blaStore.clear({group: 'foo'});
	 *
	 * $a.muteAll({group: 'bar:bla:foo'});
	 * ```
	 */
	wrapStorage<T extends AsyncStorage | AsyncStorageNamespace>(
		storage: T,
		opts?: AsyncOptionsForWrappers
	): T extends AsyncStorage ? WrappedAsyncStorage : WrappedAsyncStorageNamespace {
		const
			globalGroup = opts?.group,
			wrappedStorage = Object.create(storage);

		Object.defineProperty(wrappedStorage, 'has', {
			configurable: true,
			writable: true,
			value: (key: string, ...args: unknown[]) => {
				const [asyncOpts, params] = separateArgs(args);
				return this.promise(storage.has(key, ...params), asyncOpts);
			}
		});

		Object.defineProperty(wrappedStorage, 'get', {
			configurable: true,
			writable: true,
			value: (key: string, ...args: unknown[]) => {
				const [asyncOpts, params] = separateArgs(args);
				return this.promise(storage.get<T>(key, ...params), asyncOpts);
			}
		});

		Object.defineProperty(wrappedStorage, 'set', {
			configurable: true,
			writable: true,
			value: (key: string, value: unknown, ...args: unknown[]) => {
				const [asyncOpts, params] = separateArgs(args);
				return this.promise(storage.set(key, value, ...params), asyncOpts);
			}
		});

		Object.defineProperty(wrappedStorage, 'remove', {
			configurable: true,
			writable: true,
			value: (key: string, ...args: unknown[]) => {
				const [asyncOpts, params] = separateArgs(args);
				return this.promise(storage.remove(key, ...params), asyncOpts);
			}
		});

		Object.defineProperty(wrappedStorage, 'clear', {
			configurable: true,
			writable: true,
			value: (filter?: ClearFilter<T>, ...args: unknown[]) => {
				if (Object.isPlainObject(filter)) {
					filter = undefined;
					args = [filter];
				}

				const [asyncOpts, params] = separateArgs(args);
				return this.promise(storage.clear<T>(filter, ...params), asyncOpts);
			}
		});

		if ('namespace' in storage) {
			Object.defineProperty(wrappedStorage, 'namespace', {
				configurable: true,
				writable: true,
				value: (namespace: string, opts?: AsyncOptionsForWrappers) => {
					const [asyncOpts] = separateArgs([opts]);
					const storageNamespace = storage.namespace(namespace);
					return this.wrapStorage(storageNamespace, asyncOpts);
				}
			});
		}

		return wrappedStorage;

		function separateArgs(args: unknown[]): [AsyncOptions, unknown[]] {
			const lastArg = args.pop();

			if (!Object.isDictionary(lastArg)) {
				return [globalGroup != null ? {group: globalGroup} : {}, [...args, lastArg]];
			}

			const
				ownParams = Object.reject(lastArg, asyncOptionsKeys),
				asyncParams = Object.select(lastArg, asyncOptionsKeys),
				group = [globalGroup, asyncParams.group].filter(Boolean).join(':');

			if (group !== '') {
				asyncParams.group = group;
			}

			if (Object.keys(ownParams).length !== 0) {
				args.push(ownParams);
			}

			return [asyncParams, args];
		}
	}
}
