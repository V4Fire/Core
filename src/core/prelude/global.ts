/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import log from 'core/log';
import extend from 'core/prelude/extend';
import { GLOBAL } from 'core/prelude/env';

if (typeof globalThis === 'undefined') {
	GLOBAL.globalThis = GLOBAL;
}

/**
 * Converts the specified unknown value to any
 * @param obj
 */
extend(globalThis, 'Any', (obj) => obj);

/**
 * STDERR wrapper
 * @param err
 */
extend(globalThis, 'stderr', (err) => {
	if (err instanceof Object) {
		if ({clearAsync: true, abort: true}[String((<Dictionary>err).type)]) {
			log.info('stderr', err);
			return;
		}

		log.error('stderr', err);
	}
});

/**
 * dev/null wrapper
 * @param obj
 */
extend(globalThis, 'devNull', () => { /* empty */ });
