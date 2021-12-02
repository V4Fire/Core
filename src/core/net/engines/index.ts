/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { IS_NODE } from '~/core/env';

// eslint-disable-next-line import/no-mutable-exports
export let
	isOnline;

if (IS_NODE) {
	//#if node_js
	({isOnline} =
		require('core/net/engines/node.request'));
	//#endif

} else {
	({isOnline} =
		require('core/net/engines/browser.request'));
}
