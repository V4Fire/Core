/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { createDict } from 'core/prelude/object/create';

export const errorsToIgnore = createDict({
	clearAsync: true,
	abort: true
});
