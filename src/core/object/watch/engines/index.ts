/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import * as proxyEngine from '@src/core/object/watch/engines/proxy';
import * as accEngine from '@src/core/object/watch/engines/accessors';

export default typeof Proxy === 'function' ? proxyEngine : accEngine;
