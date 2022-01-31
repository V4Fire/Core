/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Extended } from 'core/log/base/interface';

/**
 * Mixes two objects
 *
 * @param factory
 * @param records
 */
export default function extend<S extends Dictionary, T extends Dictionary>(factory: S, records: T): Extended<S, T> {
	return Object.mixin<Extended<S, T>>(false, factory, records);
}
