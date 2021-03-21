/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { PersistentOptions } from 'core/log/middlewares/configurable/interface';

export const DEFAULT_OPTIONS: PersistentOptions = {
	patterns: [':error\\b']
};
