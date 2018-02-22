/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { IS_NODE } from 'core/const/links';
import createBrowserTransport from 'core/transport/engines/browser';

let transport;

// tslint:disable

if (IS_NODE) {
	//#if node_js
	transport = require('got');
	//#endif

// tslint:enable

} else {
	transport = createBrowserTransport;
}

export default transport;
