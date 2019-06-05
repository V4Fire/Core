/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Extended } from 'core/log/base/types';

/**
 * Mixes two objects
 *
 * @param factory
 * @param records
 */
export default function extend<S extends Dictionary, T extends Dictionary>(factory: S, records: T): Extended<S, T> {
	return <any>Object.mixin(false, factory, records);
}
