/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* eslint-disable @typescript-eslint/no-var-requires */

import { IS_NODE } from 'core/env';

// eslint-disable-next-line import/no-mutable-exports
let transport;

if (IS_NODE) {
	//#if node_js
	transport = require('core/request/engines/node').default;
	//#endif

} else {
	transport = require('core/request/engines/browser').default;
}

export default transport;

export * from 'core/request/engines/const';
export * from 'core/request/engines/helpers';
