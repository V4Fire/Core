/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { asyncLocal } from 'core/kv-storage';
export default asyncLocal.namespace('[[SESSION]]');
