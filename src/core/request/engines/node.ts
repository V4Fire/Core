/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';
import Response from 'core/request/response';
import { RequestOpts } from 'core/request/interface';

/**
 * Creates request by node.js with the specified parameters and returns a promise
 * @param params
 */
export default function createTransport(params: RequestOpts): Then<Response> {
	// TODO: implement for node.js
	return Then.resolve(new Response());
}
