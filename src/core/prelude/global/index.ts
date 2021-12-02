/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import log from '@src/core/log';
import extend from '@src/core/prelude/extend';
import { errorsToIgnore } from '@src/core/prelude/global/const';

/** @see Any */
extend(globalThis, 'Any', (obj) => obj);

/** @see stderr */
extend(globalThis, 'stderr', (err) => {
	if (err instanceof Object) {
		if (errorsToIgnore[err.type] === true) {
			log.info('stderr', err);
			return;
		}

		log.error('stderr', err);
	}
});
