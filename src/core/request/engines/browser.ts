/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Fetch from '~/core/request/engines/fetch';
import XHR from '~/core/request/engines/xhr';

export default typeof AbortController !== 'undefined' ? Fetch : XHR;
