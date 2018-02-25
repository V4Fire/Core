/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

// tslint:disable:no-var-requires comment-format

import { IS_NODE } from 'core/const/links';

let
	transport;

// tslint:disable-next-line
if (IS_NODE) {
	//#if node_js
	transport = require('core/request/engines/node');
	//#endif

} else {
	transport = require('core/request/engines/browser');
}

export default transport;
