/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Response from '~/core/request/response';
import type { NormalizedCreateRequestOptions } from '~/core/request/interface';

export interface Details<D = unknown> extends Dictionary {
	request?: NormalizedCreateRequestOptions<D>;
	response?: Response<D>;
	error?: object;
}

export interface RequestErrorDetailsExtractorSettings {
	headers: {
		include?: string[];
		exclude?: string[];
	};
}
