import type { AsyncOptions } from 'core/async/modules/events';

import type { CreateRequestOptions, RequestQuery, RequestResponseObject, RequestBody } from 'core/request';

import type { Provider } from 'core/data/interface';

import type Async from 'core/async';
import type {

	AsyncOnOptions,
	AsyncOnceOptions,
	ClearOptionsId,

	ProxyCb,
	EventEmitterLike as AsyncEventEmitterLike

} from 'core/async';

export type MethodsToReplace = QueryMethodsToReplace | BodyMethodsToReplace;

export type QueryMethodsToReplace = 'get' | 'peek';

export type BodyMethodsToReplace = 'post' | 'add' | 'upd' | 'del';

export type WrappedProvider = Overwrite<Provider, {
	/**
	 * @see [[AsyncEventEmitterLike]]
	 */
	emitter: AsyncEventEmitterLike;

	/**
	 * @see [[Provider.get]]
	 *
	 * @param [opts] - additional request options with async options
	 */
	get<D = unknown>
		(query?: RequestQuery, opts?: CreateRequestOptions<D> & AsyncOptions): Promise<RequestResponseObject<D>>;

	/**
	 * @see [[Provider.peek]]
	 *
	 * @param [opts] - additional request options with async options
	 */
	peek<D = unknown>
		(query?: RequestQuery, opts?: CreateRequestOptions<D> & AsyncOptions): Promise<RequestResponseObject<D>>;

	/**
	 * @see [[Provider.post]]
	 *
	 * @param [opts] - additional request options with async options
	 */
	post<D = unknown>
		(body?: RequestBody, opts?: CreateRequestOptions<D> & AsyncOptions): Promise<RequestResponseObject<D>>;

	/**
	 * @see [[Provider.add]]
	 *
	 * @param [opts] - additional request options with async options
	 */
	add<D = unknown>
		(body?: RequestBody, opts?: CreateRequestOptions<D> & AsyncOptions): Promise<RequestResponseObject<D>>;

	/**
	 * @see [[Provider.add]]
	 *
	 * @param [opts] - additional request options with async options
	 */
	upd<D = unknown>
		(body?: RequestBody, opts?: CreateRequestOptions<D> & AsyncOptions): Promise<RequestResponseObject<D>>;

	/**
	 * @see [[Provider.add]]
	 *
	 * @param [opts] - additional request options with async options
	 */
	del<D = unknown>
		(body?: RequestBody, opts?: CreateRequestOptions<D> & AsyncOptions): Promise<RequestResponseObject<D>>;
}>;

export type EmitLikeEvents = 'emit' | 'fire' | 'dispatch' | 'dispatchEvent';

export type EventEmitterLike = {
	[key in EmitLikeEvents]?: Function
} & AsyncEventEmitterLike;

export interface ReadonlyEventEmitterWrapper<CTX extends object = Async> {
	on<E = unknown, R = unknown>(
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		...args: unknown[]
	): object;

	on<E = unknown, R = unknown>(
		events: CanArray<string>,
		handler: ProxyCb<E, R, CTX>,
		params: AsyncOnOptions<CTX>,
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
		params: AsyncOnceOptions<CTX>,
		...args: unknown[]
	): object;

	promisifyOnce<T = unknown>(events: CanArray<string>, ...args: unknown[]): Promise<CanUndef<T>>;
	promisifyOnce<T = unknown>(
		events: CanArray<string>,
		params: AsyncOnceOptions<CTX>,
		...args: unknown[]
	): Promise<CanUndef<T>>;

	off(id?: object): void;
	off(params: ClearOptionsId<object>): void;
}

export interface EventEmitterWrapper<CTX extends object = Async> extends ReadonlyEventEmitterWrapper<CTX> {
	emit(event: string, ...args: unknown[]): boolean;
}

type mapNotPrimitive<T, A> = T extends Primitive ? T : T & A ;

type addEventListenerLikeFunctionMapper<T extends (...args: unknown[]) => unknown> =
	(
		arg0: Parameters<T>[0],
		arg1: Parameters<T>[1],
		arg2: mapNotPrimitive<Parameters<T>[2], AsyncOptions>,
		...args: unknown[]
	) => unknown;

export type EventEmitterOverwrited<T extends EventEmitterLike> = Overwrite<T, {
	addEventListener:
		T['addEventListener'] extends (...args: any[]) => any
			? addEventListenerLikeFunctionMapper<T['addEventListener']>
			: never;
	addListener:
		T['addListener'] extends (...args: any[]) => any
			? addEventListenerLikeFunctionMapper<T['addListener']>
			: never;
}>;
