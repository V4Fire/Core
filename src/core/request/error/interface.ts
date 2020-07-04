/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

//#if node_js
import Response from 'core/request/response';
//#endif

import { NormalizedCreateRequestOptions } from 'core/request/interface';

export interface Details<D = unknown> extends Dictionary {
	request?: NormalizedCreateRequestOptions<D>;
	response?: Response<D>;
	error?: object;
}
