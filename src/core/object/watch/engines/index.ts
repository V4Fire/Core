/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as proxyEngine from '~/core/object/watch/engines/proxy';
import * as accEngine from '~/core/object/watch/engines/accessors';

export default typeof Proxy === 'function' ? proxyEngine : accEngine;
