/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import {

	OkStatuses,

	RequestBody,
	RequestMethod,
	RequestQuery

} from 'core/request';
import type { ModelMethod } from 'core/data';
import Then from 'core/then';

/**
 *
 */
export interface AvailableOptions {
	readonly url: string;
	readonly method: RequestMethod;
	readonly contentType?: string;
	readonly body?: RequestBody;
	readonly query: RequestQuery;
	readonly headers: Dictionary<CanArray<unknown>>;
	readonly okStatuses?: OkStatuses;
	readonly timeout?: number;
	readonly externalRequest?: boolean;
	readonly important?: boolean;
	readonly meta: Dictionary;

	parent?: Then;
}

export type MethodsMapping = {
	[key in ModelMethod]: ModelMethod
};
