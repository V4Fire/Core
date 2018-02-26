/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { GlobalOptions, RequestContext } from 'core/request/interface';

/**
 * Configures transport options
 * (can return a new promise)
 *
 * @param ctx - link for a request context
 * @param opts - link for the global request options
 */
export default async function <T>(ctx: RequestContext<T>, opts: GlobalOptions): Promise<(() => T) | void> {
	return undefined;
}
