/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/data/README.md]]
 * @packageDocumentation
 */

//#set runtime.core/data

import type { Middlewares, RequestPromise, RequestResponse } from 'core/request';

import DefaultProvider from 'core/data/modules/base';

import { provider } from 'core/data/decorators';
import { attachMock } from 'core/data/middlewares';

import type { ProviderOptions } from 'core/data/interface';

export * from 'core/data/const';
export * from 'core/data/decorators';
export * from 'core/data/middlewares';
export * from 'core/data/interface';

export { Socket } from 'core/socket';

export {

	globalOpts,

	CreateRequestOptions,
	CacheStrategy,
	RequestQuery,
	RequestMethod,

	Middlewares,
	MiddlewareParams,

	RequestPromise,
	RequestResponse,
	RequestResponseObject,
	RequestFunctionResponse,

	Response,
	RequestBody,
	RequestError

} from 'core/request';

/**
 * Default data provider
 */
@provider
export default class Provider extends DefaultProvider {
	static override readonly middlewares: Middlewares = {
		attachMock
	};

	/**
	 * Borrows API from the specified `RequestPromise` object to the passed `RequestResponse` object and returns it
	 *
	 * @param from
	 * @param to
	 */
	static borrowRequestPromiseAPI<T>(from: RequestPromise<T>, to: RequestResponse<T>): RequestPromise<T> {
		const res = <RequestPromise<T>>to;

		res.emitter = from.emitter;

		void Object.defineProperty(res, 'data', {
			enumerable: true,
			configurable: true,
			get: () => from.data
		});

		void Object.defineProperty(res, 'stream', {
			enumerable: true,
			configurable: true,
			get: () => from.stream
		});

		res[Symbol.asyncIterator] = from[Symbol.asyncIterator].bind(from);

		return res;
	}

	/** @override */
	public constructor(opts?: ProviderOptions) {
		super(opts);
	}
}
