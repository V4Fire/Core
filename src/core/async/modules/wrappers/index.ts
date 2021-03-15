/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/async/modules/data-providers/README.md]]
 * @packageDocumentation
 */

import Super, { AsyncOptions } from 'core/async/modules/events';

import { emitLikeEvents, methodsToReplace, asyncParamsKeys } from 'core/async/modules/wrappers/consts';

import type { CreateRequestOptions, RequestQuery, RequestBody } from 'core/request';
import type { Provider } from 'core/data/interface';
import type {

	WrappedProvider,
	MethodsToReplace,
	QueryMethodsToReplace,

	EventEmitterLike,
	EventEmitterWrapper,
	EventEmitterOverwrited

} from 'core/async/modules/wrappers/interface';

export * from 'core/async/modules/events';

export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
	/**
	 * The wrapper takes a link to the "raw" data provider and returns a new object that based
	 * on the original, but all async methods and properties are wrapped by Async.
	 * Notice, the wrapped methods can take additional Async parameters, like group or label.
	 *
	 * @param provider
	 * @param [opts] - group for async methods
	 *
	 * @example
	 * ```typescript
	 * // If group not provided use class name as default group
	 * const dp = new Async().wrapDataProvider(new Provider(), {group: 'example'});
	 *
	 * // Async options `{group: 'example'}`
	 * dp.method('POST').get('foo');
	 *
	 * // Async options `{group: 'example:inner', label: 'label'}`
	 * dp.method('POST').get('foo', {group: 'inner', label: 'label'});
	 * ```
	 */
	wrapDataProvider<P extends Provider, W extends WrappedProvider>(provider: P, opts?: Pick<AsyncOptions, 'group'>):W {
		const
			wrappedProvider: W = Object.create(provider),
			wrappedProviderGroup = opts?.group ?? provider.providerName;

		for (let i = 0; i < methodsToReplace.length; i++) {
			const methodName = methodsToReplace[i];
			const newMethod =
				<D = unknown>(body?: RequestBody | RequestQuery, opts?: CreateRequestOptions<D> & AsyncOptions) => {
					const
						ownParams = Object.reject(opts, asyncParamsKeys),
						asyncParams = Object.select(opts, asyncParamsKeys),
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
				};

			wrappedProvider[methodName] = newMethod;
		}

		wrappedProvider.emitter = this.wrapEventEmitter(provider.emitter, opts);
		return wrappedProvider;

		function isQueryMethod(name: MethodsToReplace): name is QueryMethodsToReplace {
			return ['get', 'peek'].includes(name);
		}
	}

	/**
	 * The wrapper takes a link to the "raw" event emitter and returns a new object that based
	 * on the original, but all async methods and properties are wrapped by Async.
	 * Notice, the wrapped methods can take additional Async parameters, like group or label.
	 * In addition, the wrapper adds new methods, like "on" or "off", to make the emitter API more standard.
	 *
	 * @param emitter
	 * @param [opts] - group for async methods
	 *
	 * @example
	 * ```typescript
	 * const wrappedEventEmitter = new Async().wrapEventEmitter(window, {group: 'example'});
	 *
	 * // Emit call all emit-like events 'emit' | 'fire' | 'dispatch' | 'dispatchEvent' on original emitter
	 * wrappedEventEmitter.emit('scroll');
	 *
	 * const handler = () => null;
	 *
	 * // Async options will be {group: 'example:inner'}
	 * wrappedEventEmitter.addEventListener('scroll', handler, {group: 'inner'});
	 *
	 * // Async options will be {group: 'example'}
	 * wrappedEventEmitter.on('scroll', handler);
	 * ```
	 */
	wrapEventEmitter<T extends EventEmitterLike>(
		emitter: T,
		opts?: Pick<AsyncOptions, 'group'>
	): (EventEmitterOverwrited<T> & EventEmitterWrapper) {
		const wrappedEmitter = Object.create(emitter);

		/**
		 * Separates the first parameter on async param and function param
		 *
		 * @param params params to normalize
		 */
		const paramsNormalizer = (params: unknown[]): unknown[] => {
			if (Object.isPlainObject(params[0])) {
				const
					ownParam = Object.reject(params[0], asyncParamsKeys),
					asyncParam = Object.select(params[0], asyncParamsKeys);

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
		};

		wrappedEmitter.on = (event, fn, ...params) => {
			if (!Object.isFunction(fn)) {
				throw new TypeError('Wrapped emitters methods `on, addEventListener, addListener` accept only function as second parameter');
			}

			return this.on(emitter, event, fn, ...paramsNormalizer(params));
		};

		wrappedEmitter.addEventListener = wrappedEmitter.on;
		wrappedEmitter.addListener = wrappedEmitter.on;

		wrappedEmitter.once =
			(event, fn, ...params) => this.once(emitter, event, fn, ...paramsNormalizer(params));

		wrappedEmitter.promisifyOnce =
			(event, ...params) => this.promisifyOnce(emitter, event, ...paramsNormalizer(params));

		/**
		 * Wrapper return control to original function if params unvalid for off method
		 *
		 * @param originalMethod original function
		 */
		const offWrapper = (originalMethod) => (link, ...args) => {
				if (link == null || typeof link !== 'object' || args.length > 0) {
					return Object.isFunction(originalMethod) ? originalMethod.call(emitter, link, ...args) : null;
				}

				return this.off(link);
			};

		wrappedEmitter.off = offWrapper(emitter.off);
		wrappedEmitter.removeEventListener = offWrapper(emitter.removeEventListener);
		wrappedEmitter.removeListener = offWrapper(emitter.removeListener);

		wrappedEmitter.emit = (event, ...args) => {
			for (let i = 0; i < emitLikeEvents.length; i++) {
				const
					key = emitLikeEvents[i];

				const property = emitter[key];
				if (Object.isFunction(property)) {
					return property.call(emitter, event, ...args);
				}
			}
		};

		return wrappedEmitter;
	}
}
