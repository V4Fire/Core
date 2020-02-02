/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Range from 'core/range';
import { ResponseType } from 'core/request';

export const defaultResponseOpts = {
	responseType: <ResponseType>'text',
	okStatuses: new Range(200, 299),
	status: 200,
	headers: {}
};
