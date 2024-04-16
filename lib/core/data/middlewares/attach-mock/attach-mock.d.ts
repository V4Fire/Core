/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import Provider from '../../../../core/data';
import { MiddlewareParams } from '../../../../core/request';
/**
 * Middleware: attaches mock data from the `mocks` property of the data provider instance
 * @param params
 */
export declare function attachMock(this: Provider, params: MiddlewareParams): Promise<CanUndef<Function>>;
