/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { IS_NODE } from '@src/core/env';

// eslint-disable-next-line import/no-mutable-exports
export let
	serialize;

if (IS_NODE) {
	//#if node_js
	({serialize} =
		require('@src/core/xml/engines/node'));
	//#endif

} else {
	({serialize} =
		require('@src/core/xml/engines/browser'));
}
