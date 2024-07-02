/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type AbortablePromise from '../../../../core/promise/abortable';
import type { Provider, ModelMethod } from '../../../../core/data';
import type { Statuses, RequestBody, RequestMethod, RequestQuery } from '../../../../core/request';
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
    headers: Dictionary<CanArray<unknown>>;
    query: RequestQuery;
    body?: RequestBody;
    timeout?: number;
    contentType?: string;
    okStatuses?: Statuses;
    noContentStatuses?: Statuses;
    meta: Meta;
    important?: boolean;
    parent?: AbortablePromise;
}
/**
 * Mapping of methods to request for the engine
 */
export declare type MethodsMapping = {
    [key in ModelMethod]?: ModelMethod;
} & {
    [key in RequestMethod]?: ModelMethod;
};
