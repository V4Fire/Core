/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import log from 'core/log';
import extend from 'core/prelude/extend';

/** @see Any */
extend(globalThis, 'Any', (obj) => obj);

/** @see stderr */
extend(globalThis, 'stderr', (err) => {
	if (err instanceof Object) {
		if ({clearAsync: true, abort: true}[String((<Dictionary>err).type)]) {
			log.info('stderr', err);
			return;
		}

		log.error('stderr', err);
	}
});

/** @see devNull */
extend(globalThis, 'devNull', () => { /* empty */ });
