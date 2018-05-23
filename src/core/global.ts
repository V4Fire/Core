/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { GLOBAL } from 'core/const/links';

/**
 * STDERR wrapper
 * @param err
 */
GLOBAL.stderr = function stderr(err: any): void {
	if (err) {
		if (err.type === 'clearAsync') {
			return;
		}

		console.error(err);
	}
};

/**
 * dev/null wrapper
 * @param obj
 */
GLOBAL.devNull = function stderr(obj: any): void {
	return undefined;
};
