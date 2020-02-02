/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

//#if runtime has core/request/response
import Response from 'core/request/response';
//#endif

export interface Details extends Dictionary {
	response?: Response;
}
