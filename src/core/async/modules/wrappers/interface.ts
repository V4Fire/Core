import type { Provider } from 'core/data';
import type { CreateRequestOptions, RequestQuery, RequestResponseObject, RequestBody } from 'core/request';

import type Async from 'core/async';
import type { AsyncOptions, ClearOptionsId, ProxyCb, EventEmitterLike } from 'core/async';

import type { ClearFilter } from 'core/kv-storage';

export type DataProviderQueryMethodsToReplace = 'get' | 'peek';
export type DataProviderBodyMethodsToReplace = 'post' | 'add' | 'upd' | 'del';
export type DataProviderMethodsToReplace = DataProviderQueryMethodsToReplace | DataProviderBodyMethodsToReplace;

export type WrappedDataProvider = Overwrite<Provider, {
	/** @see [[Provider.emitter]] */
	emitter: EventEmitterLike;

	/** @see [[Provider.get]] */
	get<D = unknown>(
		query?: RequestQuery,
		opts?: CreateRequestOptions<D> & AsyncOptions
	): Promise<RequestResponseObject<D>>;

	/** @see [[Provider.peek]] */
	peek<D = unknown>(
		query?: RequestQuery,
		opts?: CreateRequestOptions<D> & AsyncOptions
	): Promise<RequestResponseObject<D>>;

	/** @see [[Provider.post]] */
	post<D = unknown>(
		body?: RequestBody,
		opts?: CreateRequestOptions<D> & AsyncOptions
	): Promise<RequestResponseObject<D>>;

	/** @see [[Provider.add]] */
	add<D = unknown>(
		body?: RequestBody,
		opts?: CreateRequestOptions<D> & AsyncOptions
	): Promise<RequestResponseObject<D>>;

	/** @see [[Provider.upd]] */
	upd<D = unknown>(
		body?: RequestBody,
		opts?: CreateRequestOptions<D> & AsyncOptions
	): Promise<RequestResponseObject<D>>;

	/**  @see [[Provider.del]] */
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

export interface WrappedAsyncStorage {
	/** @see [[AsyncStorage.has]] */
	has(key: string, ...args: unknown[]): Promise<boolean>;
	has(key: string, opts?: AsyncOptions, ...args: unknown[]): Promise<boolean>;

	/** @see [[AsyncStorage.get]] */
	get<T = unknown>(key: string, ...args: unknown[]): Promise<CanUndef<T>>;
	get<T = unknown>(key: string, opts?: AsyncOptions, ...args: unknown[]): Promise<CanUndef<T>>;

	/** @see [[AsyncStorage.set]] */
	set(key: string, value: unknown, ...args: unknown[]): Promise<void>;
	set(key: string, value: unknown, opts?: AsyncOptions, ...args: unknown[]): Promise<void>;

	/** @see [[AsyncStorage.remove]] */
	remove(key: string, ...args: unknown[]): Promise<void>;
	remove(key: string, opts?: AsyncOptions, ...args: unknown[]): Promise<void>;

	/** @see [[AsyncStorage.clear]] */
	clear<T = unknown>(filter?: ClearFilter<T>, ...args: unknown[]): Promise<void>;
	clear<T = unknown>(filter?: ClearFilter<T>, opts?: unknown[], ...args: unknown[]): Promise<void>;

	/** @see [[AsyncStorage.namespace]] */
	namespace(name: string): WrappedAsyncStorage;
	namespace(name: string, opts: AsyncOptionsForWrappers): WrappedAsyncStorage;
}
