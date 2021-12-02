/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type AbortablePromise from '@src/core/promise/abortable';
import type { Provider, ModelMethod } from '@src/core/data';

import type {

	OkStatuses,

	RequestBody,
	RequestMethod,
	RequestQuery

} from '@src/core/request';

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
	important?: boolean;
	meta: Meta;
	parent?: AbortablePromise;
}

/**
 * Mapping of methods to request for the engine
 */
export type MethodsMapping =
	{[key in ModelMethod]?: ModelMethod} &
	{[key in RequestMethod]?: ModelMethod};
