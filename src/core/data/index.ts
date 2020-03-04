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

import DefaultProvider from 'core/data/modules/base';

import { provider } from 'core/data/decorators';
import { attachMock } from 'core/data/middlewares';
import { Middlewares } from 'core/request';

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
	/** @override */
	static readonly middlewares: Middlewares = {
		attachMock
	};
}
