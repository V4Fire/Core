/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Then from 'core/then';
import type { Provider, ModelMethod } from 'core/data';

import type {

	OkStatuses,

	RequestBody,
	RequestMethod,
	RequestQuery

} from 'core/request';

/**
 * Meta parameters for the engine
 */
export interface Meta extends Dictionary {
	provider?: Provider;
	providerMethod?: ModelMethod;
}

/**
 * Available options to request with the engine
 */
export interface AvailableOptions {
	url: string;
	method: RequestMethod;
	contentType?: string;
	body?: RequestBody;
	query: RequestQuery;
	headers: Dictionary<CanArray<unknown>>;
	okStatuses?: OkStatuses;
	timeout?: number;
	externalRequest?: boolean;
	important?: boolean;
	meta: Meta;
	parent?: Then;
}

/**
 * Mapping of methods to request for the engine
 */
export type MethodsMapping =
	{[key in ModelMethod]?: ModelMethod} &
	{[key in RequestMethod]?: ModelMethod};
