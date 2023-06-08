/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Provider } from 'core/data';
import type { CreateRequestOptions, RequestQuery, RequestResponseObject, RequestBody } from 'core/request';

import type Async from 'core/async';
import type { AsyncOptions, ClearOptionsId, ProxyCb, EventEmitterLike } from 'core/async';

import type { ClearFilter } from 'core/kv-storage';

export type DataProviderQueryMethodsToReplace = 'get' | 'peek';
export type DataProviderBodyMethodsToReplace = 'post' | 'add' | 'update' | 'delete';
export type DataProviderMethodsToReplace = DataProviderQueryMethodsToReplace | DataProviderBodyMethodsToReplace;

export type WrappedDataProvider = Overwrite<Provider, {
	/** {@link Provider.emitter} */
	emitter: EventEmitterLike;

	/** {@link Provider.get} */
	get<D = unknown>(
		query?: RequestQuery,
		opts?: CreateRequestOptions<D> & AsyncOptions
	): Promise<RequestResponseObject<D>>;

	/** {@link Provider.peek} */
	peek<D = unknown>(
		query?: RequestQuery,
		opts?: CreateRequestOptions<D> & AsyncOptions
	): Promise<RequestResponseObject<D>>;

	/** {@link Provider.post} */
	post<D = unknown>(
		body?: RequestBody,
		opts?: CreateRequestOptions<D> & AsyncOptions
	): Promise<RequestResponseObject<D>>;

	/** {@link Provider.add} */
	add<D = unknown>(
		body?: RequestBody,
		opts?: CreateRequestOptions<D> & AsyncOptions
	): Promise<RequestResponseObject<D>>;

	/** {@link Provider.upd} */
	upd<D = unknown>(
		body?: RequestBody,
		opts?: CreateRequestOptions<D> & AsyncOptions
	): Promise<RequestResponseObject<D>>;

	/**  {@link Provider.del} */
	del<D = unknown>(
		body?: RequestBody,
		opts?: CreateRequestOptions<D> & AsyncOptions
	): Promise<RequestResponseObject<D>>;
}>;

export interface ReadonlyEventEmitterWrapper<CTX extends object = Async> {
	on<E = unknown, R = unknown>(
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		...args: unknown[]
	): object;

	on<E = unknown, R = unknown>(
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		params: AsyncOptions,
		...args: unknown[]
	): object;

	once<E = unknown, R = unknown>(
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		...args: unknown[]
	): object;

	once<E = unknown, R = unknown>(
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		params: AsyncOptions,
		...args: unknown[]
	): object;

	promisifyOnce<T = unknown>(events: CanArray<string>, ...args: unknown[]): Promise<CanUndef<T>>;
	promisifyOnce<T = unknown>(
		events: CanArray<string>,
		params: AsyncOptions,
		...args: unknown[]
	): Promise<CanUndef<T>>;

	off(id?: object): void;
	off(params: ClearOptionsId<object>): void;
}

export interface EventEmitterWrapper<CTX extends object = Async> extends ReadonlyEventEmitterWrapper<CTX> {
	emit(event: string, ...args: unknown[]): boolean;
}

type MapNotPrimitive<T, A> = T extends Primitive ? T : T & A;

type AddEventListenerLikeFunctionMapper<T extends (...args: unknown[]) => unknown> =
	(
		arg0: Parameters<T>[0],
		arg1: Parameters<T>[1],
		arg2: MapNotPrimitive<Parameters<T>[2], AsyncOptions>,
		...args: unknown[]
	) => unknown;

export type EventEmitterOverwritten<T extends EventEmitterLike> = Overwrite<T, {
	addEventListener:
		T['addEventListener'] extends (...args: any[]) => any
			? AddEventListenerLikeFunctionMapper<T['addEventListener']>
			: never;

	addListener:
		T['addListener'] extends (...args: any[]) => any
			? AddEventListenerLikeFunctionMapper<T['addListener']>
			: never;
}>;

export type AsyncOptionsForWrappers = Pick<AsyncOptions, 'group'>;

export interface WrappedAsyncStorageNamespace {
	/** {@link AsyncStorage.has} */
	has(key: string, opts?: AsyncOptions): Promise<boolean>;
	has(key: string, ...args: unknown[]): Promise<boolean>;

	/** {@link AsyncStorage.get} */
	get<T = unknown>(key: string, opts?: AsyncOptions): Promise<CanUndef<T>>;
	get<T = unknown>(key: string, ...args: unknown[]): Promise<CanUndef<T>>;

	/** {@link AsyncStorage.set} */
	set(key: string, value: unknown, opts?: AsyncOptions): Promise<void>;
	set(key: string, value: unknown, ...args: unknown[]): Promise<void>;

	/** {@link AsyncStorage.remove} */
	remove(key: string, opts?: AsyncOptions): Promise<void>;
	remove(key: string, ...args: unknown[]): Promise<void>;

	/** {@link AsyncStorage.clear} */
	clear<T = unknown>(filter?: ClearFilter<T>, opts?: unknown[]): Promise<void>;
	clear<T = unknown>(filter?: ClearFilter<T>, ...args: unknown[]): Promise<void>;
}

export interface WrappedAsyncStorage extends WrappedAsyncStorageNamespace {
	/** {@link AsyncStorage.namespace} */
	namespace(name: string, opts?: AsyncOptionsForWrappers): WrappedAsyncStorageNamespace;
}
