/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { NormalizedCreateRequestOptions } from '../../../core/request/interface';
/**
 * Truncates all static cache storage-s
 */
export declare function dropCache(): void;
/**
 * Generates a string cache key for the specified parameters and returns it
 *
 * @param url - request url
 * @param [params] - request parameters
 */
export declare function getRequestKey<T>(url: string, params?: NormalizedCreateRequestOptions<T>): string;
