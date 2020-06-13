/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';
import { notImplement } from 'core/functools/not-implemented';

import Response from 'core/request/response';
import { RequestEngine } from 'core/request/interface';

/**
 * Creates request by using node.js with the specified parameters and returns a promise
 * @param params
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
const request: RequestEngine = (params) => {
	notImplement({type: 'function', name: 'Request engine for Node.js'});
	return Then.resolve(new Response());
};

export default request;
