/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Provider, ModelMethod } from 'core/data';
import type Then from 'core/then';

import {

	OkStatuses,

	RequestBody,
	RequestMethod,
	RequestQuery

} from 'core/request';

/**
 * Meta params for engine
 */
export interface Meta extends Dictionary {
	provider?: CanUndef<Provider>;
	providerMethod?: CanUndef<ModelMethod>;
}

/**
 * Available options to request with a data provider engine
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
 * Mapping of current to source data provider or request methods
 */
export type MethodsMapping =
	{[key in ModelMethod]?: ModelMethod} &
	{[key in RequestMethod]?: ModelMethod};
