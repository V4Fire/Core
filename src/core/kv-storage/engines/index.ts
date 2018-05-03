/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

// tslint:disable:no-var-requires comment-format

import { IS_NODE } from 'core/const/links';

// tslint:disable-next-line
if (IS_NODE) {
	//#if node_js
	module.exports = require('core/kv-storage/engines/node.localstorage');
	//#endif

} else {
	module.exports = require('core/kv-storage/engines/browser.localstorage');
}
