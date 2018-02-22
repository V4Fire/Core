/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import StatusCodes from 'core/statusCodes';
import { RequestMethods, ResponseTypes } from 'core/transport/interface';
export { asyncLocal as storage } from 'core/kv-storage';

export const defaultRequestOpts = {
	method: <RequestMethods>'GET',
	responseType: <ResponseTypes>'json',
	headers: {},
	body: null
};

export const defaultResponseOpts = {
	type: <ResponseTypes>'text',
	status: StatusCodes.OK,
	headers: {}
};
