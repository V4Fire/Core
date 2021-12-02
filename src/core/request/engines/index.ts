/* eslint-disable @typescript-eslint/no-var-requires */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { IS_NODE } from '@src/core/env';

// eslint-disable-next-line import/no-mutable-exports
let transport;

if (IS_NODE) {
	//#if node_js
	transport = require('@src/core/request/engines/node').default;
	//#endif

} else {
	transport = require('@src/core/request/engines/browser').default;
}

export default transport;
