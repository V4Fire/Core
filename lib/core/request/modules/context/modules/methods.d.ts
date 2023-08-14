/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import Super from '../../../../../core/request/modules/context/modules/params';
export default class RequestContext<D = unknown> extends Super<D> {
    /**
     * Generates a string cache key for specified URL and returns it
     * @param url
     */
    getRequestKey(url: string): string;
    /**
     * Returns an absolute URL for the request API
     * @param [apiURL] - base API URL
     */
    resolveAPI(apiURL?: Nullable<string>): string;
    /**
     * Resolves request parameters and returns an absolute URL for the request
     * @param [url] - base request URL
     */
    resolveRequest(url?: Nullable<string>): string;
    /**
     * Returns an absolute URL for the request
     *
     * @see [[RequestContext.resolveRequest]]
     * @param [url] - base request URL
     */
    resolveURL(url?: Nullable<string>): string;
    /**
     * Drops the request cache
     */
    dropCache(): void;
}
