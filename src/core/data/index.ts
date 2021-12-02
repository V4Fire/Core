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

import type { Middlewares } from '@src/core/request';

import DefaultProvider from '@src/core/data/modules/base';

import { provider } from '@src/core/data/decorators';
import { attachMock } from '@src/core/data/middlewares';

import type { ProviderOptions } from '@src/core/data/interface';

export * from '@src/core/data/const';
export * from '@src/core/data/decorators';
export * from '@src/core/data/middlewares';
export * from '@src/core/data/interface';

export { Socket } from '@src/core/socket';

export {

	globalOpts,

	CreateRequestOptions,
	CacheStrategy,
	RequestQuery,
	RequestMethod,

	Middlewares,
	MiddlewareParams,

	RequestResponse,
	RequestResponseObject,
	RequestFunctionResponse,

	Response,
	RequestBody,
	RequestError

} from '@src/core/request';

/**
 * Default data provider
 */
@provider
export default class Provider extends DefaultProvider {
	static override readonly middlewares: Middlewares = {
		attachMock
	};

	/** @override */
	public constructor(opts?: ProviderOptions) {
		super(opts);
	}
}
