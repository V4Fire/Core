/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';
import Response from 'core/request/response';
import { RequestEngine } from 'core/request/interface';

/**
 * Creates request using node.js with the specified parameters and returns a promise
 * @param params
 */
// tslint:disable-next-line
const request: RequestEngine = (params) => {
	// TODO: implement for node.js
	return Then.resolve(new Response());
};

export default request;
