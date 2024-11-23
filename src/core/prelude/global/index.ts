/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import log from 'core/log';
import extend from 'core/prelude/extend';
import { errorsToIgnore } from 'core/prelude/global/const';

/** @see Any */
extend(globalThis, 'Any', (obj) => obj);

/** @see stderr */
extend(globalThis, 'stderr', (err, ...details: unknown[]) => {
	if (err instanceof Object) {
		if (errorsToIgnore[err.type] === true) {
			log.info('stderr', err, ...details);
			return;
		}

		log.error('stderr', err, ...details);
	}
});
